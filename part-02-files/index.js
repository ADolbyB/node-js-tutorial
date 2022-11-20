// Working with the fs = filesystem common core module
// Docs: https://nodejs.org/dist/latest-v18.x/docs/api/fs.html

const fs = require("fs");
const path = require("path");
const fsPromises = require("fs").promises;

const fileOps = async () => {
    try {
        const data = await fsPromises.readFile(path.join(__dirname, "files", "starter.txt"), "utf8");
        console.log(data);
        await fsPromises.unlink(path.join(__dirname, "files", "starter.txt"));      // deletes file
        await fsPromises.writeFile(path.join(__dirname, "files", "promiseWrite.txt"), data);
        await fsPromises.appendFile(path.join(__dirname, "files", "promiseWrite.txt"), "\nThis is the data that is APPENDED");
        await fsPromises.rename(path.join(__dirname, "files", "promiseWrite.txt"), path.join(__dirname, "files", "promiseComplete.txt"));
        const newData = await fsPromises.readFile(path.join(__dirname, "files", "promiseComplete.txt"), "utf8");
        console.log(newData);
    } catch (err) {
        console.error(err);
    }
}

fileOps();

// fs.readFile("./files/starter.txt", (err, data) => {
//     if(err) throw err;
//     console.log(data);              // display as buffer data in HEX
//     console.log(data.toString());   // Display as a string value
// })

// fs.readFile("./files/starter.txt", "utf-8", (err, data) => {
//     if(err) throw err;
//     console.log(data);              // UTF-8 unencodes buffer data to display as a string
// })

// fs.readFile(path.join(__dirname, "files", "starter.txt"), "utf-8", (err, data) => {
//     if (err) throw err;
//     console.log(data);
// })



console.log("Hello...");            // Hello is logged to the console first unless the "path" module is imported

/*
// This is what's know as "callback hell" with all the additional functions inside the callback of the previous functions
fs.writeFile(path.join(__dirname, "files", "reply.txt"), "Write this Text to FILE", (err) => {
    if (err) throw err;
    console.log("Writing file completed");

    // Note that appendFile will create a file if it does not already exist
    // Also note that due to async behavior, calling appendFile outside after writeFile may not result in the desired behavior,
    // So we call it from inside the function here
    fs.appendFile(path.join(__dirname, "files", "reply.txt"), "\nAPPENDING this Text to FILE", (err) => {
        if (err) throw err;
        console.log("Appending completed");
        
        fs.rename(path.join(__dirname, "files", "reply.txt"), "./files/newReply.txt", (err) => {
            if (err) throw err;
            console.log("Rename file is completed");

        })
    })
})
*/


// For errors: exit on uncaught errors
process.on("uncaughtException", err => {
    console.error(`There was an uncaught error: ${err}`);
    process.exit(1);
})