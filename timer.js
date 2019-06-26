var time = document.getElementById("time");
var scramble = document.getElementById("scramble");
var mean = document.getElementById("avg");
var solvePanel = document.getElementById("solve_panel");

// TODO add functionality for scramble method selection

// var seeded_scramble = new Scrambo().type('333').seed(1).get();
// alert(seeded_scramble);

var isOn = false;
var holdStart = null;
var count = true;
var down = false;

var start = null
var inter = null

var solves = [];

if (Cookies.get("3Timer")) {
  var s = JSON.parse(Cookies.get("3Timer"));
  for (var i = 0; i < s.length; i++) {
    solves.push(parseFloat(s[i]));
  }
  Cookies.remove("3Timer");
}

var l = "";
for (var i = 0; i < solves.length; i++) {
  l += (i + 1).toString() + ". " + solves[i] + "s &#10;";
}
solvePanel.innerHTML = l;

scramble.innerHTML = generateScramble(20, true);

window.onkeydown = function(e) {
  if (!down) {
    var key = e.keyCode ? e.keyCode : e.which;

    if (key == 32) {
      if (isOn) {
        onClick();
      } else {
        holdStart = performance.now();
        console.log(holdStart);
      }
    }

    down = true;
  }
}

window.onkeyup = function(e) {
  var key = e.keycode ? e.keycode : e.which;

  console.log(performance.now());
  console.log(performance.now() - holdStart);

  if (key == 32 && performance.now() - holdStart >= 50) {
    if (count) {
      onClick();
    }
    count = !count;
  }

  down = false;
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
    scramble.innerHTML = "Loading...";
    scramble.innerHTML = generateScramble(20, true);

    /*var str = "";
    for (var i = 0; i < solves.length; i++) {
      str += solves[i] + " ";
    }*/
    if (Cookies.get("3Timer")) {
      Cookies.remove("3Timer");
    }
    Cookies.set("3Timer", JSON.stringify(solves));

    if (solves.length > 0) {
      var total = 0;
      for (var i = 0; i < solves.length; i++) {
        total += solves[i];
      }

      mean.innerHTML = "Mean: " + Math.round(total*100/solves.length)/100 + "s";

      reloadSolves();
    }
  }
  isOn = !isOn;
}

function updateDisplay() {
  time.innerHTML = (Math.round((performance.now() - start)/10)/100).toFixed(2) + "s";
}

 // fast or wca official
function generateScramble(length, wca) { // wca is a boolean
  if (!wca) {
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

  console.log("Generating a WCA official scramble...");
  return new Scrambo().get(1);
}

function clearTimes() {
  Cookies.remove("3Timer");
  solves = [];
  reloadSolves();
  mean.innerHTML = "Mean: N/A";
}

function reloadSolves() {
  var l = "";
  for (var i = 0; i < solves.length; i++) {
    l += (i + 1).toString() + ". " + solves[i] + "s &#10;";
  }
  solvePanel.innerHTML = l;
}
