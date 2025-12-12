// Pastel palette
function Pastel() {
  Palette.call(this);
  
  var u1 = [168, 230, 207];
  var u2 = [220, 237, 193];
  var u3 = [255, 211, 182];
  var u4 = [255, 170, 165];
  var u5 = [255, 139, 148];
  
  var c1 = this.colors3DHSL(u1, u2, 255);
  var c2 = this.colors3DHSL(u2, u3, 255);
  var c3 = this.colors3DHSL(u3, u4, 255);
  var c4 = this.colors3DHSL(u4, u5, 255);
  var c5 = this.colors3DHSL(u5, u1, 255);
  
  this.colors = c1.concat(c2, c3, c4, c5);
}

Pastel.prototype = Object.create(Palette.prototype);
Pastel.prototype.constructor = Pastel;

Pastel.buildPalette = function() {
  return new Pastel();
};

