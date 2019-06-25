var time = document.getElementById("time");
var scramble = document.getElementById("scramble");
var mean = document.getElementById("avg");
var solvePanel = document.getElementById("solve_panel");

var isOn = false;
var start = null
var inter = null

var solves = [];

scramble.innerHTML = generateScramble(20);

window.onkeydown = function(e) {
  var key = e.keyCode ? e.keyCode : e.which;

  if (key == 32) {
    onClick();
  }
}

function onClick() {
  if (!isOn) {
    start = performance.now()
    time.innerHTML = "0.00s";
    inter = window.setInterval(updateDisplay, 10);
  } else {
    var t = (Math.round((performance.now() - start)/10)/100);
    time.innerHTML = t.toFixed(2) + "s";
    solves.push(t);
    window.clearInterval(inter);
    scramble.innerHTML = generateScramble(20);

    if (solves.length > 0) {
      var total = 0;
      for (var i = 0; i < solves.length; i++) {
        total += solves[i];
      }

      mean.innerHTML = "Mean: " + Math.round(total*100/solves.length)/100 + "s";

      var l = "";
      for (var i = 0; i < solves.length; i++) {
        l += (i + 1).toString() + ". " + solves[i] + "s &#10;";
      }
      solvePanel.innerHTML = l;
    }
  }
  isOn = !isOn;
}

function updateDisplay() {
  time.innerHTML = (Math.round((performance.now() - start)/10)/100).toFixed(2) + "s";
}

function generateScramble(length) {
  var s = "";

  var previous = null;
  for (var i = 0; i < length; i++) {
    var finished = false;
    while (!finished) {
      var current = null;
      switch (Math.floor(Math.random()*6)) {
        case 0:
          current = "U";
          break;
        case 1:
          current = "F";
          break;
        case 2:
          current = "R";
          break;
        case 3:
          current = "B";
          break;
        case 4:
          current = "L";
          break;
        case 5:
          current = "D";
          break;
      }

      if (current != previous) {
        finished = true;
        previous = current;
        s += current;
      }
    }

    if (Math.random() >= 0.5) {
      s += "2";
    } else if (Math.random() >= 0.5) {
      s += "'";
    }

    s += " "
  }

  return s;
}
