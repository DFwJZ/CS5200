const { MongoClient } = require("mongodb");

// const uri = require("./atlas_uri.js");
const uri = "mongodb://localhost:27017";

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
          tweetCount: { $sum: 1 },
        },
      },
      { $sort: { tweetCount: -1 } },
      { $limit: 10 },
    ];
    const [mostActiveUser] = await tweets.aggregate(pipeline).toArray();
    console.log("=====+++++=====+++++=====+++++=====+++++=====+++++=====");
    if (mostActiveUser) {
      console.log(
        `User with the most tweets: ${mostActiveUser._id} (${mostActiveUser.tweetCount} tweets)`
      );
    } else {
      console.log("No users found");
    }
  } catch (e) {
    console.error(e);
  } finally {
    console.log("=====+++++=====+++++=====+++++=====+++++=====+++++=====");
    await client.close();
  }
}
run().catch(console.dir);
