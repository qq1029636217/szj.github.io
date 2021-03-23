const http = require('http');
const fs = require('fs');
const path = require('path');
const mime = require('mime');
const cache = {};

function send404(response){
    response.writeHead(404,{'Content-Type':'text/plain'});
    response.write('Error 404');
    response.end();
}

function sendFile(response,filepath,fileContents){
    response.writeHead(
        200,{"content-type":mime.lookup(path.basename(filepath))}
    );
    response.end(fileContents);
}

function serveStatic(response,cache,absPath) {
    if (cache[absPath]) {
        sendFile(response, absPath, cache[absPath]);
    } else {
        fs.exists(absPath, function (exists) {
            if (exists) {
                fs.readFile(absPath, function (err, data) {
                    if (err) {
                        send404(response)
                    } else {
                        cache[absPath] = data;
                        sendFile(response, absPath, data);
                    }
                });
            } else {
                send404(response);
            }
        });
    }
}

var server =http.createServer(function (request,response){
    var filepath=false;
    if(response.url==='/')
    {
        filepath='serve.html';
    }else {filepath='public'+request.url;}

    var abspath ='./'+filepath;
    serveStatic(response,cache,abspath);});

