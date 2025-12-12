// Blossom palette
function Blossom() {
  Palette.call(this);
  
  var u1 = [48, 20, 17];
  var u2 = [173, 34, 57];
  var u3 = [199, 105, 131];
  var u4 = [231, 160, 174];
  var u5 = [248, 211, 228];
  
  var c1 = this.colors3DLAB(u1, u2, 255);
  var c2 = this.colors3DLAB(u2, u3, 255);
  var c3 = this.colors3DLAB(u3, u4, 255);
  var c4 = this.colors3DLAB(u4, u5, 255);
  var c5 = this.colors3DLAB(u5, u1, 255);
  
  this.colors = c1.concat(c2, c3, c4, c5);
}

Blossom.prototype = Object.create(Palette.prototype);
Blossom.prototype.constructor = Blossom;

Blossom.buildPalette = function() {
  return new Blossom();
};

