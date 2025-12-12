// Aurora palette
function Aurora() {
  Palette.call(this);
  
  this.colors = [];
  var r = 0;
  var g = 255;
  var b = 0;
  
  for (var i = 0; i < 2000; i++) {
    if (i < 255) {
      b += 1;
    } else if (i < 255 + 255) {
      g -= 1;
    } else if (i < 255 + 255 + 255) {
      r += 1;
    } else if (i < 255 + 255 + 255 + 255) {
      r -= 1;
    } else if (i < 255 + 255 + 255 + 255 + 255) {
      g += 1;
    } else if (i < 255 + 255 + 255 + 255 + 255 + 255) {
      b -= 1;
    } else {
      break;
    }
    this.colors.push([r, g, b]);
  }
}

Aurora.prototype = Object.create(Palette.prototype);
Aurora.prototype.constructor = Aurora;

Aurora.buildPalette = function() {
  return new Aurora();
};

