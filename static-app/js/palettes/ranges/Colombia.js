// Colombia palette
function Colombia() {
  Palette.call(this);
  
  var u1 = [249, 206, 92];
  var u2 = [216, 160, 22];
  var u3 = [28, 61, 114];
  var u4 = [0, 0, 114];
  var u5 = [68, 0, 0];
  var u6 = [194, 0, 0];
  
  var c1 = this.colors3DLAB(u1, u2, 255);
  var c2 = this.colors3DLAB(u2, u3, 255);
  var c3 = this.colors3DLAB(u3, u4, 255);
  var c4 = this.colors3DLAB(u4, u5, 255);
  var c5 = this.colors3DLAB(u5, u6, 255);
  
  var _colors = c1.concat(c2, c3, c4, c5);
  this.colors = _colors.concat(_colors.slice().reverse());
}

Colombia.prototype = Object.create(Palette.prototype);
Colombia.prototype.constructor = Colombia;

Colombia.buildPalette = function() {
  return new Colombia();
};

