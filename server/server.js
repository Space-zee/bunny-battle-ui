const { createServer } = require("https");
const { parse } = require("url");
const next = require("next");
const fs = require("fs");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer(
    {
      key: fs.readFileSync("./server/localhost-key.pem"),
      cert: fs.readFileSync("./server/localhost.pem"),
    },
    (req, res) => {
      const parsedUrl = parse(req.url, true);
      handle(req, res, parsedUrl);
    },
  ).listen(3000, (err) => {
    if (err) throw err;
    console.log("> Ready on https://127.0.0.1:3000");
  });
});
