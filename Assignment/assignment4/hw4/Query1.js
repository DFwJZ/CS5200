const { MongoClient } = require("mongodb");

// const uri = require("./atlas_uri.js");
const uri = "mongodb://localhost:27017";

const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    const database = client.db("ieeevisTweets");
    const tweets = database.collection("tweet");

    const estimate = await tweets.estimatedDocumentCount();
    console.log(`Number of tweets in the database: ${estimate}`);

    const query = { retweeted_status: { $exists: false } };
    const countNonReweeted = await tweets.countDocuments(query);
    console.log("=====+++++=====+++++=====+++++=====+++++=====+++++=====");
    console.log(
      `Number of tweets that are not retweets or replies: ${countNonReweeted}`
    );
  } catch (e) {
    console.error(e);
  } finally {
    console.log("=====+++++=====+++++=====+++++=====+++++=====+++++=====");
    await client.close();
  }
}
run().catch(console.dir);
