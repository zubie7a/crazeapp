// India palette
function India() {
  Palette.call(this);
  
  var u1 = [255, 153, 51];
  var u2 = [255, 255, 255];
  var u3 = [0, 0, 136];
  var u4 = [18, 136, 7];
  
  var c1 = this.colors3DLAB(u1, u2, 400);
  var c2 = this.colors3DLAB(u2, u3, 100);
  var c3 = this.colors3DLAB(u3, u2, 100);
  var c4 = this.colors3DLAB(u2, u4, 400);
  
  var _colors = c1.concat(c2, c3, c4);
  this.colors = _colors.concat(_colors.slice().reverse());
}

India.prototype = Object.create(Palette.prototype);
India.prototype.constructor = India;

India.buildPalette = function() {
  return new India();
};

