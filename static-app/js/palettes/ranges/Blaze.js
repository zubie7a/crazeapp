// Blaze palette (was FIRE)
function Blaze() {
  Palette.call(this);
  
  this.colors = [];
  var r = 128;
  var g = 0;
  var b = 0;
  
  // Shining, Burning, Blazing Heart.
  for (var i = 0; i < 2000; i++) {
    if (i < 127) {
      r += 1;
    } else if (i < 127 + 255) {
      g += 1;
    } else if (i < 127 + 255 + 64) {
      b += 1;
    } else if (i < 127 + 255 + 64 + 64) {
      b -= 1;
    } else if (i < 127 + 255 + 64 + 64 + 255) {
      g -= 1;
    } else if (i < 127 + 255 + 64 + 64 + 255 + 127) {
      r -= 1;
    } else {
      break;
    }
    this.colors.push([r, g, b]);
  }
}

Blaze.prototype = Object.create(Palette.prototype);
Blaze.prototype.constructor = Blaze;

Blaze.buildPalette = function() {
  return new Blaze();
};

