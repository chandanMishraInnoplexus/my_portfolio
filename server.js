var StaticServer = require('static-server');

var server = new StaticServer({
    rootPath: './public',
    port:3000
});

server.start(() => {
    console.log("server started "+ server.port);
});