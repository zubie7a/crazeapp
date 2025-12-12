// Beach palette
function Beach() {
  Palette.call(this);
  
  var u1 = [255, 103, 0];
  var u2 = [255, 222, 0];
  var u3 = [183, 211, 242];
  var u4 = [58, 110, 165];
  var u5 = [0, 78, 152];
  
  var c1 = this.colors3DHSL(u1, u2, 255);
  var c2 = this.colors3DHSL(u2, u3, 255);
  var c3 = this.colors3DHSL(u3, u4, 255);
  var c4 = this.colors3DHSL(u4, u5, 255);
  
  var _colors = c1.concat(c2, c3, c4);
  this.colors = _colors.concat(_colors.slice().reverse());
}

Beach.prototype = Object.create(Palette.prototype);
Beach.prototype.constructor = Beach;

Beach.buildPalette = function() {
  return new Beach();
};

