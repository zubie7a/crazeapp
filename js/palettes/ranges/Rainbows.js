// Rainbows palette
function Rainbows() {
  Palette.call(this);
  
  this.colors = [];
  var r = 255;
  var g = 0;
  var b = 0;
  
  // The one and only, shifting dreamy rainbows.
  for (var i = 0; i < 1530; i++) {
    if (r === 255 && g !== 255 && b === 0) { g += 1; }
    if (r !== 0 && g === 255 && b === 0) { r -= 1; }
    if (r === 0 && g === 255 && b !== 255) { b += 1; }
    if (r === 0 && g !== 0 && b === 255) { g -= 1; }
    if (r !== 255 && g === 0 && b === 255) { r += 1; }
    if (r === 255 && g === 0 && b !== 0) { b -= 1; }
    this.colors.push([r, g, b]);
  }
}

Rainbows.prototype = Object.create(Palette.prototype);
Rainbows.prototype.constructor = Rainbows;

Rainbows.buildPalette = function() {
  return new Rainbows();
};

