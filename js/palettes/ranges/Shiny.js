// Shiny palette
function Shiny() {
  Palette.call(this);
  
  var u1 = [106, 212, 255];
  var u2 = [255, 107, 163];
  var u3 = [253, 143, 102];
  var u4 = [255, 212, 104];
  var u5 = [228, 251, 101];
  
  var c1 = this.colors3DHSL(u1, u2, 255);
  var c2 = this.colors3DHSL(u2, u3, 255);
  var c3 = this.colors3DHSL(u3, u4, 255);
  var c4 = this.colors3DHSL(u4, u5, 255);
  var c5 = this.colors3DHSL(u5, u1, 255);
  
  this.colors = c1.concat(c2, c3, c4, c5);
}

Shiny.prototype = Object.create(Palette.prototype);
Shiny.prototype.constructor = Shiny;

Shiny.buildPalette = function() {
  return new Shiny();
};

