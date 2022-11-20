const http = require("http");
const path = require("path");
const fs = require("fs");
const fsPromises = require("fs").promises;

const logEvents = require("./logEvents");
const EventEmitter = require("events");

//Declare a class and object
class Emitter extends EventEmitter {};

// Initialize object for new event listener
const myEmitter = new Emitter();

// Log Events
myEmitter.on('log', (msg, fileName) => logEvents(msg, fileName));

// define a port for the server
const PORT = process.env.PORT || 3500;

// This is the very basic form of a server
const serveFile = async (filePath, contentType, response) => {
    try {
        const rawData = await fsPromises.readFile(filePath, !contentType.includes("image") ? "utf8" : "" );               // if it is not an image, then render the text
        
        const data = contentType === "application/json" ? JSON.parse(rawData) : rawData;
            
        response.writeHead(filePath.includes("404.html") ? 404 : 200, { "Content-Type": contentType });
        
        response.end(contentType === "application/json" ? JSON.stringify(data) : data );

    } catch (err) {
        console.log(err);
        myEmitter.emit("log", `${err.name}: ${err.message}`, "errLog.txt");
        response.statusCode = 500;
        response.end();
    }
}

// define a minimal server
const server = http.createServer((req, res) => {
    
    console.log(req.url, req.method);       // Log the request URL and the method of the request: / GET
    myEmitter.emit("log", `${req.url}\t${req.method}`, "reqLog.txt");
    
    const extension = path.extname(req.url);

    let contentType;

    // file types we expect to serve on the server
    switch(extension) {
        case ".css":
            contentType = "test/css";
            break;
        case ".js":
            contentType = "text/javascript";
            break;
        case ".json":
            contentType = "application/json";
            break;
        case ".jpg":
            contentType = "image/jpeg";
            break;
        case ".png":
            contentType = "image/png";
            break;
        case ".txt":
            contentType = "text/plain";
            break;
        default:
            contentType = "text/html"
    }
    // Note to self: debug here
    let filePath = 
        contentType === "text/html" && req.url === "/"                      // if content type is HTML & root directory is requested
            ? path.join(__dirname, "views", "index.html")                   // then the page "index.html" is shown
            : contentType === "text/html" && req.url.slice(-1) === "/"      // otherwise it may be a subdirectory, so check for the "/" in the file path
                ? path.join(__dirname, "views", req.url, "index.html")      // display the subdirectory page if it is a subdirectory path
                : contentType === "text/html"                               // otherwise if the other 2 are not true, check if content is HTML
                    ? path.join(__dirname, "views", req.url)                // and that should be in the "views" folder
                    : path.join(__dirname, req.url);                        // otherwise it is something wlse like a picture, so just follow the URL.
    
    // makes the .html extension not required in the browser
    // I think this requires further thought...maybe some updating
    // it definitely requires some planning ahead as is
    if (!extension && req.url.slice(-1) !== "/") { filePath += ".html";}

    const fileExists = fs.existsSync(filePath);

    if (fileExists) {
        // serve the file
        serveFile(filePath, contentType, res);

    } else { // need a 404 Not Found or 301 Redirect
        
        switch(path.parse(filePath).base) {
            case "old-page.html":
                res.writeHead(301, {"Location": "/new-page.html"});         // redirect old page to the updated new page
                res.end();
                break;
            case "www-page.html":
                res.writeHead(301, {"Location": "/"});                      // redirect to the root directory
                res.end();
                break;
            default:
                // Serve the 404 Response for an unknown path
                serveFile(path.join(__dirname, "views", "404.html"), "text/html", res);
        }
    }
});

server.listen(PORT, () => console.log (`Server Running On Port: ${PORT}`));

// // add a listener for the log event
// myEmitter.on("log", (msg) => logEvents(msg));

// // make an event and emit it with a 2 second delay
// setTimeout(() => {
//     myEmitter.emit("log", "LOG EVENT EMITTED!!");
// }, 2000);