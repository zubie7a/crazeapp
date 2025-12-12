// Lime palette
function Lime() {
  Palette.call(this);
  
  var u1 = [255, 147, 79];
  var u2 = [194, 232, 18];
  var u3 = [145, 245, 173];
  var u4 = [255, 255, 255];
  var u5 = [191, 203, 194];
  
  var c1 = this.colors3DHSL(u1, u2, 255);
  var c2 = this.colors3DHSL(u2, u3, 255);
  var c3 = this.colors3DHSL(u3, u4, 255);
  var c4 = this.colors3DHSL(u4, u5, 255);
  
  var _colors = c1.concat(c2, c3, c4);
  this.colors = _colors.concat(_colors.slice().reverse());
}

Lime.prototype = Object.create(Palette.prototype);
Lime.prototype.constructor = Lime;

Lime.buildPalette = function() {
  return new Lime();
};

