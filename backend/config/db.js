const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        // Fallback supports both Docker ("mongodb") and local ("127.0.0.1")
        const uri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/ecommerce";

        const conn = await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 5000,
        });

        console.log(`MongoDB connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`MongoDB connection failed: ${error.message}`);
        process.exit(1);
    }
};

// Monitor connection events
mongoose.connection.on("disconnected", () => {
    console.warn("MongoDB disconnected. Attempting to reconnect...");
});

mongoose.connection.on("error", (err) => {
    console.error(`MongoDB runtime error: ${err.message}`);
});

module.exports = connectDB;