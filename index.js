var connect = require('connect'),
brackets    = require('brackets');

var host = "127.0.0.1";
var port = 3000;

connect()
.use('/brackets', brackets())
.use(function (request, response) {
response.end('Hello World');
}).listen(port, host);

console.log("\n Starting... \n");
console.log("\n Platform detected: " + process.platform);
console.log("\n" + "Server running at:" + host + port + "/brackets" + "\n");
console.log("\n Press CTRL + C to stop \n ");
