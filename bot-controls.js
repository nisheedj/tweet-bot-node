var five = require("johnny-five"),
  board = new five.Board();

board.on("ready", function() {
  lcd = new five.LCD({
    // LCD pin name  RS  EN  DB4 DB5 DB6 DB7
    // Arduino pin # 7    8   9   10  11  12
    pins: [13, 8, 9, 10, 11, 12],
    rows: 2,
    cols: 16
      // Options:
      // bitMode: 4 or 8, defaults to 4
      // lines: number of lines, defaults to 2
      // dots: matrix dimensions, defaults to "5x8"
  });
  lcd.clear().print('Hello World');
  lcd.cursor(1, 0);
  lcd.print('Second Line!');


  var motorA = new five.Motor([6, 7, 4]);
  var motorB = new five.Motor([5, 3, 2]);

  motorA.on("start", function() {
    console.log("start motorA");
  });

  /*motorB.on("start", function() {
    console.log("start motorB");
  });*/


  motorA.on("stop", function() {
    console.log("automated stop on timer");
  });

 /* motorB.on("stop", function() {
    console.log("automated stop on timer");
  });*/

  motorA.on("forward", function() {
    console.log("forward");

    // demonstrate switching to reverse after 5 seconds
    board.wait(5000, function() {
      motorA.reverse(50);
    });
  });

 /* motorB.on("forward", function() {
    console.log("forward");

    // demonstrate switching to reverse after 5 seconds
    board.wait(5000, function() {
      motorB.reverse(50);
    });
  });*/

  motorA.on("reverse", function() {
    console.log("reverse");

    // demonstrate stopping after 5 seconds
    board.wait(5000, function() {
      motorA.stop();
    });
  });

  /*motorB.on("reverse", function() {
    console.log("reverse");

    // demonstrate stopping after 5 seconds
    board.wait(5000, function() {
      motorB.stop();
    });
  });*/

  // set the motor going forward full speed
  motorA.forward(255);
  //motorB.forward(255);


  this.repl.inject({
    lcd: lcd,
    mA: motorA,
    mB: motorB
  });

});