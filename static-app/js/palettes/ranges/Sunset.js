// Sunset palette
function Sunset() {
  Palette.call(this);
  
  this.colors = [];
  var r = 0;
  var g = 0;
  var b = 255;
  
  for (var i = 0; i < 2000; i++) {
    if (i < 255) {
      r += 1;
    } else if (i < 255 + 255) {
      b -= 1;
    } else if (i < 255 + 255 + 255) {
      g += 1;
    } else if (i < 255 + 255 + 255 + 255) {
      g -= 1;
    } else if (i < 255 + 255 + 255 + 255 + 255) {
      b += 1;
    } else if (i < 255 + 255 + 255 + 255 + 255 + 255) {
      r -= 1;
    } else {
      break;
    }
    this.colors.push([r, g, b]);
  }
}

Sunset.prototype = Object.create(Palette.prototype);
Sunset.prototype.constructor = Sunset;

Sunset.buildPalette = function() {
  return new Sunset();
};

