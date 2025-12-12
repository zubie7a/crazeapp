// Sunny palette
function Sunny() {
  Palette.call(this);
  
  var u1 = [52, 56, 81];
  var u2 = [76, 193, 229];
  var u3 = [255, 255, 255];
  var u4 = [244, 237, 17];
  var u5 = [235, 167, 78];
  
  var c1 = this.colors3DHSL(u1, u2, 255);
  var c2 = this.colors3DHSL(u2, u3, 255);
  var c3 = this.colors3DHSL(u3, u4, 255);
  var c4 = this.colors3DHSL(u4, u5, 255);
  var c5 = this.colors3DHSL(u5, u1, 255);
  
  this.colors = c1.concat(c2, c3, c4, c5);
}

Sunny.prototype = Object.create(Palette.prototype);
Sunny.prototype.constructor = Sunny;

Sunny.buildPalette = function() {
  return new Sunny();
};

