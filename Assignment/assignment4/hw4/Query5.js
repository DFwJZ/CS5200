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

    // Drop the collections if they exist
    const collections = await database
      .listCollections({}, { nameOnly: true })
      .toArray();
    const collectionNames = collections.map((c) => c.name);

    if (collectionNames.includes("user")) {
      await database.collection("user").drop();
      console.log("Dropped 'user' collection.");
    }

    if (collectionNames.includes("tweets_only")) {
      await database.collection("tweets_only").drop();
      console.log("Dropped 'tweets_only' collection.");
    }

    // Create two new collections: 1. user, 2. tweet_only
    const users = database.collection("user");
    const tweetsOnly = database.collection("tweet_only");

    // 1. Create user collection with unique user identifier
    const userPipeline = [
      {
        $group: {
          _id: "$user.id_str",
          userDoc: { $first: "$user" },
        },
      },
    ];

    const userResult = await tweets.aggregate(userPipeline).toArray();
    // Construct an array of documents to insert
    let documentsToInsert = userResult.map((user) => user.userDoc);

    // Use insertMany to insert all documents at once
    await users.insertMany(documentsToInsert);
    // 2. Create tweet_only collection referencing user'ID
    const tweetPointer = tweets.find();
    while (await tweetPointer.hasNext()) {
      const tweet = await tweetPointer.next();
      const tweetData = {
        ...tweet,
        user_id_str: tweet.user.id_str,
      };
      delete tweetData.user;
      await tweetsOnly.insertOne(tweetData);
    }
    console.log("=====+++++=====+++++=====+++++=====+++++=====+++++=====");
    console.log(
      "Users collection and Tweets_Only collection have been created."
    );
  } catch (e) {
    console.error(e);
  } finally {
    console.log("=====+++++=====+++++=====+++++=====+++++=====+++++=====");
    await client.close();
  }
}
run().catch(console.dir);
