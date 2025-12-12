// Cosmos palette
function Cosmos() {
  Palette.call(this);
  
  var u1 = [7, 9, 48];
  var u2 = [17, 35, 111];
  var u3 = [112, 89, 159];
  var u4 = [132, 74, 122];
  var u5 = [202, 130, 150];
  var u6 = [255, 255, 255];
  
  var c1 = this.colors3DLAB(u1, u2, 255);
  var c2 = this.colors3DLAB(u2, u3, 255);
  var c3 = this.colors3DLAB(u3, u4, 255);
  var c4 = this.colors3DLAB(u4, u5, 255);
  var c5 = this.colors3DLAB(u5, u6, 255);
  var c6 = this.colors3DLAB(u6, u1, 255);
  
  this.colors = c1.concat(c2, c3, c4, c5, c6);
}

Cosmos.prototype = Object.create(Palette.prototype);
Cosmos.prototype.constructor = Cosmos;

Cosmos.buildPalette = function() {
  return new Cosmos();
};

