(function () {
  var ACTIVITIES = [
    "Watch twinkling lights on a tree",
    "Light a scented candle",
    "Write a gratitude note",
    "Watch a Christmas movie",
    "Quality time with loved ones",
    "Read a cozy story by lamp",
    "Put up your Christmas tree",
    "Drink hot chocolate",
    "Listen to a holiday playlist",
    "Fluffy socks on",
    "Presents wrapping",
    "Bake something easy",
    "Drink herbal tea in Xmas mug",
    "Snuggle under blanket",
    "Make a handmade card",
    "Keep a positive mindset",
    "Hug your loved ones",
    "Wear festive pyjamas",
    "Watch your favorite movie",
    "Wear \u201Cugly\u201D sweater",
    "Enjoy \u201Cthe moment\u201D",
    "Act of kindness",
    "Make a \u201Cyear in review\u201D list",
    "Take family Xmas photo"
  ];

  var STORAGE_KEY = 'advent-opened';
  var testMode = false;
  var opened = {};

  try {
    opened = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  } catch (e) {
    opened = {};
  }

  function save() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(opened)); } catch (e) {}
  }

  // Anno dell'avvento: a gennaio si riferisce ancora all'anno precedente
  function adventYear() {
    var now = new Date();
    return now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear();
  }

  // La casella n si sblocca alle 00:00 del giorno n dicembre
  function isUnlocked(n) {
    if (testMode) return true;
    return new Date() >= new Date(adventYear(), 11, n, 0, 0, 0);
  }

  function render() {
    var grid = document.getElementById('grid');
    var sub = document.getElementById('sub');
    if (!grid) return;
    grid.innerHTML = '';
    var available = 0;

    ACTIVITIES.forEach(function (text, i) {
      var n = i + 1;
      var unlocked = isUnlocked(n);
      var isOpen = !!opened[n];
      if (unlocked) available++;

      var day = document.createElement('div');
      day.className = 'day';

      var num = document.createElement('div');
      num.className = 'num';
      num.textContent = n;

      var box = document.createElement('div');
      if (!unlocked) {
        box.className = 'box locked';
        box.textContent = '\uD83D\uDD12';
      } else if (isOpen) {
        box.className = 'box open';
        box.textContent = text;
      } else {
        box.className = 'box ready';
        box.textContent = '\uD83C\uDF81';
      }
      box.addEventListener('click', function () {
        if (!isUnlocked(n)) return;
        opened[n] = true;
        save();
        render();
      });

      var tip = document.createElement('div');
      tip.className = 'tip';
      if (!unlocked) tip.textContent = 'dal ' + n + ' dicembre';

      day.appendChild(num);
      day.appendChild(box);
      day.appendChild(tip);
      grid.appendChild(day);
    });

    if (sub) {
      sub.textContent = available
        ? available + ' boxes available \u00B7 click to reveal'
        : 'Starts on December 1st \u2728';
    }
  }

  // Aggiorna da solo appena scatta la mezzanotte
  function scheduleMidnight() {
    var now = new Date();
    var next = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 1);
    setTimeout(function () {
      render();
      scheduleMidnight();
    }, next - now);
  }

  function init() {
    var testBtn = document.getElementById('test');
    var resetBtn = document.getElementById('reset');

    if (testBtn) {
      testBtn.addEventListener('click', function () {
        testMode = !testMode;
        testBtn.textContent = '\uD83E\uDDEA Modalit\u00E0 test: ' + (testMode ? 'ON' : 'OFF');
        render();
      });
    }
    if (resetBtn) {
      resetBtn.addEventListener('click', function () {
        opened = {};
        save();
        render();
      });
    }

    document.addEventListener('visibilitychange', function () {
      if (!document.hidden) render();
    });

    render();
    scheduleMidnight();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
