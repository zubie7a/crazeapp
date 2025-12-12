// Grayscale palette
function Grayscale() {
  Palette.call(this);
  
  this.colors = [];
  var r = 128;
  var g = 128;
  var b = 128;
  
  for (var i = 0; i < 2000; i++) {
    if (i < 127) {
      r += 1; g += 1; b += 1;
    } else if (i < 127 + 64) {
      r -= 1; g -= 1; b -= 1;
    } else if (i < 127 + 64 + 64) {
      r += 1; g += 1; b += 1;
    } else if (i < 127 + 64 + 64 + 255) {
      r -= 1; g -= 1; b -= 1;
    } else if (i < 127 + 64 + 64 + 255 + 127) {
      r += 1; g += 1; b += 1;
    } else {
      break;
    }
    this.colors.push([r, g, b]);
  }
}

Grayscale.prototype = Object.create(Palette.prototype);
Grayscale.prototype.constructor = Grayscale;

Grayscale.buildPalette = function() {
  return new Grayscale();
};

