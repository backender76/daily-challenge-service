import type { Request, Response } from "express";
import { ApiReq, MongoHelpers } from "../types";

export const setScore = async (req: Request, res: Response) => {
  const { mongo, jwt } = req as ApiReq;
  const scores = await getScoresCollection(mongo, jwt.app);

  await scores.updateOne(
    { player: new mongo.ObjectId(jwt.player), id: req.body.id },
    { $set: { score: req.body.score, updated: Date.now() }, $setOnInsert: { created: Date.now() } },
    { upsert: true }
  );
  res.send({});
};

export const leaders = async (req: Request, res: Response) => {
  const { mongo, jwt } = req as ApiReq;
  const scores = await getScoresCollection(mongo, jwt.app);
  let userRank: number = -1;

  // const top = await scores
  //   .find({ id: Number(req.query.id) })
  //   .sort({ score: -1 })
  //   .limit(10)
  //   .toArray();

  const top = await scores
    .aggregate([
      { $match: { id: Number(req.query.id) } },
      { $sort: { score: -1 } },
      { $limit: 10 },
      { $lookup: { from: `${jwt.app}-players-profiles`, localField: "player", foreignField: "player", as: "profile" } },
    ])
    .toArray();

  const playerId = new mongo.ObjectId(jwt.player);

  if (top.findIndex((i) => playerId.equals(i.player)) === -1) {
    // const losers = await scores
    //   .aggregate([
    //     { $match: { id: Number(req.query.id) } },
    //     { $sort: { score: -1 } },
    //     { $limit: 10 },
    //     {
    //       $lookup: { from: `${jwt.app}-players-profiles`, localField: "player", foreignField: "player", as: "profile" },
    //     },
    //   ])
    //   .toArray();
  }
  const entries = top.map((i, index) => {
    if (playerId.equals(i.player)) {
      userRank = index + 1;
    }
    return {
      rank: index + 1,
      avatar: i.profile && i.profile.length ? i.profile[0].avatar : "",
      name: i.profile && i.profile.length ? i.profile[0].name : "",
      score: i.score,
      authorized: true,
    };
  });

  res.send({ entries, userRank });
};

async function getScoresCollection(mongo: MongoHelpers, app: string) {
  const name: string = `${app}-scores`;
  const init = await createCollection(mongo, name);
  const collection = mongo.collection(name);
  if (init) collection.createIndex({ score: 1 });
  return collection;
}

async function createCollection(mongo: MongoHelpers, name: string): Promise<boolean> {
  if (mongo.hasCollection(name) == false) {
    mongo.createCollection(name);
    return true;
  }
  return false;
}
