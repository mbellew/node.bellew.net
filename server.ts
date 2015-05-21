/// <reference path='typings/node/node.d.ts' />

var http = require("http");

var finalhandler = require('finalhandler');
var serveStatic = require('serve-static');
var serve = serveStatic("./",{'index': ['static/index.html']});

http.createServer(function(request, response)
{
    var url = request.url;
    if (url.match(".*\\.api"))
    {
        var name = url.substring(url.lastIndexOf("/")+1,request.url.length-4);
        var ret = apis[name](request,response);
        response.write(JSON.stringify(ret));
        response.end();
        return;
    }

    serve(request, response, finalhandler(request, response));
}).listen(process.env.PORT || 8080);

var apis =
{
    text : function(request,response)
    {
        return {success:true};
    }
};