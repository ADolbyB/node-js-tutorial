const express = require("express");
const router = express.Router();
const path = require("path");

router.get("/", (req, res) => {
    //res.send("HELLLOOOO WORLD"); //DEBUG

    res.sendFile(path.join(__dirname, "..", "views", "index.html"));
    //res.sendFile("./views/index.html", { root: __dirname }); //Alternate Way to serve root directory
});

router.get("/index(.html)?", (req, res) => {
    //res.send("HELLLOOOO WORLD"); //DEBUG

    res.sendFile(path.join(__dirname, "..", "views", "index.html"));
    //res.sendFile("./views/index.html", { root: __dirname }); //Alternate Way to serve root directory
});

router.get("/new-page(.html)?", (req, res) => {

    res.sendFile(path.join(__dirname, "..", "views", "new-page.html"));
});

router.get("/old-page(.html)?", (req, res) => {
    // Send a 301 instead (temporary redirect)
    res.redirect(301, "/new-page.html"); //Sends a 302 by default (permanent redirect: for search eng)

});

module.exports = router;