import fs from "fs";

export const VERSION = JSON.parse(
  fs.readFileSync("package.json", "utf-8")
).version;

export const NPM_NAME = "create-happy-path";
