import { MongoClient, Db, Collection } from "mongodb";

const uri = process.env.MONGODB_URI;
const options = {};

let client;
let clientPromise;

if (!process.env.MONGODB_URI) {
  throw new Error("Add MONGODB_URI to .env.local");
}

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export async function getDB() {
  const client = await clientPromise;
  const db = client.db(process.env.MONGODB_DB); // Change this to your database name

  function getCollection(name) {
    return db.collection < T > name;
  }

  return { db, getCollection };
}

export default clientPromise;
