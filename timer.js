var time = document.getElementById("time");
var scramble = document.getElementById("scramble");
var mean = document.getElementById("avg");
var solvePanel = document.getElementById("solve_panel");
var scrambleSelection = document.getElementById("sType");
var ao5 = document.getElementById("ao5");
var ao12 = document.getElementById("ao12");
var menu = document.getElementById("menu");
var added = false;

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
    solves.push([s[i], null]);
  }

  for (var i = 0; i < s.length; i++) {
    solves[i][0] = parseFloat(solves[i][0]);
  }

  Cookies.remove("3Timer");
}

reloadSolves();

scramble.innerHTML = generateScramble(20);

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
    solves.push([t, null]);
    window.clearInterval(inter);
    scramble.innerHTML = "Loading...";
    scramble.innerHTML = generateScramble(20);

    /*var str = "";
    for (var i = 0; i < solves.length; i++) {
      str += solves[i] + " ";
    }*/
    if (Cookies.get("3Timer")) {
      Cookies.remove("3Timer");
    }
    Cookies.set("3Timer", JSON.stringify(solves)); // switch to manual json

    reloadSolves();
  }
  isOn = !isOn;
}

function updateDisplay() {
  time.innerHTML = (Math.round((performance.now() - start)/10)/100).toFixed(2) + "s";
}

 // fast or wca official
function generateScramble(length) {
  if (scrambleSelection.options[scrambleSelection.selectedIndex].value == "fast") {
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
  if (scrambleSelection.options[scrambleSelection.selectedIndex].value == "wca") {
    return new Scrambo().type('333').get(1);
  } else {
    return new Scrambo().type('222').get(1);
  }
}

function clearTimes() {
  Cookies.remove("3Timer");
  solves = [];
  reloadSolves();
  mean.innerHTML = "Mean: N/A";
}

function removeLast() {
  Cookies.remove("3Timer");
  solves.pop();
  Cookies.set("3Timer", JSON.stringify(solves));
  reloadSolves();
}

function reloadSolves() {
  var l = "";
  for (var i = 0; i < solves.length; i++) {
    l += (i + 1).toString() + ". " + (Math.round((solves[i][1] == "+" ? solves[i][0] + 2 : solves[i][0])*100)/100) + "s" + (solves[i][1] ? "+" : "") + "&#10;";
  }
  solvePanel.innerHTML = l;
  ao5.innerHTML = "Average of 5: " + calculateStat(5);
  ao12.innerHTML = "Average of 12: " + calculateStat(12);

  calculateMean();
}

function calculateStat(n) {
  // calculate aon
  if (solves.length >= n) {
    var lastFive = solves.slice(solves.length - n) // get last n solves

    var t = [];
    lastFive.forEach(function(s) {
      if (s[1] != "DNF") {
        t.push(s);
      }
    })

    lastFive = t;

    if (lastFive.length < n-1) {
      return "DNF";
    }

    let temp = [];
    lastFive.forEach(function(s) {
      temp.push(s[1] == "+" ? s[0] + 2 : s[0]); // extract and adjust solves for their penalties (+2 only)
    });

    lastFive = temp.sort()
    lastFive = lastFive.length == n ? lastFive.slice(1, n-1) : lastFive.slice(1, n); // gets median n-2 solves and discards min and max
    var sum = 0;
    for (var i = 0; i < n-2; i++) {
      sum += lastFive[i];
    }
    return Math.round(100*sum/(n-2))/100;
  } else {
    return "N/A";
  }
}

function closeMenu() {
  menu.style.visibility = "hidden";
}

function openMenu() {
  menu.style.visibility = "visible";
}

function plusTwo() {
  if (solves[solves.length - 1][1] == null) {
    solves[solves.length - 1][1] = "+";
  } else {
    solves[solves.length - 1][1] = null;
  }

  console.log(solves[solves.length - 1][1]);

  solves[solves.length - 1][0] = Math.round(100*solves[solves.length - 1][0])/100;

  added = !added;

  reloadSolves();
}

function DNF() {
  solves[solves.length - 1][1] = solves[solves.length - 1][1] == null ? "DNF" : null;

  reloadSolves();
}

function calculateMean() { // TODO: change to get method
  if (solves.length > 0) {
    var total = 0;
    var n = 0;

    for (var i = 0; i < solves.length; i++) {
      if (solves[i][1] != "DNF") {
        total += solves[i][1] == "+" ? solves[i][0] + 2 : solves[i][0];
        n++;
      }
    }

    var m = n > 0 ? Math.round(total*100/n)/100 : "N/A";

    mean.innerHTML = "Mean: " + m + "s";
  }
}
