// Mint palette
function Mint() {
  Palette.call(this);
  
  var u1 = [67, 67, 67];
  var u2 = [14, 115, 111];
  var u3 = [152, 230, 206];
  var u4 = [197, 240, 225];
  var u5 = [243, 243, 243];
  
  var c1 = this.colors3DLAB(u1, u2, 255);
  var c2 = this.colors3DLAB(u2, u3, 255);
  var c3 = this.colors3DLAB(u3, u4, 255);
  var c4 = this.colors3DLAB(u4, u5, 255);
  var c5 = this.colors3DLAB(u5, u1, 255);
  
  this.colors = c1.concat(c2, c3, c4, c5);
}

Mint.prototype = Object.create(Palette.prototype);
Mint.prototype.constructor = Mint;

Mint.buildPalette = function() {
  return new Mint();
};

