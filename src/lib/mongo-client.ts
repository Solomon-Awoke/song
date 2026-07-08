// MongoClient promise for @auth/mongodb-adapter
// Cached pattern prevents connection storms in development
// Uses lazy initialization to avoid build-time connection errors

import { MongoClient } from "mongodb";

const options = {};

declare global {
  /* eslint-disable no-var */
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

function getUri(): string {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    // Return a placeholder during build — real connection happens at runtime
    return "mongodb://localhost:27017/placeholder";
  }
  return uri;
}

function getClientPromise(): Promise<MongoClient> {
  const uri = getUri();
  
  if (process.env.NODE_ENV === "development") {
    if (!global._mongoClientPromise) {
      global._mongoClientPromise = new MongoClient(uri, options).connect();
    }
    return global._mongoClientPromise;
  }
  
  return new MongoClient(uri, options).connect();
}

const clientPromise: Promise<MongoClient> = getClientPromise();

export default clientPromise;
