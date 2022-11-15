const logEvents = require("./logEvents");
const EventEmitter = require("events");

class MyEmitter extends EventEmitter {};

// Initialize object for new event listener
const myEmitter = new MyEmitter();

// add a listener for the log event
myEmitter.on("log", (msg) => logEvents(msg));

// make an event and emit it with a 2 second delay
setTimeout(() => {
    myEmitter.emit("log", "LOG EVENT EMITTED!!");
}, 2000);