var static = require('node-static');
var http = require('http');
var url = require('url');
var fs = require('fs');
var qs = require('querystring');

var file = new static.Server('./public');
http.createServer(function (request, response) {
    request.setEncoding('utf-8');

    var queryString = url.parse(request.url, true);
    if (request.method.toUpperCase() == 'GET') {
        request.addListener('end', function () {
            switch (queryString.pathname) {
            case "/billlist":
                fs.readFile('data.json',function(err,data){
                    if(err)
                        throw err;
                    if (data=="") {
                        data = "[]";
                    }
                    response.writeHead(200,{'Content-Type' : 'application/json; charset=UTF-8'});
                    response.write(data);
                    response.end();
                });
                break;
            default:
                    file.serve(request, response);
                break;
            }
        }).resume();
    } else if (request.method.toUpperCase() == 'POST') {
        var postData = "";
        request.addListener("data", function (postDataChunk) {
            postData += postDataChunk;
        });
        request.addListener('end', function () {
            console.log(postData);
            var post = qs.parse(postData);
            console.log(post);
            switch (queryString.pathname) {
            case "/additem":
                fs.readFile('data.json',function(err,data){
                    if(err) throw err;
                    if (data=="") {
                        data = "[]";
                    }
                    var billlist = JSON.parse(data);
                    billlist.push({
                        "itemname": post.itemname,
                        "price": post.price,
                        "payman": post.payman,
                        "createtime": new Date().getTime()
                    });
                    response.writeHead(200,{'Content-Type' : 'application/json; charset=UTF-8'});
                    response.write("提交成功");
                    response.end();
                    fs.writeFile('data.json',JSON.stringify(billlist),function(err){
                        if(err) throw err;
                        console.log('write JSON ok');
                    });
                });
                break;
            case "/deleteitem":
                fs.readFile('data.json',function(err,data){
                    if(err) throw err;
                    try {
                        var billlist = JSON.parse(data);
                        billlist[post.id].deletetime = new Date().getTime();
                        response.writeHead(200,{'Content-Type' : 'application/json; charset=UTF-8'});
                        response.write("删除成功");
                        response.end();
                        fs.writeFile('data.json',JSON.stringify(billlist),function(err){
                            if(err) throw err;
                            console.log('write JSON ok');
                        });
                    } catch (e) {
                        console.error(e);
                    }
                });
                break;
            default:
                break;
            }
        }).resume();
    } else {
        //head put delete options etc.
    }
}).listen(8080);

console.log("start in :8080");
