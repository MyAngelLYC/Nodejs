//d:
//cd GitHub\Nodejs\server
//node server.js 1>./log/log.txt 2>./log/err.txt
var http = require('http');
var fs = require('fs');
var path = require('path');
var mime = require('mime');
var cache = {};

var server = http.createServer(function (request, response){
	console.log(request.headers);
	var filePath;
	if(request.url == '/'){
		filePath = '/index.html';
	}else{
		filePath = request.url;
	}
	var absPath = '..' + filePath;
	serveStaticFile(response, cache, absPath);
});
server.listen(3000);
var chatServer = require('./chat_server');
chatServer.listen(server);

function serveStaticFile(response, cache, absPath){
	if(cache[absPath]){
		sendFile(response, absPath, cache[absPath]);
	}else{
		fs.exists(absPath, function(exists){
			if(exists){
				fs.readFile(absPath,function(err, data){
					if(err){
						send404File(response);
					}else{
						cache[absPath] = data;
						sendFile(response, absPath, data);
					};
				});
			}else{
				send404File(response);
			};
		});
	};
}

function sendFile(response, absPath, data){
	response.writeHead(200, {'Content-Type': mime.lookup(path.basename(absPath))});
	response.end(data);
}

function send404File(response){
	console.error('404 resources not found!');
	response.writeHead(404, {'Content-Type': 'text/plain; charset=utf-8'});
	response.end('对不起，您访问的文件不存在');
}