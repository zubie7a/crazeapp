// Hyperspace palette
function Hyperspace() {
  Palette.call(this);
  
  var u1 = [0, 0, 0];
  var u2 = [17, 29, 94];
  var u3 = [199, 0, 57];
  var u4 = [243, 113, 33];
  var u5 = [192, 226, 24];
  var u6 = [254, 205, 26];
  var u7 = [253, 58, 105];
  var u8 = [157, 1, 145];
  
  var c1 = this.colors3DLAB(u1, u2, 200);
  var c2 = this.colors3DLAB(u2, u3, 200);
  var c3 = this.colors3DLAB(u3, u4, 200);
  var c4 = this.colors3DLAB(u4, u5, 200);
  var c5 = this.colors3DLAB(u5, u6, 200);
  var c6 = this.colors3DLAB(u6, u7, 200);
  var c7 = this.colors3DLAB(u7, u8, 200);
  var c8 = this.colors3DLAB(u8, u1, 200);
  
  this.colors = c1.concat(c2, c3, c4, c5, c6, c7, c8);
}

Hyperspace.prototype = Object.create(Palette.prototype);
Hyperspace.prototype.constructor = Hyperspace;

Hyperspace.buildPalette = function() {
  return new Hyperspace();
};

