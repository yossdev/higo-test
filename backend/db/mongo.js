const mongoose = require("mongoose");

// Singleton instance
let connection = null;

const clientOptions = {
  serverApi: {
    version: "1",
    strict: true,
    deprecationErrors: true,
  },
  dbName: process.env.MONGO_DB,
};

async function mongoDbConn() {
  if (connection) {
    // If a connection already exists, return the same one
    return connection;
  }

  try {
    // Create a Mongoose client with a MongoClientOptions object to set the Stable API version
    await mongoose.connect(process.env.MONGO_URI, clientOptions);
    await mongoose.connection.db.admin().command({ ping: 1 });
    console.log("Connected to MongoDB!");
    return connection;
  } catch (error) {
    console.error("Failed to connect to MongoDB", error);
    process.exit(1);
  }
}

module.exports = mongoDbConn;
