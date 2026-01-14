import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;

if (!uri) {
    throw new Error("MONGODB_URI environment variable must be defined");
}

export const client = new MongoClient(uri);

let _db: any = null

export async function getDb() {
    if (_db) return _db

    await client.connect()
    console.log("mongodb connected")

    _db = client.db()
    return _db
}
