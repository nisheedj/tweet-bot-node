var express = require('express');
var http = require('http');
var path = require('path');

var app = express();
var server = http.Server(app);
var io = require('socket.io')(server);

var botRoom = 'C0mplexPwd';

/*Set static resources*/
app.use('/js', express.static(path.join(__dirname, 'public', 'js')));
app.use('/css', express.static(path.join(__dirname, 'public', 'css')));
app.use('/img', express.static(path.join(__dirname, 'public', 'img')));

/*Base index file*/
app.get('/', function(req, res) {
  res.sendFile('index.html', {
    root: __dirname
  });
});

var hasZeroClientsInRoom = function() {
  return typeof io.nsps['/'].adapter.rooms[botRoom] === 'undefined';
};

io.on('connection', function(socket) {
  console.log('Client connected!');

  socket.on('disconnect', function() {
    console.log('Client disconnected');
  });

  socket.on('leave secret room', function(data) {
    io.sockets.in(botRoom).emit('left secret room');
    socket.leave(botRoom);
    /*Destroy instance of the node bot and stop commands to and fro*/
  });

  socket.on('join secret room', function(data) {
    if (data.room === botRoom) {
      //Check if the admin is connected to the room
      if (hasZeroClientsInRoom()) {
        socket.join(botRoom);
        io.sockets.in(botRoom).emit('joined secret room');
        //Create new instance of the node bot and send commands to and fro
        console.log(data.config);
      } else {
        socket.emit('admin already connected');
      }
    } else {
      socket.emit('error joining room');
    }
  });
});

server.listen(9000, function() {
  var host = server.address().address
  var port = server.address().port
  console.log('Example app listening at http://' + host + ':' + port);
});