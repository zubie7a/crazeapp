// Seal brush
function Seal(params, points, pointer) {
  Brush.call(this, params, points, pointer);
}

Seal.prototype = Object.create(Brush.prototype);
Seal.prototype.constructor = Seal;

Seal.buildBrush = function(params, pointer) {
  var points = Seal.getStaticBrushPoints(params, pointer);
  return new Seal(params, points, pointer);
};

Seal.prototype.getBrushPoints = function(pointer) {
  return Seal.getStaticBrushPoints(this.params, pointer);
};

Seal.getStaticBrushPoints = function(params, pointer) {
  var brushSize = params.brushSize;
  var d1 = pointer.getX();
  var d2 = pointer.getY();
  var i = brushSize / 2;
  var k = brushSize * 2.9 / 7;
  
  var p1 = new Point(d1 - k/2, d2 - i);
  var p2 = new Point(d1 + k/2, d2 - i);
  var p3 = new Point(d1 + i, d2 - k/2);
  var p4 = new Point(d1 + i, d2 + k/2);
  var p5 = new Point(d1 + k/2, d2 + i);
  var p6 = new Point(d1 - k/2, d2 + i);
  var p7 = new Point(d1 - i, d2 + k/2);
  var p8 = new Point(d1 - i, d2 - k/2);
  
  return [p1, p4, p7, p2, p5, p8, p3, p6];
};

