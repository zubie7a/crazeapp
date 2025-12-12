// Comfy palette
function Comfy() {
  Palette.call(this);
  
  var u1 = [48, 242, 242];
  var u2 = [97, 242, 194];
  var u3 = [145, 242, 145];
  var u4 = [194, 242, 97];
  var u5 = [242, 242, 48];
  
  var c1 = this.colors3DLAB(u1, u2, 255);
  var c2 = this.colors3DLAB(u2, u3, 255);
  var c3 = this.colors3DLAB(u3, u4, 255);
  var c4 = this.colors3DLAB(u4, u5, 255);
  var c5 = this.colors3DLAB(u5, u1, 255);
  
  this.colors = c1.concat(c2, c3, c4, c5);
}

Comfy.prototype = Object.create(Palette.prototype);
Comfy.prototype.constructor = Comfy;

Comfy.buildPalette = function() {
  return new Comfy();
};

