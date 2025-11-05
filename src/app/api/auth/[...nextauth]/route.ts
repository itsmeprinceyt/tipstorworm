import NextAuth, {
  NextAuthOptions,
  DefaultSession,
  DefaultUser,
} from "next-auth";
import Google, { GoogleProfile } from "next-auth/providers/google";
import { initServer, db } from "../../../../lib/initServer";
import type { Pool } from "mysql2/promise";
import { MyJWT } from "../../../../types/User/JWT.type";
import { getCurrentDateTime } from "../../../../utils/Variables/getDateTime";
import generateUsername from "../../../../utils/Variables/generateUsername";
import { cookies } from "next/headers";
import { generateHexId } from "@/utils/Variables/generateHexID.util";
import { logAudit } from "../../../../utils/Variables/AuditLogger";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!;

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
      user_id?: string;
      name?: string;
      username?: string | null;
      email?: string;
      image?: string | null;
      cover_image?: string | null;
      bio: string;
      website: string;
      visibility: "public" | "private";
      is_admin?: boolean;
      is_mod?: boolean;
      is_banned?: boolean;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    id?: string;
    user_id?: string;
    name?: string;
    username?: string | null;
    email?: string;
    image?: string | null;
    cover_image?: string | null;
    bio: string;
    website: string;
    visibility: "public" | "private";
    is_admin?: boolean;
    is_mod?: boolean;
    is_banned?: boolean;
  }
}

const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  providers: [
    Google({
      clientId: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "select_account",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],
  pages: {
    signIn: "/login",
    error: "/login",
  },

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
        "SELECT id FROM users WHERE email = ?",
        [email]
      );

      const userExists = Array.isArray(rows) && rows.length > 0;
      if (userExists) {
        await pool.execute(
          "UPDATE users SET name = ?, image = ?, updated_at = ? WHERE email = ?",
          [name, image, now, email]
        );
        (await cookies()).set("invite_token", "", { expires: new Date(0) });
        return true;
      }

      const cookieStore = cookies();
      const token = (await cookieStore).get("invite_token")?.value;

      if (!token) {
        console.log("New user attempted signup without invite token");
        return false;
      }

      if (token.length !== 36 || !/^[a-zA-Z0-9-]+$/.test(token)) {
        console.log("Invalid token format in cookie");
        return false;
      }

      try {
        let isValidToken = false;
        let isMasterToken = false;

        const [tokenRows] = await pool.execute(
          `SELECT * FROM invite_tokens 
                    WHERE token = ? 
                    AND active = 1 
                    AND (max_uses > uses OR max_uses = 0)
                    AND (expires_at IS NULL OR expires_at > ?)`,
          [token, now]
        );

        if (Array.isArray(tokenRows) && tokenRows.length > 0) {
          isValidToken = true;
          isMasterToken = false;

          await pool.execute(
            `UPDATE invite_tokens 
                         SET uses = uses + 1, 
                             active = IF(uses + 1 >= max_uses, 0, active)
                         WHERE token = ?`,
            [token]
          );
        } else {
          const [masterTokenRows] = await pool.execute(
            `SELECT * FROM master_invite_token WHERE token = ?`,
            [token]
          );

          if (Array.isArray(masterTokenRows) && masterTokenRows.length > 0) {
            isValidToken = true;
            isMasterToken = true;

            await pool.execute(
              `UPDATE master_invite_token SET uses = uses + 1 WHERE token = ?`,
              [token]
            );
          }
        }

        if (!isValidToken) {
          console.log("Invalid or expired token");
          return false;
        }

        const newId: string = generateHexId(36);
        const userId: string = generateHexId(12);
        const username: string = generateUsername(name);

        if (!isMasterToken) {
          await logAudit(
            {
              user_id: userId,
              email: email,
              name: name,
            },
            "invite_token_deactivate",
            `Token (${token}) deactivated as it is used by the user (${email})`,
            {
              token: token,
              user_id: userId,
              email: email,
              name: name,
            }
          );
        }

        await pool.execute(
          "INSERT INTO users (id, user_id, name, username, email, image, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
          [
            newId,
            userId,
            name || undefined,
            username,
            email,
            image || undefined,
            now,
            now,
          ]
        );

        await logAudit(
          {
            user_id: userId,
            email: email,
            name: name,
          },
          "user_signup",
          `New user signed up using ${
            isMasterToken ? "master token" : "token"
          }`,
          {
            user_id: userId,
            email: email,
            name: name,
            used_master_token: isMasterToken,
          }
        );

        (await cookies()).set("invite_token", "", { expires: new Date(0) });
        return true;
      } catch (error: unknown) {
        console.error("Token validation error in signIn:", error);
        return false;
      }
    },

    async jwt({ token, user, account, profile }) {
      const t = token as MyJWT;
      const pool = await getPool();

      let emailToCheck: string | null = null;

      if (account?.provider === "google" && profile) {
        const googleProfile = profile as GoogleProfile;
        emailToCheck = googleProfile.email;
      }

      if (user?.email) {
        emailToCheck = user.email;
      }

      if (emailToCheck) {
        const [rows] = await pool.execute<MyJWT[]>(
          "SELECT id, user_id, name, username, email, image, cover_image, bio, website, visibility, is_admin, is_mod, is_banned FROM users WHERE email = ?",
          [emailToCheck]
        );

        if (Array.isArray(rows) && rows.length > 0) {
          const dbUser = rows[0];
          t.id = dbUser.id ?? t.id;
          t.user_id = dbUser.user_id ?? t.user_id;
          t.name = dbUser.name ?? "";
          t.username = dbUser.username ?? null;
          t.email = dbUser.email ?? emailToCheck;
          t.image = dbUser.image ?? "";
          t.cover_image = dbUser.cover_image ?? "";
          t.bio = dbUser.bio ?? "";
          t.website = dbUser.website ?? "";
          t.visibility = dbUser.visibility ?? "public";
          t.is_admin = Boolean(dbUser.is_admin);
          t.is_mod = Boolean(dbUser.is_mod);
          t.is_banned = Boolean(dbUser.is_banned);
        }
      }

      return t;
    },

    async session({ session, token }) {
      const t = token as MyJWT;

      if (session.user) {
        session.user.id = t.id;
        session.user.user_id = t.user_id;
        session.user.name = t.name;
        session.user.username = t.username ?? null;
        session.user.email = t.email;
        session.user.image = t.image;
        session.user.cover_image = t.cover_image;
        session.user.bio = t.bio;
        session.user.website = t.website;
        session.user.visibility = t.visibility;
        session.user.is_admin = Boolean(t.is_admin);
        session.user.is_mod = Boolean(t.is_mod);
        session.user.is_banned = Boolean(t.is_banned);
      }

      return session;
    },

    async redirect({ url, baseUrl }) {
      if (url.startsWith(baseUrl)) return url;
      return baseUrl + "/dashboard";
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
export { authOptions };
