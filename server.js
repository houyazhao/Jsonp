'use strict';
//通过require将http库包含到程序中
var http = require('http');
//引入url模块解析url字符串
var url = require('url');
//引入querystring模块处理query字符串
var querystring = require('querystring');
//创建新的HTTP服务器
var server = http.createServer(function(req, res) {
    //解析url
    var urlPath = url.parse(req.url).pathname;
    console.log(urlPath);
    //获取从客户端传递的参数
    var qs = querystring.parse(req.url.split('?')[1]);
    //约定的url的名称为jsonp
    if (urlPath === '/jsonp' && qs.callback) {
        res.writeHead(200, { 'Content-Type': 'application/json;charset=utf-8' });
        var data = {
            "name": "Monkey"
        };
        data = JSON.stringify(data);
        var callback = qs.callback + '(' + data + ');';
        //在end中返回callback(data)，写入script中，进而客户端进行该函数的执行
        res.end(callback);
    } else {
        res.writeHead(200, { 'Content-Type': 'text/html;charset=utf-8' });
        res.end('Hell World\n');
    }
}).listen(3000);
//用于提示我们服务器启动成功
console.log('Server running!');