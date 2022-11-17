const express = require("express");
const router = express.Router();
const path = require("path");

// Rather than using app.get() in the server, we define a router in a new file.
// This will serve the index page in the subdirectory:
router.get("/", (req, res) => {
    //res.send("HELLLOOOO WORLD"); //DEBUG
    res.sendFile(path.join(__dirname, "..", "views", "subdir", "index.html"));
    //res.sendFile("./views/index.html", { root: __dirname }); //Alternate Way to serve root directory
});

// This will also serve the index page in the subdirectory:
router.get("/index(.html)?", (req, res) => {
    //res.send("HELLLOOOO WORLD"); //DEBUG
    res.sendFile(path.join(__dirname, "..", "views", "subdir", "index.html"));
    //res.sendFile("./views/index.html", { root: __dirname }); //Alternate Way to serve root directory
});

// This will serve the test html page in the subdirectory:
router.get("/test(.html)?", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "views", "subdir", "test.html"));
});

module.exports = router;