require("dotenv").config();
const express = require('express');
const path = require("path");
const app = express();
const cors = require("cors");
const corsOptions = require("./config/corsOptions");
const { logger } = require("./middleware/logEvents");
const errorHandler = require("./middleware/errorHandler");
const verifyJWT = require("./middleware/verifyJWT");
const cookieParser = require("cookie-parser");
const credentials = require("./middleware/credentials");
const mongoose = require("mongoose"); // Connects to MongoDB
const connectDB = require("./config/dbConn"); // MongoDB Connection Configuration

const PORT = process.env.PORT || 3500;

// Connect to MongoDB:
connectDB();

// Same Logger, just cleaner:
app.use(logger);

// Handle Options credentials check before CORS
// and fetch cookies credentials requirement
app.use(credentials);

// Move corsOptions function definition to corsOptions.js
app.use(cors(corsOptions));

// This is "built in" middleware to handle URL encoded form data
app.use(express.urlencoded({ extended: false }));

// built-in middleware for .json data:
app.use(express.json());

// Middleware for cookies:
app.use(cookieParser());

// Serve static files for main folder (CSS and Images, etc):
app.use("/", express.static(path.join(__dirname, "/public")));
// Serve static files in the subdirectory:

// Routes: 
app.use("/", require("./routes/root"));
app.use("/register", require("./routes/register"));
app.use("/auth", require("./routes/auth"));
app.use("/refresh", require("./routes/refresh")); // This route issues New Access Token: Verified by verifyJWT()
app.use("/logout", require("./routes/logout"));

app.use(verifyJWT); // put this AFTER the routes you don't want verified with a JWT
app.use("/employees", require("./routes/api/employees"));

// Better option for the Custom 404 Page: Anything that made it this far gets redirected to the 404 page
// app.all() is more for routing and applies to all http methods at once.
app.all("*", (req, res) => {
    res.status(404);
    if (req.accepts("html")) {
        res.sendFile(path.join(__dirname, "views", "404.html"));
    } else if (req.accepts("json")) {
        res.json({ error: "404: Not Found!!" });
    } else {
        res.type("txt").send("404: Not Found!!");
    }
});

// Same Error Logging Function, but cleaner:
// Define the function in the errorHandler.js file instead
app.use(errorHandler);

// Only listen for requests if we connect & the open event is emitted
mongoose.connection.once("open", () => {
    console.log("Connected to MongoDB...");
    app.listen(PORT, () => console.log (`Server Running On Port: ${PORT}`));
});