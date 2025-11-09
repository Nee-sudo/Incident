const mongoose = require("mongoose");

let cachedDb = null;

async function connectToDatabase() {
    if (cachedDb && mongoose.connection.readyState === 1) {
        return cachedDb;
    }

    const mongoDBUrl = process.env.MONGO_DB_URL || "mongodb://localhost:27017/fishTracker";
    
    await mongoose.connect(mongoDBUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    cachedDb = mongoose.connection;
    return cachedDb;
}

module.exports = { connectToDatabase };
