import type { Collection, Document } from "mongodb";
import type { Request } from "express";

export interface MongoHelpers {
  ObjectId: any,
  collection(name: string): Collection<Document>;
  hasCollection(name: string): boolean;
  createCollection(name: string): Collection<Document>;

  applications(): Collection<Document>;
}

export interface ApiReq extends Request {
  mongo: MongoHelpers;
  jwt: AuthTokenPayload;
}
