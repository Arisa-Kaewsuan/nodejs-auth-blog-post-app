import { MongoClient } from "mongodb";

const connectionString = "mongodb://localhost:27017";

export const client = new MongoClient(connectionString);


export async function connectDb() {
  await client.connect();
  console.log("✅ Connected to MongoDB");
  return client.db("practice-mongo");
}
