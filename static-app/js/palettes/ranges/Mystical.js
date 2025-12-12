// Mystical palette (was MYSTIC)
function Mystical() {
  Palette.call(this);
  
  this.colors = [];
  var r = 255;
  var g = 0;
  var b = 0;
  
  for (var i = 0; i < 2000; i++) {
    if (i < 255) {
      b += 1;
    } else if (i < 255 + 255) {
      r -= 1;
    } else if (i < 255 + 255 + 255) {
      g += 1;
    } else if (i < 255 + 255 + 255 + 255) {
      g -= 1;
    } else if (i < 255 + 255 + 255 + 255 + 255) {
      r += 1;
    } else if (i < 255 + 255 + 255 + 255 + 255 + 255) {
      b -= 1;
    } else {
      break;
    }
    this.colors.push([r, g, b]);
  }
}

Mystical.prototype = Object.create(Palette.prototype);
Mystical.prototype.constructor = Mystical;

Mystical.buildPalette = function() {
  return new Mystical();
};

