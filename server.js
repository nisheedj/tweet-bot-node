var express = require('express');
var http = require('http');
var path = require('path');
var app = express();
var server = http.Server(app);
var io = require('socket.io')(server);
var twitter = require('./bot/twitter');
var utils = require('./bot/utils');
var _ = require('underscore');
var five = require('johnny-five');

var notifyQueue = require('notify-queue');
var q, botRoom, board, calibrateMode, lcd, mA, mB, twit, fwdTimeout, revTimeout, leftTimeout, rightTimeout;

botRoom = 'C0mplexPwd';
calibrateMode = false;
q = new notifyQueue();

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

q.pop(function(item, next) {

  switch (item.control.control) {
    case 'forward':
      mA.fwd(100);
      mB.fwd(100);
      setTimeout(function() {
        console.log('Forward done');
        mA.stop();
        mB.stop();
        next();
      }, 1500);
      break;
    case 'reverse':
      mA.rev(100);
      mB.rev(100);
      setTimeout(function() {
        mA.stop();
        mB.stop();
        next();
      }, 1500);
      break;
    case 'left':
      mA.rev(100);
      mB.fwd(100);
      setTimeout(function() {
        mA.stop();
        mB.stop();
        next();
      }, 500);
      break;
    case 'right':
      mA.fwd(100);
      mB.rev(100);
      setTimeout(function() {
        mA.stop();
        mB.stop();
        next();
      }, 500);
      break;
  }

});

io.on('connection', function(socket) {
  console.log('Client connected!');

  socket.on('disconnect', function() {
    console.log('Client disconnected');
    calibrateMode = false;
  });

  socket.on('leave secret room', function(data) {
    io.sockets.in(botRoom).emit('left secret room');
    socket.leave(botRoom);
    calibrateMode = false;
  });

  socket.on('join secret room', function(data) {
    if (data.room === botRoom) {
      //Check if the admin is connected to the room
      if (hasZeroClientsInRoom()) {
        socket.join(botRoom);
        io.sockets.in(botRoom).emit('joined secret room');
        console.log(data.config);
        calibrateMode = true;
      } else {
        socket.emit('admin already connected');
      }
    } else {
      socket.emit('error joining room');
    }
  });
});


board = new five.Board();

board.on('ready', function() {

  mA = new five.Motor([6, 7, 4]);
  mB = new five.Motor([5, 3, 2]);

  mA.start();
  mB.start();

  twit = new twitter({
    onTweet: function(tweet) {
      if (calibrateMode === false) {
        var controls = utils.validHashTags(tweet);
        _.each(controls, function(control) {
          q.push({
            user: tweet.user,
            control: control
          });
        });
      }
    }
  });

  server.listen(9000, function() {
    var host = server.address().address
    var port = server.address().port
    console.log('Example app listening at http://' + host + ':' + port);
  });

});