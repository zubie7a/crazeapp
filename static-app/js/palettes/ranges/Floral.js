// Floral palette
function Floral() {
  Palette.call(this);
  
  var u1 = [255, 250, 240];
  var u2 = [255, 228, 225];
  var u3 = [204, 204, 255];
  var u4 = [171, 205, 239];
  var u5 = [127, 0, 255];
  
  var c1 = this.colors3DHSL(u1, u2, 255);
  var c2 = this.colors3DHSL(u2, u3, 255);
  var c3 = this.colors3DHSL(u3, u4, 255);
  var c4 = this.colors3DHSL(u4, u5, 255);
  
  var _colors = c1.concat(c2, c3, c4);
  this.colors = _colors.concat(_colors.slice().reverse());
}

Floral.prototype = Object.create(Palette.prototype);
Floral.prototype.constructor = Floral;

Floral.buildPalette = function() {
  return new Floral();
};

