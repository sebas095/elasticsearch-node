require("colors");
const { PORT } = require("./config");

const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const logger = require("morgan");
const indexRoute = require("./routes");

app
  .use(bodyParser.json())
  .use(express.static(path.join(__dirname, "public")))
  .use(cors())
  .use(logger("dev"));

// Routes
indexRoute(app, "/");

app.listen(PORT, () => {
  console.log("Express server listening on port " + PORT);
});
