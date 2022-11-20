const { format } = require("date-fns");
const { v4: uuid } = require("uuid");       // import Versioin 4 of UUID

const fs = require("fs");
const fsPromises = require("fs").promises;
const path = require("path");

// function to log events
const logEvents = async (message, logName) => {
    const dateTime = `${format(new Date(), "yyyyMMdd\tHH:mm:ss")}`;
    const logItem = `${dateTime}\t${uuid()}\t${message}`;   // alternatively the \n can go between the } and ` instead
    console.log(logItem);
    try {
        if (!fs.existsSync(path.join(__dirname, "logs"))) {
            await fsPromises.mkdir(path.join(__dirname, "logs"));
        }
        // append will not create the file if the directory does not exist
        await fsPromises.appendFile(path.join(__dirname, "logs", logName), logItem + "\n");
    } catch (err) {
        console.log(err);
    }
}

module.exports = logEvents;