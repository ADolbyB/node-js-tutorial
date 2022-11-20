const express = require('express');
const path = require("path");
const app = express();
const PORT = process.env.PORT || 3500;

app.get("/", (req, res) => {
    //res.send("HELLLOOOO WORLD"); //DEBUG

    res.sendFile(path.join(__dirname, "views", "index.html"));
    //res.sendFile("./views/index.html", { root: __dirname }); //Alternate Way to serve root directory
});

app.get("/index(.html)?", (req, res) => {
    //res.send("HELLLOOOO WORLD"); //DEBUG

    res.sendFile(path.join(__dirname, "views", "index.html"));
    //res.sendFile("./views/index.html", { root: __dirname }); //Alternate Way to serve root directory
});

app.get("/new-page(.html)?", (req, res) => {

    res.sendFile(path.join(__dirname, "views", "new-page.html"));
});

app.get("/old-page(.html)?", (req, res) => {
    // Send a 301 instead (temporary redirect)
    res.redirect(301, "/new-page.html"); //Sends a 302 by default (permanent redirect: for search eng)

});

// Chaining Route Handlers: one way
app.get("/hello(.html)?", (req, res, next) => {
    console.log("Attempted To Load hello.html"); // 1st Route Handler
    next() // Call next function in the chain
}, (req, res) => {
    res.send("!!HELLO WORLD!!"); // 2nd Route Handler
});

// Another way to chain route handlers:
const one = (req, res, next) => {
    console.log("ONE");
    next();
}

const two = (req, res, next) => {
    console.log("TWO");
    next();
}

const three = (req, res) => {
    console.log("THREE");
    res.send("FINISHED!!"); // The last one in the chain does not call next()
}

// Pass the chained handlers as an array argument
app.get("/chain(.html)?", [one, two, three]);

// Route anything else to the Custom 404 Page
app.get("/*", (req, res) => {
    res.status(404).sendFile(path.join(__dirname, "views", "404.html"));
});

app.listen(PORT, () => console.log (`Server Running On Port: ${PORT}`));