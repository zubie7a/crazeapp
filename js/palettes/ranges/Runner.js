// Runner palette
function Runner() {
  Palette.call(this);
  
  var u1 = [235, 57, 30];
  var u2 = [253, 187, 4];
  var u3 = [227, 142, 101];
  var u4 = [2, 160, 161];
  var u5 = [16, 66, 92];
  
  var c1 = this.colors3DLAB(u1, u2, 255);
  var c2 = this.colors3DLAB(u2, u3, 255);
  var c3 = this.colors3DLAB(u3, u4, 255);
  var c4 = this.colors3DLAB(u4, u5, 255);
  var c5 = this.colors3DLAB(u5, u1, 255);
  
  this.colors = c1.concat(c2, c3, c4, c5);
}

Runner.prototype = Object.create(Palette.prototype);
Runner.prototype.constructor = Runner;

Runner.buildPalette = function() {
  return new Runner();
};

