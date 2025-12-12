// Cyber palette
function Cyber() {
  Palette.call(this);
  
  var u1 = [103, 30, 63];
  var u2 = [194, 59, 119];
  var u3 = [215, 216, 221];
  var u4 = [77, 157, 182];
  var u5 = [48, 83, 122];
  var u6 = [15, 24, 35];
  
  var c1 = this.colors3DHSL(u1, u2, 255);
  var c2 = this.colors3DHSL(u2, u3, 255);
  var c3 = this.colors3DHSL(u3, u4, 255);
  var c4 = this.colors3DHSL(u4, u5, 255);
  var c5 = this.colors3DHSL(u5, u6, 255);
  var c6 = this.colors3DHSL(u6, u1, 255);
  
  this.colors = c1.concat(c2, c3, c4, c5, c6);
}

Cyber.prototype = Object.create(Palette.prototype);
Cyber.prototype.constructor = Cyber;

Cyber.buildPalette = function() {
  return new Cyber();
};

