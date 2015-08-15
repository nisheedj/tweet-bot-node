var Twit = require('twit');
var twitterConfig = require('./twitter-config.json');
var five = require("johnny-five");
var board, lcd;


/**
 * Extract the first hashtag in the tweet converted to lowercase
 * @param  {String} tweetText 
 * @return {Boolean | String} Returns false when no hashtags are found
 */
var sanitizeTweet = function(tweetText) {
	var hashTagArray = tweetText.match(/(\#([A-Z]|[a-z]))\w+/g) || [];
	if (!hashTagArray.length) {
		return 'No Hashtag!';
	}
	var hashTag = hashTagArray[0].replace(/\#/, '').toLowerCase();
	return hashTag;
};

var T = new Twit(twitterConfig);

board = new five.Board();

board.on("ready", function() {

	lcd = new five.LCD({
		// LCD pin name  RS  EN  DB4 DB5 DB6 DB7
		// Arduino pin # 7    8   9   10  11  12
		pins: [7, 8, 9, 10, 11, 12],
		backlight: 6,
		rows: 2,
		cols: 16
			// Options:
			// bitMode: 4 or 8, defaults to 4
			// lines: number of lines, defaults to 2
			// dots: matrix dimensions, defaults to "5x8"
	});

	// Tell the LCD you will use these characters:
	lcd.useChar("bigpointerleft");
	lcd.useChar("bigpointerright");
	lcd.useChar("arrowne");
	lcd.useChar("arrownw");
	lcd.useChar("arrowsw");
	lcd.useChar("arrowse");


	var stream = T.stream('statuses/filter', {
		track: 'javascript' //'@awaydaybot'
	});

	stream.on('tweet', function(tweet) {
		console.log(tweet);
		lcd.clear().print('@' + tweet.user.screen_name);
		lcd.cursor(1, 0);
		lcd.print(sanitizeTweet(tweet.text));
		//lcd.print(':bigpointerleft::bigpointerright::arrowne::arrownw::arrowsw::arrowse:');
	});

	stream.on('disconnect', function(disconnectMessage) {
		lcd.clear();
		console.log('Stream is disconnected!. Please reconnect!.');
	})

	stream.on('error', function(error) {
		lcd.clear();
		console.log(error);
	});

	this.repl.inject({
		lcd: lcd
	});

});


//stream.stop() //Call this function on the stream to stop streaming (closes the connection with Twitter).
// stream.start() //Call this function to restart the stream after you called .stop() on it