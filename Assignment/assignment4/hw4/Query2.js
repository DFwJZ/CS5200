const { MongoClient } = require("mongodb");

// const uri = require("./atlas_uri.js");
const uri = "mongodb://localhost:27017";

console.log("uri:", uri);

const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    const database = client.db("ieeevisTweets");
    const tweets = database.collection("tweet");

    const pipeline = [
      {
        $group: {
          _id: "$user.name",
          followers: { $max: "$user.followers_count" },
        },
      },
      { $sort: { followers: -1 } },
      { $limit: 10 },
    ];

    const result = await tweets.aggregate(pipeline).toArray();
    console.log("=====+++++=====+++++=====+++++=====+++++=====+++++=====");
    console.log("Top 10 screen_names by their number of followers:");
    console.log(result);
  } catch (e) {
    console.error(e);
  } finally {
    console.log("=====+++++=====+++++=====+++++=====+++++=====+++++=====");
    await client.close();
  }
}
run().catch(console.dir);
