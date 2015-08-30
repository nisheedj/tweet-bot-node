var five = require("johnny-five"),
  board = new five.Board();

board.on("ready", function() {
  var motor;
  /*
    Seeed Studio Motor Shield V1.0, V2.0
      Motor A
        pwm: 9
        dir: 8
        cdir: 11

      Motor B
        pwm: 10
        dir: 12
        cdir: 13

    Freetronics Motor Shield
      Motor A
        pwm: 6
        dir: 5
        cdir: 7

      Motor B
        pwm: 4
        dir: 3
        cdir: 2

   */


  motorA = new five.Motor({
    pins: {
	  	pwm: 9,
	    dir: 8,
	    cdir: 11
    }
  });
  motorB = new five.Motor({
    pins: {
	  	pwm: 10,
	    dir: 12,
	    cdir: 13
    }
  });




  board.repl.inject({
    motorA: motorA,
    motorB: motorB
  });
});