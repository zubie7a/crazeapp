// Future palette
function Future() {
  Palette.call(this);
  
  var u1 = [221, 162, 151];
  var u2 = [86, 39, 207];
  var u3 = [73, 48, 89];
  var u4 = [220, 239, 95];
  var u5 = [184, 244, 28];
  var u6 = [131, 43, 91];
  
  // AWESOME RANDOM PALETTE #1
  var c1 = this.colors3DHSL(u1, u2, 255);
  var c2 = this.colors3DHSL(u2, u3, 255);
  var c3 = this.colors3DHSL(u3, u4, 255);
  var c4 = this.colors3DHSL(u4, u5, 255);
  var c5 = this.colors3DHSL(u5, u6, 255);
  var c6 = this.colors3DHSL(u6, u1, 255);
  
  this.colors = c1.concat(c2, c3, c4, c5, c6);
}

Future.prototype = Object.create(Palette.prototype);
Future.prototype.constructor = Future;

Future.buildPalette = function() {
  return new Future();
};

