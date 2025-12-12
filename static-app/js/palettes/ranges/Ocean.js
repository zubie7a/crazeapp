// Ocean palette
function Ocean() {
  Palette.call(this);
  
  this.colors = [];
  var r = 0;
  var g = 0;
  var b = 128;
  
  // Endless Ocean, Peaceful and Restless.
  for (var i = 0; i < 2000; i++) {
    if (i < 127) {
      b += 1;
    } else if (i < 127 + 255) {
      g += 1;
    } else if (i < 127 + 255 + 127) {
      r += 1;
    } else if (i < 127 + 255 + 127 + 127) {
      r -= 1;
    } else if (i < 127 + 255 + 127 + 127 + 255) {
      g -= 1;
    } else if (i < 127 + 255 + 127 + 127 + 255 + 127) {
      b -= 1;
    } else {
      break;
    }
    this.colors.push([r, g, b]);
  }
}

Ocean.prototype = Object.create(Palette.prototype);
Ocean.prototype.constructor = Ocean;

Ocean.buildPalette = function() {
  return new Ocean();
};

