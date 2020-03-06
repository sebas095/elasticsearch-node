const { Client } = require("@elastic/elasticsearch");
const { ES_HOST, ES_PORT } = require("./config");
require("colors");

const cities = require("./data/cities.json");
const client = new Client({ node: `http://${ES_HOST}:${ES_PORT}` });
let bulk = [];

client.ping(err => {
  if (err) {
    console.error("elasticsearch cluster is down!");
  } else {
    console.log("Everything is ok");
  }
});

client.indices.create({ index: "scotch.io-tutorial" }, (err, resp, status) => {
  if (err) {
    console.log(err);
  } else {
    console.log("created new index", resp);
  }
});

cities.forEach(city => {
  bulk.push({
    index: {
      _index: "scotch.io-tutorial",
      _type: "cities_list"
    }
  });
  bulk.push(city);
});

client.bulk({ body: bulk }, (err, resp) => {
  if (err) {
    console.log("Failed Bulk operation".red, err);
  } else {
    console.log("Successfully imported %s".green, bulk.length);
  }
});
