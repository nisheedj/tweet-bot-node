var twitter = require('./bot/twitter');
var utils = require('./bot/utils');
var _ = require('underscore');
var five = require('johnny-five');
var board, lcd, m1, m2, twit, fwdTimeout, revTimeout, leftTimeout, rightTimeout;

var NotifyQueue = require('notify-queue');
var q = new NotifyQueue();

q.pop(function(item, next) {
  setTimeout(function() {
  	console.log(item);
  	next();
  }, 2000);
});


board = new five.Board({
  port: 'COM4'
});

board.on('ready', function() {

  lcd = new five.LCD({
    // LCD pin name  RS  EN  DB4 DB5 DB6 DB7
    // Arduino pin # 7    8   9   10  11  12
    pins: [13, 8, 9, 10, 11, 12],
    rows: 2,
    cols: 16
  });


  mA = new five.Motor([6, 7, 4]);
  mB = new five.Motor([5, 3, 2]);

  mA.start();
  mB.start();

  twit = new twitter({
    onTweet: function(tweet) {
      var controls = utils.validHashTags(tweet);
      _.each(controls, function(control) {
        //utils.lcdPrint(lcd, control.text, '');
        //utils.motorControl(board, mA, mB, control);
        //Pass data to queue
        q.push({
        	user:tweet.user,
        	control:control
        });
      });
    }
  });
});