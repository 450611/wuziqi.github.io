var express = require('express')
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require("path");
app.set('views', path.join(__dirname, 'view'));
app.engine('html', require('ejs').__express);
app.set('view engine', 'html');
app.use(express.static(path.join(__dirname, 'view')));
app.use('/', function (req, res) {
    res.render('wuzi');
});
//在线用户
var onlineUsers = {};
//当前在线人数
var onlineCount = 0;

io.on('connection', function (socket) {
    console.log('a user connected');
    //监听新用户加入
    socket.on('login', function (obj) {
        //将新加入用户的唯一标识当作socket的名称，后面退出的时候会用到
        //向所有客户端广播用户加入
        io.emit('login', { name: obj.name });
        console.log(obj.name + '加入了');
    });

    //监听用户退出
    socket.on('xiaqi', function (obj) {
        //将退出的用户从在线列表中删除
        io.emit("xiaqi", { name: obj.name, x: obj.x, y: obj.y });
        console.log(obj.name + '下棋了');
    });

});

http.listen(3000, function () {
    console.log('listening on *:3000');
});