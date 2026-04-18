import mongoose from 'mongoose';

const MONGODB_URI =
  process.env.MONGODB_URI ||
  process.env.MONGO_URL ||
  (process.env.MONGOUSER && process.env.MONGOPASSWORD && process.env.MONGOHOST
    ? `mongodb://${process.env.MONGOUSER}:${process.env.MONGOPASSWORD}@${process.env.MONGOHOST}:${process.env.MONGOPORT || '27017'}`
    : '');

if (!MONGODB_URI) {
  throw new Error('Missing MongoDB connection string. Set MONGODB_URI or MONGO_URL.');
}

type GlobalWithMongoose = typeof globalThis & {
  mongooseCache?: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
};

const globalForMongoose = globalThis as GlobalWithMongoose;

const cached = globalForMongoose.mongooseCache || {
  conn: null,
  promise: null
};

globalForMongoose.mongooseCache = cached;

export async function connectToDatabase() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      dbName: 'primeresume'
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
