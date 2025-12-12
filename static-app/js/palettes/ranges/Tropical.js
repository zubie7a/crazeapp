// Tropical palette
function Tropical() {
  Palette.call(this);
  
  this.colors = [];
  var r = 255;
  var g = 0;
  var b = 0;
  
  for (var i = 0; i < 2000; i++) {
    if (i < 255) {
      g += 1;
    } else if (i < 255 + 255) {
      r -= 1;
    } else if (i < 255 + 255 + 255) {
      b += 1;
    } else if (i < 255 + 255 + 255 + 255) {
      b -= 1;
    } else if (i < 255 + 255 + 255 + 255 + 255) {
      r += 1;
    } else if (i < 255 + 255 + 255 + 255 + 255 + 255) {
      g -= 1;
    } else {
      break;
    }
    this.colors.push([r, g, b]);
  }
}

Tropical.prototype = Object.create(Palette.prototype);
Tropical.prototype.constructor = Tropical;

Tropical.buildPalette = function() {
  return new Tropical();
};

