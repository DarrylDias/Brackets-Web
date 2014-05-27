var connect = require('connect'),
brackets    = require('brackets');

connect()
.use('/brackets', brackets())
.use(function (request, response) {
res.end('Hello World');
}).listen(3000);

console.log("\n Starting... \n");
console.log("\n Visit http://127.0.0.1:3000/bracket \n");
console.log("\n Platform detected: " + process.platform);
console.log("\n Press CTRL + C to stop \n ");
