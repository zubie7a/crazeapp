// Sunrise palette
function Sunrise() {
  Palette.call(this);
  
  var u1 = [255, 159, 28];
  var u2 = [255, 191, 105];
  var u3 = [255, 255, 255];
  var u4 = [203, 243, 240];
  var u5 = [46, 196, 182];
  
  var c1 = this.colors3DLAB(u1, u2, 255);
  var c2 = this.colors3DLAB(u2, u3, 255);
  var c3 = this.colors3DLAB(u3, u4, 255);
  var c4 = this.colors3DLAB(u4, u5, 255);
  var c5 = this.colors3DLAB(u5, u1, 255);
  
  this.colors = c1.concat(c2, c3, c4, c5);
}

Sunrise.prototype = Object.create(Palette.prototype);
Sunrise.prototype.constructor = Sunrise;

Sunrise.buildPalette = function() {
  return new Sunrise();
};

