var connect = require('connect'), //
brackets  = require('brackets');

var host = "127.0.0.1"; // Set 0.0.0.0 to run on public ip
var port = 3000; // Change the port to what ever you prefer

connect()
.use('/brackets', brackets())
.use(function (request, response) {
response.end('Visit /brackets to see the editor in action');
}).listen(port, host);

console.log("\n Starting... \n");
console.log("\n Platform detected: " + process.platform);
console.log("\n" + "Server running at:" + host + port + "/brackets" + "\n");
console.log("\n Press CTRL + C to stop \n ");
