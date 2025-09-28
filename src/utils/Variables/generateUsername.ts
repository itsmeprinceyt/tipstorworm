import { v4 as uuidv4 } from "uuid";

export default function generateUsername(name: string) {
    return `${name.trim().toLowerCase().replace(/\s+/g, "_")}_${uuidv4().slice(0, 6)}`;
}