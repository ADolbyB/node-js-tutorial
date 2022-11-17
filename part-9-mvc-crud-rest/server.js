const express = require('express');
const path = require("path");
const app = express();
const cors = require("cors");
const corsOptions = require("./config/corsOptions");
const { logger } = require("./middleware/logEvents");
const errorHandler = require("./middleware/errorHandler");

const PORT = process.env.PORT || 3500;

// Same Logger, just cleaner:
app.use(logger);

// Move corsOptions function definition to corsOptions.js
app.use(cors(corsOptions));

// This is "built in" middleware to handle URL encoded form data
app.use(express.urlencoded({ extended: false }));

// built-in middleware for .json data:
app.use(express.json());

// Serve static files for main folder (CSS and Images, etc):
app.use("/", express.static(path.join(__dirname, "/public")));
// Serve static files in the subdirectory:

// Routes: 
app.use("/", require("./routes/root"));
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

app.listen(PORT, () => console.log (`Server Running On Port: ${PORT}`));