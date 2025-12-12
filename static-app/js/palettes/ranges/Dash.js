// Dash palette
function Dash() {
  Palette.call(this);
  
  var u1 = [238, 64, 53];
  var u2 = [243, 119, 54];
  var u3 = [253, 244, 152];
  var u4 = [123, 192, 67];
  var u5 = [3, 146, 207];
  
  var c1 = this.colors3DHSL(u1, u2, 255);
  var c2 = this.colors3DHSL(u2, u3, 255);
  var c3 = this.colors3DHSL(u3, u4, 255);
  var c4 = this.colors3DHSL(u4, u5, 255);
  var c5 = this.colors3DHSL(u5, u1, 255);
  
  this.colors = c1.concat(c2, c3, c4, c5);
}

Dash.prototype = Object.create(Palette.prototype);
Dash.prototype.constructor = Dash;

Dash.buildPalette = function() {
  return new Dash();
};

