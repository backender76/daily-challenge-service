// ./node_modules/.bin/_mocha 'tests/leaders.test.ts'

import { assert } from "chai";
import { calcSig } from "../../src/utils/calcSig";
import { md5 } from "../../src/utils/md5";

const url: string = "http://localhost:8585/api";

const token: string =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHAiOiJkZW1vIiwicGxheWVyIjoiNjhiNWE4NTVhOWVhY2I3NjM5YjY5Zjc3IiwiY3JlYXRlZCI6MTc1NjczNzMwNDE4NiwiaWF0IjoxNzU2NzM3MzA0fQ.JxbsuYc3PBR91z8Z3eM2ErcnJF7A4bim-BGuCT44OoM";

describe("leaders", function () {
  it("leaders", async function () {
    const payload: any = { id: "0" };
    payload.sig = calcSig(payload, md5("demo"));
    const search = new URLSearchParams(payload);

    const res = await fetch(`${url}/leaders/demo?${search.toString()}`, {
      method: "GET",
      headers: { authorization: `Bearer ${token}` },
    });
    console.log(await res.json());
    assert.equal(res.status, 200);
  });
});
