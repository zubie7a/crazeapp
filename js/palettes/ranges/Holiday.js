// Holiday palette
function Holiday() {
  Palette.call(this);
  
  var u1 = [255, 190, 11];
  var u2 = [251, 86, 7];
  var u3 = [255, 0, 110];
  var u4 = [131, 56, 255];
  var u5 = [58, 134, 255];
  
  var c1 = this.colors3DLAB(u1, u2, 255);
  var c2 = this.colors3DLAB(u2, u3, 255);
  var c3 = this.colors3DLAB(u3, u4, 255);
  var c4 = this.colors3DLAB(u4, u5, 255);
  var c5 = this.colors3DLAB(u5, u1, 255);
  
  this.colors = c1.concat(c2, c3, c4, c5);
}

Holiday.prototype = Object.create(Palette.prototype);
Holiday.prototype.constructor = Holiday;

Holiday.buildPalette = function() {
  return new Holiday();
};

