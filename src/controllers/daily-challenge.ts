import type { Request, Response } from "express";
import { ApiReq, MongoHelpers } from "../types";
import { Collection, Document } from "mongodb";

export const save = async (req: Request, res: Response) => {
  const { year, month, day, progress, state } = req.body;
  const { mongo, jwt } = req as ApiReq;

  const collection = await getCollection(mongo, jwt.app);

  await collection.updateOne(
    { player: new mongo.ObjectId(jwt.player), year, month, day },
    { $set: { state, progress, updated: Date.now() }, $setOnInsert: { created: Date.now() } },
    { upsert: true }
  );

  setTimeout(() => clear(collection), 1000);

  res.send({});
};

export const get = async (req: Request, res: Response) => {
  const { year, month } = req.query;
  const { mongo, jwt } = req as ApiReq;

  const filter: any = { player: new mongo.ObjectId(jwt.player), year: Number(year), month: Number(month) };

  if (req.query.day) {
    filter.day = Number(req.query.day);
  }
  const collection = await getCollection(mongo, jwt.app);
  const list = await collection.find(filter).toArray();

  res.send({
    items: list.map((item) => {
      return {
        year: item.year,
        month: item.month,
        day: item.day,
        progress: item.progress,
        state: item.state,
      };
    }),
  });
};

async function clear(collection: Collection<Document>) {
  const MS_IN_DAY: number = 1000 * 60 /* min */ * 60 * 24 /* day */ * 365;
  collection.deleteMany({ created: { $lt: Date.now() - MS_IN_DAY } });
}

async function getCollection(mongo: MongoHelpers, app: string) {
  const name: string = `${app}-daily-challenge`;
  const init = await createCollection(mongo, name);
  const collection = mongo.collection(name);

  if (init) {
    collection.createIndex({ created: 1 });
    collection.createIndex({ player: 1 });
    collection.createIndex({ year: 1 });
    collection.createIndex({ month: 1 });
  }
  return collection;
}

async function createCollection(mongo: MongoHelpers, name: string): Promise<boolean> {
  if (mongo.hasCollection(name) == false) {
    mongo.createCollection(name);
    return true;
  }
  return false;
}
