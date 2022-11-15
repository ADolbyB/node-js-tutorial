const fs = require("fs");

if(!fs.existsSync("./new")) {
    fs.mkdir("./new", (err) => {
        if (err) throw err;
        console.log("New Directory Created");
    });
} else {
    console.log("Directory Already Exists");
}

if(!fs.existsSync("./new")) {
    fs.rmdir("./new", (err) => {
        if (err) throw err;
        console.log("New Directory REMOVED");
    });
} else {
    console.log("Directory Removed");
}