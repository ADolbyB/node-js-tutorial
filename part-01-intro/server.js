// How Node JS differs from 'Vanilla' JS:

// 1) Node runso on a server - not in a browser (backend not frontend
// 2) The console is in the terminal window
// 3) Global object instead of Window object
// 4) Has Common Core modules that regular JS does not have
// 5) operating system and file system methods: CommonJS modules instead of ES6 modules
// 6) Missing some JS APIs like `fetch`

// Run the console by typing "node" in the terminal
// run javascript files in the terminal by typing `node <filename>`


console.log("Hello World");
//console.log(global);

const os = require("os");
const path = require("path");
const math = require("./math");     // import entire library
const { add, subtract } = require("./math");  // import only the add function from the math library

// console.log("OS Type: " + os.type())
// console.log("OS Version: " + os.version())
// console.log("OS Home Dir: " + os.homedir())

// console.log("__dirname: " + __dirname);
// console.log("__filename: " + __filename);

// console.log("path.dirname(__filename): " + path.dirname(__filename));  // displays same as console.log(__dirname);
// console.log("path.basename(__filename): " + path.basename(__filename)); // displays only filename and extension
// console.log("path.extname(__filename): " + path.extname(__filename));  // displays just the extension

// console.log(path.parse(__filename));    // displays an object with all the returned values above

console.log(math.add(2, 3));
console.log(add(5, 8));
console.log(subtract(23, 13));