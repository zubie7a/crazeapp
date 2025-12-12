// Glacier palette (was ICE)
function Glacier() {
  Palette.call(this);
  
  this.colors = [];
  var r = 0;
  var g = 128;
  var b = 128;
  
  // Sheer Cold, Absolute Zero.
  for (var m = 0; m < 1530; m++) {
    if (m % 3 === 0) {
      this.colors.push([r, g, b]);
      if (m < 765) {
        if ((g < 255) && (b < 255)) {
          g += 1;
          b += 1;
        } else if (r < 254) {
          r += 2;
        }
      } else {
        if (r > 1) {
          r -= 2;
        } else if ((g > 0) && (b > 0)) {
          g -= 1;
          b -= 1;
        }
      }
    } else {
      this.colors.push(this.colors[m - (m % 3)]);
    }
  }
}

Glacier.prototype = Object.create(Palette.prototype);
Glacier.prototype.constructor = Glacier;

Glacier.buildPalette = function() {
  return new Glacier();
};

