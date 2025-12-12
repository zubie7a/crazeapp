// Comet brush
function Comet(params, points, pointer) {
  Brush.call(this, params, points, pointer);
}

Comet.prototype = Object.create(Brush.prototype);
Comet.prototype.constructor = Comet;

Comet.buildBrush = function(params, pointer) {
  var points = Comet.getStaticBrushPoints(params, pointer);
  return new Comet(params, points, pointer);
};

Comet.prototype.getBrushPoints = function(pointer) {
  return Comet.getStaticBrushPoints(this.params, pointer);
};

Comet.getStaticBrushPoints = function(params, pointer) {
  var brushSize = params.brushSize;
  var i = brushSize / 2;
  var j = brushSize / 4;
  var k = brushSize / 8;
  var l = brushSize / 16;
  var m = brushSize / 32;
  var d1 = pointer.getX();
  var d2 = pointer.getY();
  
  // First points of the shape
  var p1 = new Point(d1, d2 - i);
  var p2 = new Point(d1 + m, d2 - i + k + l);
  var p3 = new Point(d1 + k, d2 - i + k);
  var p4 = new Point(d1 + l, d2 - j - m);
  
  // Center of the upper comet side, the lower side will be the tail
  var center = new Point(d1, d2 - j);
  
  // 90 degrees but in radians
  var angle = (90.0 * Math.PI) / 180.0;
  
  var points1 = [p1, p2, p3, p4];
  var tempBrush = new Brush(params, [], pointer);
  var points2 = tempBrush.rotatePoints(center, points1, angle);
  var points3 = tempBrush.rotatePoints(center, points2, angle);
  var points4 = tempBrush.rotatePoints(center, points3, angle);
  
  // The tail of the comet
  points3[0] = new Point(points3[0].getX(), d2 + i);
  
  return points1.concat(points2).concat(points3).concat(points4);
};

