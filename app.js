var twitter = require('twitter');

var client = new twitter({
  consumer_key: 'mBGCD0AjU04765KnDNXYfL7Rd',
  consumer_secret: '87YsapwGWtg6Zmj4r9A8PLzEalqHRnl0FkfV8YOWhaAJZgE347',
  access_token_key: '314971212-OU4wzR5DbUNLxoYtIuOCmeBvjMuC2ADlsZT5q0xP',
  access_token_secret: 'chDRCK4tq47QyPP2LEsPjaR9mOttbHKO0ZEUc3z9xOBmJ'
});

client.stream('statuses/filter', {track: '@nishDroid'}, function(stream) {
  
  stream.on('data', function(tweet) {
    console.log(tweet.text);
  });
 
  stream.on('error', function(error) {
    throw error;
  });
});