// Mexico palette
function Mexico() {
  Palette.call(this);
  
  var u1 = [206, 17, 38];
  var u2 = [255, 255, 255];
  var u3 = [0, 104, 71];
  
  var c1 = this.colors3DLAB(u1, u2, 255);
  var c2 = this.colors3DLAB(u2, u3, 255);
  
  var _colors = c1.concat(c2);
  this.colors = _colors.concat(_colors.slice().reverse());
}

Mexico.prototype = Object.create(Palette.prototype);
Mexico.prototype.constructor = Mexico;

Mexico.buildPalette = function() {
  return new Mexico();
};

