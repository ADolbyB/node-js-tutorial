const fs = require("fs");

const rs = fs.createReadStream("./files/lorem.txt", {encoding: "utf8"});
const ws = fs.createWriteStream("./files/new-lorem.txt");

// // call the read stream and write data to new file
// rs.on("data", (dataChunk) => {
//     ws.write(dataChunk);
// })

// This is a more efficient way to do it: piping
rs.pipe(ws);