// Bluesky palette
function Bluesky() {
  Palette.call(this);
  
  this.colors = [];
  var r = 0;
  var g = 128;
  var b = 128;
  
  // The sky is limitless yet is our limit.
  for (var i = 0; i < 2000; i++) {
    if (i < 127) {
      b += 1;
    } else if (i < 127 + 127) {
      g += 1;
    } else if (i < 127 + 127 + 126) {
      r += 2;
    } else if (i < 127 + 127 + 126 + 126) {
      r -= 2;
    } else if (i < 127 + 127 + 126 + 126 + 127) {
      g -= 1;
    } else if (i < 127 + 127 + 126 + 126 + 127 + 127) {
      b -= 1;
    } else {
      break;
    }
    this.colors.push([r, g, b]);
  }
}

Bluesky.prototype = Object.create(Palette.prototype);
Bluesky.prototype.constructor = Bluesky;

Bluesky.buildPalette = function() {
  return new Bluesky();
};

