// ./node_modules/.bin/_mocha 'tests/challenge.test.ts'

import { assert } from "chai";
import { calcSig } from "../../src/utils/calcSig";
import { md5 } from "../../src/utils/md5";

const url: string = "http://localhost:8585/api";

const token: string =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHAiOiJkZW1vIiwicGxheWVyIjoiNjhiNWE4NTVhOWVhY2I3NjM5YjY5Zjc3IiwiY3JlYXRlZCI6MTc1NjczNzMwNDE4NiwiaWF0IjoxNzU2NzM3MzA0fQ.JxbsuYc3PBR91z8Z3eM2ErcnJF7A4bim-BGuCT44OoM";

describe("daily-challenge", function () {
  it("save", async function () {
    const [status1] = await save({ year: 2025, month: 10, day: 18, progress: 75, state: "...." });
    assert.equal(status1, 200);

    const [status2] = await save({ year: 2025, month: 10, day: 15, progress: 50, state: "state-2" });
    assert.equal(status2, 200);

    const [status3, json3] = await get();
    assert.equal(status3, 200);
    assert.equal(json3.items.length, 2);
  });
});

type Payload = {
  year: number;
  month: number;
  day: number;
  progress: number;
  state: string;
  sig?: string;
};

async function save(payload: Payload): Promise<[number, any]> {
  payload.sig = calcSig(payload as any, md5("demo"));

  const res = await fetch(`${url}/daily-challenge/demo`, {
    method: "POST",
    headers: { "Content-Type": "application/json", authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
  return [res.status, await res.json()];
}

async function get(): Promise<[number, any]> {
  const payload: any = { year: 2025, month: 10 };
  payload.sig = calcSig(payload, md5("demo"));
  const search = new URLSearchParams(payload);

  const res = await fetch(`${url}/daily-challenge/demo?${search.toString()}`, {
    method: "GET",
    headers: { authorization: `Bearer ${token}` },
  });
  return [res.status, await res.json()];
}
