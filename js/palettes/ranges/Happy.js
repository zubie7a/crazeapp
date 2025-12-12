// Happy palette
function Happy() {
  Palette.call(this);
  
  var u1 = [255, 34, 0];
  var u2 = [207, 209, 0];
  var u3 = [255, 223, 0];
  var u4 = [246, 241, 218];
  var u5 = [97, 178, 195];
  
  var c1 = this.colors3DLAB(u1, u2, 255);
  var c2 = this.colors3DLAB(u2, u3, 255);
  var c3 = this.colors3DLAB(u3, u4, 255);
  var c4 = this.colors3DLAB(u4, u5, 255);
  var c5 = this.colors3DLAB(u5, u1, 255);
  
  this.colors = c1.concat(c2, c3, c4, c5);
}

Happy.prototype = Object.create(Palette.prototype);
Happy.prototype.constructor = Happy;

Happy.buildPalette = function() {
  return new Happy();
};

