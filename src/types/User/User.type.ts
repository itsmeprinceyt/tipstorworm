export interface User {
    id: string;
    name: string | null;
    username?: string | null;
    email: string;
    image: string | null;
    password?: string | null;
    created_at?: Date;
    updated_at?: Date;
}