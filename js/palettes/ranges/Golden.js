// Golden palette
function Golden() {
  Palette.call(this);
  
  var u1 = [0, 0, 0];
  var u2 = [250, 255, 112];
  var u3 = [255, 255, 255];
  var u4 = [227, 193, 111];
  var u5 = [0, 0, 0];
  
  var c1 = this.colors3DHSL(u1, u2, 255);
  var c2 = this.colors3DHSL(u2, u3, 255);
  var c3 = this.colors3DHSL(u3, u4, 255);
  var c4 = this.colors3DHSL(u4, u5, 255);
  
  var _colors = c1.concat(c2, c3, c4);
  this.colors = _colors.concat(_colors.slice().reverse());
}

Golden.prototype = Object.create(Palette.prototype);
Golden.prototype.constructor = Golden;

Golden.buildPalette = function() {
  return new Golden();
};

