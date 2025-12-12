// CraZeMode functionality
// Handles the automatic drawing mode

(function() {
  'use strict';

  // Bresenham Line Algorithm
  function bresenhamLine(xa, ya, xb, yb) {
    var x1 = xa, x2 = xb, y1 = ya, y2 = yb;
    var result = [];
    var m;
    var dy = y2 - y1;
    var dx = x2 - x1;

    if (x1 === x2) {
      m = 2142;
    } else {
      m = dy / dx;
    }

    var dir = m < 0 ? -1 : 1;
    var absDy = Math.abs(dy);
    var absDx = Math.abs(dx);

    if (Math.abs(m) > 1) {
      var temp = absDx;
      absDx = absDy;
      absDy = temp;
      temp = x1; x1 = y1; y1 = temp;
      temp = x2; x2 = y2; y2 = temp;
    }

    if (x2 < x1) {
      var temp = x2; x2 = x1; x1 = temp;
      temp = y2; y2 = y1; y1 = temp;
    }

    var d = 2 * absDy - absDx;
    var incE = 2 * absDy;
    var incNE = 2 * absDy - 2 * absDx;

    while (absDx > 0) {
      if (d <= 0) {
        d += incE;
      } else {
        d += incNE;
        y1 += dir;
      }
      if (Math.abs(m) > 1) {
        result.push(new Point(y1, x1));
      } else {
        result.push(new Point(x1, y1));
      }
      absDx--;
      x1++;
    }
    return result;
  }

  // Bresenham Circle Algorithm
  function bresenhamCircle(xa, ya, xb, yb) {
    var x1 = xa, x2 = xb, y1 = ya, y2 = yb;
    var dx = x2 - x1;
    var dy = y2 - y1;
    var rad = Math.sqrt(dx * dx + dy * dy);
    var x = 0;
    var y = Math.floor(Math.round(rad));
    var o1 = [], o2 = [], o3 = [], o4 = [];
    var o5 = [], o6 = [], o7 = [], o8 = [];
    var d = 3 - 2 * rad;

    while (x <= y) {
      o1.push(new Point(x + x2, y + y2));
      o2.push(new Point(y + x2, x + y2));
      o3.push(new Point(y + x2, -x + y2));
      o4.push(new Point(x + x2, -y + y2));
      o5.push(new Point(-x + x2, -y + y2));
      o6.push(new Point(-y + x2, -x + y2));
      o7.push(new Point(-y + x2, x + y2));
      o8.push(new Point(-x + x2, y + y2));
      if (d < 0) {
        d += 4 * x + 6;
      } else {
        d += 4 * (x - y) + 10;
        y--;
      }
      x++;
    }

    var result = [];
    for (var i = 0; i < o1.length; ++i) result.push(o1[i]);
    for (var i = o2.length - 1; i >= 0; --i) result.push(o2[i]);
    for (var i = 0; i < o3.length; ++i) result.push(o3[i]);
    for (var i = o4.length - 1; i >= 0; --i) result.push(o4[i]);
    for (var i = 0; i < o5.length; ++i) result.push(o5[i]);
    for (var i = o6.length - 1; i >= 0; --i) result.push(o6[i]);
    for (var i = 0; i < o7.length; ++i) result.push(o7[i]);
    for (var i = o8.length - 1; i >= 0; --i) result.push(o8[i]);
    return result;
  }

  // Expose functions globally
  window.CrazeMode = {
    toggle: function(crazeController, handsFreeActive, stopHandsFree, crazeBtn) {
      if (handsFreeActive) {
        stopHandsFree();
      }

      if (crazeController.active) {
        crazeController.stop();
        crazeBtn.classList.remove('active');
      } else {
        crazeController.start();
        crazeBtn.classList.add('active');
      }
    },
    bresenhamLine: bresenhamLine,
    bresenhamCircle: bresenhamCircle
  };

})();

