var express = require('express');
var fs = require('fs');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 1337;
var socketGlobal = false;
var logFile = process.env.LOG_PATH || __dirname + '\\log.txt';

console.log('');
console.log('');
console.log('');
console.log('');
console.log('');
server.listen(port, function () {
    console.log('Server listening at port %d', port);
});

app.use(express.static(__dirname + '/public'));

io.on('connection', function (socket) {
    console.log("socket.id", socket.id);
    socketGlobal = socket;
});

var update = function (filePath) {
    if (!socketGlobal) {
        return false;
    }
    console.log('');
    console.log('.............................');
    console.log('');
    var data = fs.readFileSync(filePath);
    data = data.toString();
    var reversData = "";
    var reversArr = data.split('\n').reverse().splice(0, 300);
    reversArr.map(function (line) {
        if (line.indexOf("clientIpAddress") > -1) {
            line = "<div style='color: #008800;font-weight: bold;'>" + line + "</div>";
        }
        if (line.indexOf("socket.io-parser decoded 2") > -1) {
            line = "<div style='font-weight: bold;font-size: 14px;color: #000000;'>" + line + "</div>";
        }
        if (line.indexOf("disconnect: username") > -1) {
            line = "<div style='color: #ff0304;font-weight: bold;'>" + line + "</div>";
        }
        if (line.indexOf("client #") > -1) {
            line = "<div style='color: #2143ff;font-weight: bolder;'>" + line + "</div>";
        }
        if (line.indexOf("clients not found") > -1) {
            line = "<div style='color: #2143ff;font-weight: bolder;'>" + line + "</div>";
        }
        if (line.indexOf("Server listening") > -1) {
            line = "<div style='color: #008800;font-weight: bold;font-size: 18px;'>" + line + "</div>";
        }
        reversData += line + '\n';
    });
    socketGlobal.emit('log', reversData);
};

setInterval(function () {
    update(logFile);
}, 1000);