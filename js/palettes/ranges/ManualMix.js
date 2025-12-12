// ManualMix palette - uses LAB interpolation for smooth gradients
function ManualMix(rgb) {
  Palette.call(this);
  
  rgb = rgb || [];
  var initialColors = [];
  
  // rgb will contain multiples of 3 elements, each 3 elements are a new color to be mixed
  for (var i = 0; i < rgb.length; i += 3) {
    var _r = Math.round(rgb[i] * 255);
    var _g = Math.round(rgb[i + 1] * 255);
    var _b = Math.round(rgb[i + 2] * 255);
    initialColors.push([_r, _g, _b]);
  }
  
  var colors = [];
  // Now iterate the initialColors array and create for every pair a gradient
  for (var i = 0; i < initialColors.length - 1; i++) {
    var u1 = initialColors[i];
    var u2 = initialColors[i + 1];
    var c = this.colors3DLAB(u1, u2, 255);
    colors = colors.concat(c);
  }
  
  if (initialColors.length === 1) {
    // To have enough colors for the preview
    var u1 = initialColors[0];
    colors = this.colors3DLAB(u1, u1, 255);
  }
  
  // Add reversed colors
  this.colors = colors.concat(colors.slice().reverse());
}

ManualMix.prototype = Object.create(Palette.prototype);
ManualMix.prototype.constructor = ManualMix;

ManualMix.buildPalette = function(rgb) {
  return new ManualMix(rgb);
};

