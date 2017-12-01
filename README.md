# Jsonp
### jsonp及其实现

JSONP(JSON with Padding)是一个非官方的协议，它允许在服务器端集成Script tags返回至客户端，通过javascript callback的形式实现跨域访问（这仅仅是JSONP简单的实现形式）。<br>
简单的一句话：jsonp是一个协议，由于同源策略的限制，XmlHttpRequest只允许请求当前源（域名、协议、端口）的资源，为了实现跨域请求，可以通过script标签实现跨域请求，然后在服务端输出JSON数据并执行回调函数，从而解决了跨域的数据请求。<br>
script标签不受跨域资源请求的影响，可以通过增加callback参数将回调函数传递，与服务器端配合从而在资源加载之后执行该回调函数,客户端关键部分写法如下：

```
<!DOCTYPE html>
<body>
    <h1>测试jsonp</h1>
    <p>用node搭建能够解析jsonp请求的服务器，前端通过script发送jsonp请求，通过回调处理服务器返回的数据</p>
    <script>
        function test(data){
            alert(data.name);
        };
    </script>
    <!-- 将test作为callback参数传递 -->
    <script src="http://localhost:3000/jsonp?callback=test"></script>
</body>
```
在服务器端，需要对script的src进行url解析，将data作为参数放入回调函数中，最后通过res.end(callback(data))中将要执行的函数放入客户端的script中，在客户端对该函数进行执行。
服务器端的关键代码如下：

```
//解析url
var urlPath = url.parse(req.url).pathname;
console.log(urlPath);
//获取从客户端传递的参数
var qs = querystring.parse(req.url.split('?')[1]);
//约定的url的名称为jsonp
if(urlPath === '/jsonp' && qs.callback){
    res.writeHead(200,{'Content-Type':'application/json;charset=utf-8'});
    var data = {
        "name": "Monkey"
    };
    data = JSON.stringify(data);
    var callback = qs.callback+'('+data+');';
    //在end中返回callback(data)，写入script中，进而客户端进行该函数的执行
    res.end(callback);
}
```
### 总结
- jsonp需要服务器端和客户端配合使用，以script标签无’同源’限制的便利来实现跨域资源的共享。
- 优点：解决了跨域资源共享
- 缺点：代码麻烦，需要服务器端和客户端约定好，同时客户端传递数据只能通过url的形式，有长度，安全等限制。

