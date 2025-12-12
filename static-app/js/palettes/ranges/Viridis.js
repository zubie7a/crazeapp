// Viridis palette
function Viridis() {
  Palette.call(this);
  
  var u1 = [68, 1, 84];
  var u2 = [62, 75, 137];
  var u3 = [38, 130, 142];
  var u4 = [53, 183, 121];
  var u5 = [253, 231, 37];
  
  var c1 = this.colors3DLAB(u1, u2, 255);
  var c2 = this.colors3DLAB(u2, u3, 255);
  var c3 = this.colors3DLAB(u3, u4, 255);
  var c4 = this.colors3DLAB(u4, u5, 255);
  var c5 = this.colors3DLAB(u5, u1, 255);
  
  this.colors = c1.concat(c2, c3, c4, c5);
}

Viridis.prototype = Object.create(Palette.prototype);
Viridis.prototype.constructor = Viridis;

Viridis.buildPalette = function() {
  return new Viridis();
};

