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
var colors = require('colors');
var firebase = require('firebase');
var validUsers, firebaseRef, botRoom, botConfig, twitterQ, calibrateQ, board, calibrateMode, lcd, mA, mB, twit;

/*Default chat room name*/
botRoom = 'C0mplexPwd';
/*Calibrate mode flag*/
calibrateMode = false;
/*Valid users to test commands*/
validUsers = [];
/*Create new job queues*/
twitterQ = new notifyQueue();
calibrateQ = new notifyQueue();
/*Create firebase endpoint ref*/
firebaseRef = new firebase('https://twitter-bot-login.firebaseio.com/motorConfig');

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

var qMotor = function(item, next) {

  switch (item.control.control) {

    case 'forward':
      mA.fwd(botConfig.motorAFwd);
      mB.fwd(botConfig.motorBFwd);
      setTimeout(function() {
        console.log('Moved forward in %s ms'.green, botConfig.timeoutFwdRev);
        mA.stop();
        mB.stop();
        next();
      }, botConfig.timeoutFwdRev);
      break;

    case 'reverse':
      mA.rev(botConfig.motorARev);
      mB.rev(botConfig.motorBRev);
      setTimeout(function() {
        console.log('Moved backward in %s ms'.green, botConfig.timeoutFwdRev);
        mA.stop();
        mB.stop();
        next();
      }, botConfig.timeoutFwdRev);
      break;

    case 'left':
      mA.rev(botConfig.motorARev);
      mB.fwd(botConfig.motorBFwd);
      setTimeout(function() {
        console.log('Turned left in %s ms'.green, botConfig.timeoutLtRt);
        mA.stop();
        mB.stop();
        next();
      }, botConfig.timeoutLtRt);
      break;

    case 'right':
      mA.fwd(botConfig.motorAFwd);
      mB.rev(botConfig.motorBRev);
      setTimeout(function() {
        console.log('Turned right in %s ms'.green, botConfig.timeoutLtRt);
        mA.stop();
        mB.stop();
        next();
      }, botConfig.timeoutLtRt);
      break;

    case 'dummy':
      setTimeout(function() {
        next();
      }, 100);
      break;

    default:
      console.log('Stopped'.green);
      mA.stop();
      mB.stop();
      next();
  }
};

/**
 * Function to check if chat room has no users
 * @return {Boolean} true if no users present
 */
var hasZeroClientsInRoom = function() {
  return typeof io.nsps['/'].adapter.rooms[botRoom] === 'undefined';
};
//Exit calibrate mode
var resetCalibrateMode = function() {
  calibrateMode = false;
  return;
};
//Check if calibrate mode is active
var isInCalibrateMode = function() {
  return calibrateMode === true;
};
//Clear twiiterQ
var clearTwitterQ = function() {
  if (twitterQ) {
    twitterQ.queue = [];
  }
};
//Clear calibrateQ
var clearCalibrateQ = function() {
  if (calibrateQ) {
    calibrateQ.queue = [];
  }
};

//The job queue callback functionality
//Run on every next() call
twitterQ.pop(qMotor);
calibrateQ.pop(qMotor);

//socket connection event
io.on('connection', function(socket) {

  console.log('Client connected !!'.green);

  socket.on('disconnect', function() {
    console.log('Client disconnected !!'.red);
    //Set calibrate mode to false if at all it had been true
    resetCalibrateMode();
    //clear calibrate queue
    clearCalibrateQ();
  });

  //socket to connect with secret bot room
  socket.on('join secret room', function(data) {
    if (data.room === botRoom) {
      //Check if the admin is connected to the room
      if (hasZeroClientsInRoom()) {
        //Add socket to the secret bot room for calibration
        socket.join(botRoom);
        //Alert to all sockets in the room that socket has joined
        socket.emit('joined secret room');
        //Set calibrate mode on
        calibrateMode = true;
        //Set new config object
        botConfig = data.config;
        //clear twitter job queue
        clearTwitterQ();
      } else {
        //Alert admin is already logged in
        socket.emit('admin already connected');
      }
    } else {
      //Alert if the room names don't match
      socket.emit('error joining room');
    }
  });

  socket.on('start game', function(data) {
    clearTwitterQ();
    validUsers = data;
  });

  socket.on('stop game', function() {
    clearTwitterQ();
    validUsers = [];
  });

  socket.on('logout', function() {
    clearTwitterQ();
    clearCalibrateQ();
    validUsers = [];
    calibrateMode = false;
  });

  socket.on('get active game users', function() {
    socket.emit('active game users', validUsers);
  });

  //socket to leave the secret bot room
  socket.on('leave secret room', function(data) {
    //remove socket from the secret bot room
    socket.leave(botRoom);
    //Alert to socket that it has left the room
    socket.emit('left secret room');
    //Set calibrate mode off
    resetCalibrateMode();
    //clear calibrate queue
    clearCalibrateQ();
  });

  socket.on('move direction', function(data) {
    if (isInCalibrateMode()) {
      /*Push control to job queue*/
      calibrateQ.push({
        user: {
          name: 'Tester'
        },
        control: {
          control: data.direction
        }
      });
      /*Push dummy delay control*/
      calibrateQ.push({
        user: {
          name: 'Tester'
        },
        control: {
          control: 'dummy'
        }
      });
    }
  });
});

var controlBotViaTweet = function(tweet) {
  //Check if user has used valid hashtags and map it to controls
  var controls = utils.validHashTags(tweet);
  _.each(controls, function(control) {
    /*Push control to job queue*/
    twitterQ.push({
      user: tweet.user,
      control: control
    });
    /*Push dummy delay control*/
    twitterQ.push({
      user: tweet.user,
      control: {
        control: 'dummy'
      }
    });
  });
};

var initializeTwitterStream = function() {

  console.log('initializing twitter stream API !!'.yellow);

  twit = new twitter({
    onTweet: function(tweet) {
      //Check if calibrate mode is on
      if (calibrateMode === false) {
        if(validUsers.length){
          //Only allow users added to the game to control the bot
          if (_.contains(validUsers, tweet.user.screen_name)) {
            controlBotViaTweet(tweet);
          }
        } else {
          //Open to all
           controlBotViaTweet(tweet);
        }
      }
    }
  });

};
var initializeWebServer = function() {

  console.log('initializing node webserver !!'.yellow);

  server.listen(9000, function() {
    var host = server.address().address
    var port = server.address().port

    console.log('Webserver started on port 9000 !!'.green);

  });
};


console.log('initializing board !!'.yellow);
board = new five.Board(
  /*{
    port: 'COM4'
  }*/
);

board.on('ready', function() {

  console.log('Board ready !!'.green);

  mA = new five.Motor([6, 7, 4]);
  mB = new five.Motor([5, 3, 2]);

  console.log('Retrieving data through firebase api !!'.yellow);

  /*Get data from firebase*/
  firebaseRef.once('value', function(snapshot) {

    console.log('Data retrieved !!'.green);

    //Set the initial botConfig object
    botConfig = snapshot.val();
    //initialize twitter stream api
    initializeTwitterStream();
    //initialize the web server on port 9000
    initializeWebServer();

  }, function(errorObject) {
    console.log('Failed to get data from firebase server !!'.red);
    process.exit(1);
  });

});
