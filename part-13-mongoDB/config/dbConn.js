const mongoose = require("mongoose");

const connectDB = async () => { // Try to connect with mongoose
    try { // Try to connect to MongoDB
        await mongoose.connect(process.env.DATABASE_URI, {
            useUnifiedTopology: true,
            useNewUrlParser: true
        });

    } catch (err) {
        console.error(err);
    }
}

module.exports = connectDB;