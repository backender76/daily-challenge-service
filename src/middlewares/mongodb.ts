import { MongoClient, ObjectId } from "mongodb";
import type { MongoClientOptions } from "mongodb";

const DB_HOST = process.env.MONGO_HOST || "localhost";
const DB_PORT = process.env.MONGO_PORT || "27017";
const DB_NAME = process.env.MONGO_DB_NAME || "api";
const DB_USER = process.env.MONGO_INITDB_ROOT_USERNAME || "";
const DB_PASS = process.env.MONGO_INITDB_ROOT_PASSWORD || "";

let promise: Promise<MongoClient> | null = null;

const connect = (): Promise<MongoClient> => {
  if (!promise) {
    const url: string = `mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}`;
    const options: MongoClientOptions = {};

    if (DB_USER && DB_PASS) {
      options.auth = { username: DB_USER, password: DB_PASS };
      options.authSource = "admin";
    }
    promise = MongoClient.connect(url, options);
  }
  return promise;
};

export const close = async () => {
  if (promise) {
    return promise.then((client) => client.close());
  }
};

export const mongo = () => {
  const connectPromise = connect().then(async (client) => {
    console.log(`mongo connect to ${DB_NAME}`);
    const db = client.db(DB_NAME);

    const collection = (name: string) => db.collection(name);
    const makeCollectionSelector = (name: string) => () => collection(name);

    async function collectionsList(): Promise<string[]> {
      return (await db.listCollections().toArray()).map((c) => c.name);
    }

    let list: string[] = await collectionsList();

    return {
      ObjectId: ObjectId,
      collection: collection,
      hasCollection: (name: string) => list.includes(name),
      createCollection: async (name: string) => {
        const collection = db.createCollection(name);
        list = await collectionsList();
        return collection;
      },
      applications: makeCollectionSelector("applications"),
    };
  });

  return (req: any, _res: any, next: any) => {
    Promise.resolve()
      .then(async () => {
        req.mongo = await connectPromise;
      })
      .then(next)
      .catch(next);
  };
};
