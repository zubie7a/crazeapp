// Sepia palette
function Sepia() {
  Palette.call(this);
  
  var u1 = [44, 23, 8];
  var u2 = [74, 41, 11];
  var u3 = [133, 74, 29];
  var u4 = [192, 130, 38];
  var u5 = [255, 255, 255];
  
  var c1 = this.colors3DLAB(u1, u2, 255);
  var c2 = this.colors3DLAB(u2, u3, 255);
  var c3 = this.colors3DLAB(u3, u4, 255);
  var c4 = this.colors3DLAB(u4, u5, 255);
  var c5 = this.colors3DLAB(u5, u1, 255);
  
  this.colors = c1.concat(c2, c3, c4, c5);
}

Sepia.prototype = Object.create(Palette.prototype);
Sepia.prototype.constructor = Sepia;

Sepia.buildPalette = function() {
  return new Sepia();
};

