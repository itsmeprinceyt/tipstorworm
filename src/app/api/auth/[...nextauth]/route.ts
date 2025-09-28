import NextAuth, { NextAuthOptions, DefaultSession, DefaultUser } from "next-auth";
import Google, { GoogleProfile } from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { initServer, db } from "../../../../lib/initServer";
import type { Pool } from "mysql2/promise";
import { v4 as uuidv4 } from "uuid";
import { MyJWT } from "../../../../types/User/JWT.type";
import { getCurrentDateTime } from "../../../../utils/Variables/getDateTime";
import generateUsername from "../../../../utils/Variables/generateUsername";
import { User } from "../../../../types/User/User.type";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
    console.error("Error: GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET is not set in environment variables.");
    process.exit(1);
}

let pool: Pool | null = null;
async function getPool(): Promise<Pool> {
    if (!pool) {
        await initServer();
        pool = db();
    }
    return pool;
}

function sanitizeString(value: unknown, maxLen = 255): string {
    if (typeof value !== "string") return "";
    const s = value.trim();
    return s.length > maxLen ? s.slice(0, maxLen) : s;
}

function isValidEmail(email: string): boolean {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

declare module "next-auth" {
    interface Session {
        user: {
            id?: string;
            name?: string | null;
            username?: string | null;
            email?: string;
            image?: string | null;
        } & DefaultSession["user"];
    }
    interface User extends DefaultUser {
        id?: string;
        name?: string | null;
        username?: string | null;
        email?: string;
        image?: string | null;
    }
}

const authOptions: NextAuthOptions = {
    session: { strategy: "jwt" },

    providers: [
        Google({
            clientId: GOOGLE_CLIENT_ID,
            clientSecret: GOOGLE_CLIENT_SECRET,
        }),
        // TODO: fix this , its not letting us login via email and password
        CredentialsProvider({
            name: "Email/Password",
            credentials: {
                email: { label: "Email", type: "text", placeholder: "you@example.com" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials.password)
                    throw new Error("Email & password required");

                const pool = await getPool();
                const [rows] = await pool.execute("SELECT * FROM users WHERE email = ?", [credentials.email]);
                const user = (rows as User[])[0];

                if (!user) throw new Error("No account found");
                if (!user.password) throw new Error("Please set a password via Google first");

                const isValid = await bcrypt.compare(credentials.password, user.password);
                if (!isValid) throw new Error("Invalid password");

                // Return the object that will be saved in the JWT/session
                return {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    username: user.username,
                    image: user.image,
                };
            },
        }),
    ],

    callbacks: {
        async signIn({ profile }) {
            const now = getCurrentDateTime();
            const googleProfile = profile as GoogleProfile;

            if (!googleProfile.email) return false;

            const email = sanitizeString(googleProfile.email, 320);
            if (!isValidEmail(email)) return false;

            const name = sanitizeString(googleProfile.name ?? "", 255);
            const image = sanitizeString(googleProfile.picture ?? "", 500);

            const pool = await getPool();

            const [rows] = await pool.execute<MyJWT[]>(
                "SELECT id, name, username, image FROM users WHERE email = ?",
                [email]
            );

            if (!Array.isArray(rows)) return false;

            if (rows.length === 0) {
                const newId = uuidv4();
                const username = generateUsername(name);

                await pool.execute(
                    "INSERT INTO users (id, name, username, email, password, image, created_at, updated_at) VALUES (?, ?, ?, ?, NULL, ?, ?, ?)",
                    [newId, name || undefined, username, email, image || undefined, now, now]
                );
            } else {
                const user = rows[0];
                if ((user.name ?? "") !== name || (user.image ?? "") !== image) {
                    await pool.execute(
                        "UPDATE users SET name = ?, image = ?, updated_at = ? WHERE email = ?",
                        [name || user.name, image || user.image, now, email]
                    );
                }
            }

            return true;
        },

        async jwt({ token, user }) {
            const t = token as MyJWT;

            if (user) {
                t.id = (user as MyJWT).id ?? t.id;
                t.username = (user as MyJWT).username ?? t.username;
                t.name = user.name ?? t.name;
                t.email = user.email ?? t.email;
                t.image = user.image ?? t.image;
            }

            return t;
        },

        async session({ session, token }) {
            const t = token as MyJWT;

            if (session.user) {
                session.user.id = t.id;
                session.user.username = t.username ?? null;
                session.user.name = t.name;
                session.user.email = t.email;
                session.user.image = t.image;
            }

            return session;
        },
    },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
