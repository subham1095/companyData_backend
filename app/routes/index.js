const routes = require("express").Router();
const api = require("./api");

routes.get("/", (req, res) => {
  res.status(200).send("OK");
});

// api
routes.use("/api", api);

module.exports = routes;
