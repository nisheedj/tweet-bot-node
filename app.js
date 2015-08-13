var twitter = require('twitter');
var twitterConfig = require('./twitter-config.json');


var client = new twitter(twitterConfig);

client.stream('statuses/filter', {track: '@awaydaybot'}, function(stream) {
  
  stream.on('data', function(tweet) {
    console.log(tweet.text);
  });
 
  stream.on('error', function(error) {
    throw error;
  });
});