// CMYK palette
function CMYK() {
  Palette.call(this);
  
  var u1 = [255, 255, 255];
  var u2 = [0, 255, 255];
  var u3 = [255, 0, 255];
  var u4 = [255, 255, 0];
  var u5 = [0, 0, 0];
  
  var c1 = this.colors3DLAB(u1, u2, 255);
  var c2 = this.colors3DLAB(u2, u3, 255);
  var c3 = this.colors3DLAB(u3, u4, 255);
  var c4 = this.colors3DLAB(u4, u5, 255);
  
  var _colors = c1.concat(c2, c3, c4);
  this.colors = _colors.concat(_colors.slice().reverse());
}

CMYK.prototype = Object.create(Palette.prototype);
CMYK.prototype.constructor = CMYK;

CMYK.buildPalette = function() {
  return new CMYK();
};

