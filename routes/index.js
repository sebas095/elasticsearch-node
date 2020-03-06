const express = require("express");
const router = express.Router();
const path = require("path");

const { Client } = require("@elastic/elasticsearch");
const { ES_HOST, ES_PORT } = require("../config");

const client = new Client({ node: `http://${ES_HOST}:${ES_PORT}` });

client.ping(err => {
  if (err) {
    console.error("elasticsearch cluster is down!");
  } else {
    console.log("Everything is ok");
  }
});

module.exports = (app, mountPoint) => {
  router.get("/", (req, res) => {
    res.sendFile("template.html", {
      root: path.join(__dirname, "/../views")
    });
  });

  router.get("/v2", (req, res) => {
    res.sendFile("template2.html", {
      root: path.join(__dirname, "/../views")
    });
  });

  router.get("/search", (req, res) => {
    let body = {
      size: 200,
      from: 0,
      query: {
        match: {
          name: req.query["q"]
        }
      }
    };

    client
      .search({ index: "scotch.io-tutorial", body: body, type: "cities_list" })
      .then(results => {
        res.send(results.body.hits.hits);
      })
      .catch(err => {
        console.log(err);
        res.send([]);
      });
  });

  app.use(mountPoint, router);
};
