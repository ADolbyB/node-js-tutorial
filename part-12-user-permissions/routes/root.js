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

module.exports = router;