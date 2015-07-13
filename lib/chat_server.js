var http = require("http");
var fs = require("fs");
var path = require("path");
var mime = require("mime");
var cache = {};

//state for 404
function send404(response){
	response.writeHead(404, {"Content-Type":"text/plain"});
	response.write("Error 404: resource not found");
	response.end();
}

//file data system, 200
function sendFile(response, filePath, fileContent){
	response.writeHead(200,
	 {"Content-Type":mime.lookup(path.basename(filePath))}
	 );
	response.end(fileContent);
}

//
function serveStatic(response, cache, absPath){
	if (cache[absPath]) {
		sendFile(response, absPath, cache[absPath]);
	} else{
		fs.exists(absPath, function(exists){
			console.log(absPath,exists);
			if (exists) {
				fs.readFile(absPath, function(err, data){
					console.log(absPath, err);
					if (err) {
						send404(response);
					}else{
						cache[absPath] = data;
						sendFile(response, absPath, data);
					};
				});
			} else{
				send404(response);
			};
		})
	};
}


//create server
var server = http.createServer(function(request, response){
	var filePath = false;

	if (request.url == '/') {
		filePath = 'public/index.html';
	} else{
		filePath = 'public' + request.url;
	};
	var absPath = '../' + filePath;
	console.log(absPath, cache);
	serveStatic(response, cache, absPath);
})

server.listen(3000,function(){
	console.log("server is listening on port 3000");
})