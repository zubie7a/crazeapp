// Netherlands palette
function Netherlands() {
  Palette.call(this);
  
  var u1 = [174, 28, 40];
  var u2 = [255, 255, 255];
  var u3 = [33, 70, 139];
  
  var c1 = this.colors3DLAB(u1, u2, 255);
  var c2 = this.colors3DLAB(u2, u3, 255);
  
  var _colors = c1.concat(c2);
  this.colors = _colors.concat(_colors.slice().reverse());
}

Netherlands.prototype = Object.create(Palette.prototype);
Netherlands.prototype.constructor = Netherlands;

Netherlands.buildPalette = function() {
  return new Netherlands();
};

