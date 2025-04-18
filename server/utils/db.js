// import { MongoClient } from "mongodb";

// const connectionString = "mongodb://localhost:27017";

//  const client = new MongoClient(connectionString, {
//   useUnifiedTopology: true,
// });

//  const db = client.db("practice-mongo");
//  const collection = db.collection("users");

// export {client, db, collection};

// filepath: d:\18 apr assignment 2\nodejs-auth-blog-post-app\server\utils\db.js
import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables from a .env file

const connectionString = process.env.MONGO_URI || "mongodb://localhost:27017";

const client = new MongoClient(connectionString, {
  useUnifiedTopology: true,
});

const db = client.db("practice-mongo");
const collection = db.collection("users");

export { client, db, collection };