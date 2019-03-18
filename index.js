// A NodeJs Server
const http = require('http');
const requestHandler = require('./handler');
const port = 3310;

const server = http.createServer(requestHandler);

server.listen(port, (err) => {
    if (err) {
        console.error(err);
    }

    console.log(`Our server is listening for connections on port: ${port}`);
})