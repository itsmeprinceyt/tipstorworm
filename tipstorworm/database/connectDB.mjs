import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();
const URL = process.env.DATABASE_URL;
const client = new MongoClient(URL);

let cachedDb = null;

export async function connectToDatabase() {
    if (cachedDb) {
        return cachedDb;
    }

    if (!client.isConnected()) {
        await client.connect();
    }

    const db = client.db('admin'); // Replace 'my-database' with your database name
    cachedDb = db;
    return db;
}