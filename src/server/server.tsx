var http = require("http");

var finalhandler = require('finalhandler');
var serveStatic = require('serve-static');
var serveWWW = serveStatic("./www",{'index': ['static/index.html'], setHeaders:setCustomCacheControl});

var port:number = 8080;
if (process.env.PORT)
    port = parseInt(process.env.PORT);

console.log("listening on port " + port);

http.createServer(function(request, response)
{
    var url = request.url;
    if (url.match(".*\\.api"))
    {
        var name = url.substring(url.lastIndexOf("/")+1,request.url.length-4);
        if (name in apis)
        {
            var ret = apis[name](request, response);
            response.setHeader('Cache-Control', 'private, max-age=0, no-cache');
            response.write(JSON.stringify(ret));
            response.end();
            return;
        }
    }

    serveWWW(request, response, finalhandler(request, response));
}).listen(port);


function setCustomCacheControl(response, path)
{
    response.setHeader('Cache-Control', 'public, max-age=86400');
}


var apis =
{
    test : function(request,response)
    {
        return {success:true};
    },
    hi : function(request,response)
    {
        return {success:true, message:'hello'};
    }
};




var ws = require("nodejs-websocket")

var ROWS:number = 25;
var COLS:number = 80;

var strings = [];
for (var i=0 ; i<ROWS ; i++)
    strings[i] = "                                                                                                        ";
 
var server = ws.createServer(function (conn) 
{
    try
    {
		//refresh(conn);
    }
    catch (err)
    {
    }
	
    conn.on("text", function (str) 
    {
        try
        {
	    if (str=="refresh")
            {  
		refresh(conn); 
		return;
	    }
	    var change = JSON.parse(str); 
	    if (change.row >= 0 && change.row < ROWS && change.col >=0 && change.col < COLS && change.text) 
	    {
                strings[change.row] = strings[change.row].substring(0,change.col) + change.text + strings[change.row].substring(change.col+change.text.length);
                strings[change.row] = strings[change.row].substring(0,COLS);
	        broadcast(server, change);
	    }
	}
	catch (err) 
	{
		//err.message;
	}    
    });
}).listen(port+1);

function broadcast(server, change) 
{
    var msg = JSON.stringify(change);
    server.connections.forEach(function (conn) {
        console.log("SEND : " + msg);
        conn.sendText(msg)
    })
}


function refresh(conn)
{
    for (var i=0 ; i<ROWS ; i++)
    {
        conn.sendText(JSON.stringify({row:i, col:0, text:strings[i]}));
    }
}

