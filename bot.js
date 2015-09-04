var twitter = require('./bot/twitter');
var utils = require('./bot/utils');
var _ = require('underscore');
var five = require("johnny-five");
var board, lcd, m1, m2, twit;

board = new five.Board();

board.on("ready", function() {

	lcd = new five.LCD({
		// LCD pin name  RS  EN  DB4 DB5 DB6 DB7
		// Arduino pin # 7    8   9   10  11  12
		pins: [13, 8, 9, 10, 11, 12],
		rows: 2,
		cols: 16
	});

	m1 = new five.Motor([6, 7, 4]);
	m2 = new five.Motor([5, 3, 2]);

	m1.start();
	m2.start();

	twit = new twitter({
		onTweet: function(tweet) {
			var controls = utils.validHashTags(tweet);
			_.each(controls, function(control) {
				utils.lcdPrint(lcd,control.text,'');
				utils.motorControl(board, m1, m2, control);
			});
		}
	});
});