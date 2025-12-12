// Intense palette
function Intense() {
  Palette.call(this);
  
  var u1 = [0, 0, 0];
  var u2 = [255, 0, 154];
  var u3 = [255, 219, 0];
  var u4 = [255, 255, 255];
  
  var c1 = this.colors3DLAB(u1, u2, 255);
  var c2 = this.colors3DLAB(u2, u3, 255);
  var c3 = this.colors3DLAB(u3, u4, 255);
  var c4 = this.colors3DLAB(u4, u1, 255);
  
  var _colors = c1.concat(c2, c3, c4);
  this.colors = _colors.concat(_colors.slice().reverse());
}

Intense.prototype = Object.create(Palette.prototype);
Intense.prototype.constructor = Intense;

Intense.buildPalette = function() {
  return new Intense();
};

