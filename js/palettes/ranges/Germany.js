// Germany palette
function Germany() {
  Palette.call(this);
  
  var u1 = [0, 0, 0];
  var u2 = [255, 0, 0];
  var u3 = [255, 204, 0];
  
  var c1 = this.colors3DLAB(u1, u2, 255);
  var c2 = this.colors3DLAB(u2, u3, 255);
  
  var _colors = c1.concat(c2);
  this.colors = _colors.concat(_colors.slice().reverse());
}

Germany.prototype = Object.create(Palette.prototype);
Germany.prototype.constructor = Germany;

Germany.buildPalette = function() {
  return new Germany();
};

