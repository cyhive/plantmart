import { MongoClient, type MongoClientOptions } from 'mongodb';

const uri = process.env.MONGODB_URI;
if (!uri && process.env.NODE_ENV !== 'test') {
  console.warn('MONGODB_URI is not set. API routes that use the database will fail.');
}

const options: MongoClientOptions = {
  maxPoolSize: 5,
  minPoolSize: 0,
  maxIdleTimeMS: 20_000,
  connectTimeoutMS: 10_000,
  serverSelectionTimeoutMS: 10_000,
};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

const globalForMongo = globalThis as unknown as {
  _mongoClientPromise?: Promise<MongoClient>;
};

function getClientPromise(): Promise<MongoClient> {
  if (!uri) {
    return Promise.reject(new Error('MONGODB_URI is not configured'));
  }
  if (process.env.NODE_ENV === 'development') {
    if (!globalForMongo._mongoClientPromise) {
      client = new MongoClient(uri, options);
      globalForMongo._mongoClientPromise = client.connect();
    }
    return globalForMongo._mongoClientPromise;
  }
  if (!clientPromise) {
    client = new MongoClient(uri, options);
    clientPromise = client.connect();
  }
  return clientPromise;
}

export async function getMongoClient(): Promise<MongoClient> {
  return getClientPromise();
}

export async function getDb() {
  const c = await getMongoClient();
  const name = process.env.MONGODB_DB ?? 'Pacha Bhoomi';
  return c.db(name);
}
