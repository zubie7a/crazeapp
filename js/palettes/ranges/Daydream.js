// Daydream palette
function Daydream() {
  Palette.call(this);
  
  var u1 = [0, 234, 211];
  var u2 = [255, 245, 183];
  var u3 = [255, 68, 159];
  var u4 = [0, 95, 153];
  
  var c1 = this.colors3DLAB(u1, u2, 255);
  var c2 = this.colors3DLAB(u2, u3, 255);
  var c3 = this.colors3DLAB(u3, u4, 255);
  var c4 = this.colors3DLAB(u4, u1, 255);
  
  this.colors = c1.concat(c2, c3, c4);
}

Daydream.prototype = Object.create(Palette.prototype);
Daydream.prototype.constructor = Daydream;

Daydream.buildPalette = function() {
  return new Daydream();
};

