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
          _id: "$user.id_str",
          name: { $first: "$user.name" },
          retweetsAve: { $avg: "$retweet_count" },
          tweetCount: { $sum: 1 },
        },
      },
      { $match: { tweetCount: { $gt: 3 } } },
      { $sort: { retweetsAve: -1 } },
      { $limit: 10 },
    ];

    const result = await tweets.aggregate(pipeline).toArray();
    console.log("=====+++++=====+++++=====+++++=====+++++=====+++++=====");
    console.log("Top 10 users by their average retweet count:");
    result.forEach((user) => {
      console.log(`${user.name} (${user.retweetsAve} retweets)`);
    });
  } catch (e) {
    console.error(e);
  } finally {
    console.log("=====+++++=====+++++=====+++++=====+++++=====+++++=====");
    await client.close();
  }
}
run().catch(console.dir);
