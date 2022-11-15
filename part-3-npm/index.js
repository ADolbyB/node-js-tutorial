// Docs for npm: https://docs.npmjs.com/
// Docs for using npm: https://docs.npmjs.com/cli/v9/using-npm

// installing npm packages: npm i <package name>
// removing a package: npm rm <package name>
// note that removing a package does not change scripts in package.json file

const { format } = require("date-fns");
const { v4: uuid } = require("uuid");

console.log(format(new Date(), "yyyyMMdd\tHH:mm:ss"));

console.log(uuid());

console.log("Hello");