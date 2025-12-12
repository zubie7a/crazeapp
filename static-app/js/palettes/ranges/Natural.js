// Natural palette (was NATURE)
function Natural() {
  Palette.call(this);
  
  this.colors = [];
  var r = 0;
  var g = 128;
  var b = 0;
  
  // Silent Forest, Wise and Oldest.
  for (var i = 0; i < 2000; i++) {
    if (i < 127) {
      g += 1;
    } else if (i < 127 + 255) {
      b += 1;
    } else if (i < 127 + 255 + 64) {
      r += 1;
    } else if (i < 127 + 255 + 64 + 64) {
      r -= 1;
    } else if (i < 127 + 255 + 64 + 64 + 255) {
      b -= 1;
    } else if (i < 127 + 255 + 64 + 64 + 255 + 127) {
      g -= 1;
    } else {
      break;
    }
    this.colors.push([r, g, b]);
  }
}

Natural.prototype = Object.create(Palette.prototype);
Natural.prototype.constructor = Natural;

Natural.buildPalette = function() {
  return new Natural();
};

