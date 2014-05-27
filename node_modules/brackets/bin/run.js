#!/usr/bin/env node

/*jslint plusplus: true, devel: true, nomen: true, node: true, indent: 4, maxerr: 50 */
/*global require, exports, module */

var connect     = require("connect"),
    util        = require("util"),
    brackets    = require("./"),
    port        = process.argv[2];

if (!port) {
    port = Math.floor((Math.random() * 301) + 6100);
}
    

connect()
    .use('/brackets', brackets())
    .use(function (req, res) {
        "use strict";
        
        if (req.url === "/") {
            res.writeHead(302, {Location: "/brackets/"});
            res.end();
        } else {
            res.writeHead(304);
            res.end("Not found");
        }
    })
    .listen(port || 5686);

console.log(util.format("\n  listening on port %d\n", port));