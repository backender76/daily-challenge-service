// ./node_modules/.bin/_mocha 'tests/score.test.ts'

import { assert } from "chai";

const url: string = "http://localhost:8585/api";

const token: string =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHAiOiJkZW1vIiwicGxheWVyIjoiNjhiNWE4NTVhOWVhY2I3NjM5YjY5Zjc3IiwiY3JlYXRlZCI6MTc1NjczNzMwNDE4NiwiaWF0IjoxNzU2NzM3MzA0fQ.JxbsuYc3PBR91z8Z3eM2ErcnJF7A4bim-BGuCT44OoM";

describe("score", function () {
  it("score", async function () {
    const res = await fetch(`${url}/score/demo`, {
      method: "POST",
      headers: { "Content-Type": "application/json", authorization: `Bearer ${token}` },
      body: JSON.stringify({ score: 100, id: 0 }),
    });
    assert.equal(res.status, 200);
  });
});
