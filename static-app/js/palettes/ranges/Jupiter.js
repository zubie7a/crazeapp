// Jupiter palette
function Jupiter() {
  Palette.call(this);
  
  var u1 = [97, 73, 47];
  var u2 = [240, 60, 7];
  var u3 = [180, 99, 36];
  var u4 = [250, 164, 87];
  var u5 = [239, 216, 222];
  
  var c1 = this.colors3DLAB(u1, u2, 255);
  var c2 = this.colors3DLAB(u2, u3, 255);
  var c3 = this.colors3DLAB(u3, u4, 255);
  var c4 = this.colors3DLAB(u4, u5, 255);
  var c5 = this.colors3DLAB(u5, u1, 255);
  
  this.colors = c1.concat(c2, c3, c4, c5);
}

Jupiter.prototype = Object.create(Palette.prototype);
Jupiter.prototype.constructor = Jupiter;

Jupiter.buildPalette = function() {
  return new Jupiter();
};

