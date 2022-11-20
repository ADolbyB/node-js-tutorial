// Cross Origin Resource Sharing
// Prevent CORS errors in your browser: you need to White List the domains
const whitelist = [
    "https://joelbrigida.com", 
    "http://127.0.0.1:5500", 
    "http://localhost:3500"
];
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

module.exports = corsOptions;