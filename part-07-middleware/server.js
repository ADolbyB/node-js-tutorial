const express = require('express');
const path = require("path");
const app = express();
const cors = require("cors");
const { logger } = require("./middleware/logEvents");
const errorHandler = require("./middleware/errorHandler");

const PORT = process.env.PORT || 3500;

// What is middleware? Typically implemented with app.use()
// Anything that happens between the request and response.
// Note that app.use() does not accept Regex


// // Custom Middleware Logger:
// app.use((req, res, next) => {
//     logEvents(`${req.method}\t${req.headers.origin}\t${req.url}`, "reqLog.txt");
//     console.log(`${req.method} ${req.path}`);
//     next();
// });

// Same Logger, just cleaner:
// Define the function in the logEvents.js file instead
app.use(logger);

// Cross Origin Resource Sharing
// Prevent CORS errors in your browser: you need to White List the domains
const whitelist = ["https://joelbrigida.com", "http://127.0.0.1:5500", "http://localhost:3500"];
const corsOptions = {
    origin: (origin, callback) => {
        if (whitelist.indexOf(origin) !== -1 || !origin) { // Remove the 'OR NOT ORIGIN' for production
            callback(null, true)
        } else {
            callback(new Error("Not Allowed By CORS"));
        }
    },
    optionsSuccessStatus: 200 // Send a 200 status if successful
}
app.use(cors(corsOptions));

// This is "built in" middleware to handle URL encoded data
// "content-type": application/x-www-form-urlencoded
// Allows us to get form data
app.use(express.urlencoded({ extended: false }));

// built-in middleware for .json data:
app.use(express.json());

// Serve static files:
app.use(express.static(path.join(__dirname, "/public")));

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

// // Route anything else to the Custom 404 Page
// app.get("/*", (req, res) => {
//     res.status(404).sendFile(path.join(__dirname, "views", "404.html"));
// });

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


// Anonymoous function for error logging:
// app.use(function (err, req, res, next) {
//     console.error(err.stack);
//     res.status(500).send(err.message);
// });

// Same Error Logging Function, but cleaner:
app.use(errorHandler);

app.listen(PORT, () => console.log (`Server Running On Port: ${PORT}`));