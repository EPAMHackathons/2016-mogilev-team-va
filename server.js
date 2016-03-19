#!/usr/bin/env node
var WebSocketServer = require('websocket').server;

var finalhandler = require('finalhandler')
var http = require('http');
var serveStatic = require('serve-static')
var serve = serveStatic("./"); 
var _ = require("underscore")
 
var server = http.createServer(function(request, response) {
    console.log((new Date()) + ' Received request for ' + request.url);
	var done = finalhandler(request, response)
	serve(request, response, done)
});
server.listen(8080, function() {
    console.log((new Date()) + ' Server is listening on port 8080');
});

var servers = [];
var lastClientId = 1;
var clients = [];
 
var wsServer = new WebSocketServer({
    httpServer: server,
    autoAcceptConnections: false
});


wsServer.on('request', handleRequest);

function handleRequest(request) {
    var connection = request.accept(null, request.origin);
    var clientId = handleConnection(connection, request);

    if(clientId) {
        connection.sendUTF(JSON.stringify({
            type: 'clientId',
            data: {
                value: clientId
            }
        }));
    }

    connection.on('message', handleMessage);
    connection.on('close', handleClose);
}

function handleConnection(connection, request) {
    console.log((new Date()) + ' Connection accepted.');
    var clientId;
    if(request.resource == '/server') {
        servers.push(connection);
    } else {
        clientId = getNextClientId();
        clients.push({
            id: clientId,
            connection: connection
        });
    } 
    
    return clientId;
}

function handleMessage(message) {
    if (message.type === 'utf8') {
        console.log('Received Message: ' + message.utf8Data);
		for (var i=0; i < servers.length; i++) {
            servers[i].sendUTF(message.utf8Data);
        }
    }
}

function handleClose(reasonCode, description) {
    console.log((new Date()) + ' Peer disconnected.');
}

function getNextClientId() {
    return lastClientId++;
}