const tsNode = require("ts-node");

// https://www.npmjs.com/package/ts-node#configuration
tsNode.register({
  files: true,
  transpileOnly: true,
  project: "./tsconfig.json",
});
