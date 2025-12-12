// Brazil palette
function Brazil() {
  Palette.call(this);
  
  this.colors = [];
  var r = 0;
  var g = 0;
  var b = 255;
  
  for (var i = 0; i < 2000; i++) {
    if (i < 255) {
      g += 1;
    } else if (i < 255 + 255) {
      b -= 1;
    } else if (i < 255 + 255 + 255) {
      r += 1;
    } else if (i < 255 + 255 + 255 + 255) {
      r -= 1;
    } else if (i < 255 + 255 + 255 + 255 + 255) {
      b += 1;
    } else if (i < 255 + 255 + 255 + 255 + 255 + 255) {
      g -= 1;
    } else {
      break;
    }
    this.colors.push([r, g, b]);
  }
}

Brazil.prototype = Object.create(Palette.prototype);
Brazil.prototype.constructor = Brazil;

Brazil.buildPalette = function() {
  return new Brazil();
};

