// Working with the fs = filesystem common core module
// Docs: https://nodejs.org/dist/latest-v18.x/docs/api/fs.html

const fs = require("fs");
const path = require("path");

// fs.readFile("./files/starter.txt", (err, data) => {
//     if(err) throw err;
//     console.log(data);              // display as buffer data in HEX
//     console.log(data.toString());   // Display as a string value
// })

// fs.readFile("./files/starter.txt", "utf-8", (err, data) => {
//     if(err) throw err;
//     console.log(data);              // UTF-8 unencodes buffer data to display as a string
// })

fs.readFile(path.join(__dirname, "files", "starter.txt"), "utf-8", (err, data) => {
    if (err) throw err;
    console.log(data);
})

console.log("Hello...");            // Hello is logged to the console first unless the "path" module is imported

fs.writeFile(path.join(__dirname, "files", "reply.txt"), "Write this Text to FILE", (err) => {
    if (err) throw err;
    console.log("Writing file completed");
})

// Note that appendFile will create a file if it does not already exist
fs.appendFile(path.join(__dirname, "files", "reply.txt"), "\nAPPENDING this Text to FILE", (err) => {
    if (err) throw err;
    console.log("Appending completed");
})

// For errors: exit on uncaught errors
process.on("uncaughtException", err => {
    console.error(`There was an uncaught error: ${err}`);
    process.exit(1);
})