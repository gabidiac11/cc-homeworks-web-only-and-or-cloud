
'use strict';

const http = require('http');
const router = require('./router');
const port = require('./constants').port;

const server = http.createServer((req, res) => {
    console.log(`\nNew ${req.method} request at '${req.url}'...`);

    const response = router.getResponse(req.url, req.method);

    console.log(`Response:`);
    console.log(response);
    
    res.writeHead(response.code, response.headers);
    res.end(response.data);
});

server.listen(port, () => console.log(`\nThe server is running, yo! At port ${port}, yo! And it's also watching for changes, yo!`));