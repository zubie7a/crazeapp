// EightStar brush
function EightStar(params, points, pointer) {
  Brush.call(this, params, points, pointer);
}

EightStar.prototype = Object.create(Brush.prototype);
EightStar.prototype.constructor = EightStar;

EightStar.buildBrush = function(params, pointer) {
  var points = EightStar.getStaticBrushPoints(params, pointer);
  return new EightStar(params, points, pointer);
};

EightStar.prototype.getBrushPoints = function(pointer) {
  return EightStar.getStaticBrushPoints(this.params, pointer);
};

EightStar.getStaticBrushPoints = function(params, pointer) {
  var brushSize = params.brushSize;
  var i = brushSize / 2;
  var d1 = pointer.getX();
  var d2 = pointer.getY();
  
  // First point of the shape
  var first = new Point(d1, d2 - i);
  // 45 degrees but in radians
  var angle = (45.0 * Math.PI) / 180.0;
  var tempBrush = new Brush(params, [], pointer);
  // Rotate first point to find second point
  var secondPoints = tempBrush.rotatePoints(pointer, [first], angle);
  var second = secondPoints[0];
  // Find extra points for the inner vertex of the star
  var middle1 = tempBrush.getCentroid([first, second]);
  var middle2 = tempBrush.getCentroid([middle1, pointer]);
  
  // Deltas for inner corner
  var dxIn = Math.abs(middle2.getX() - d1);
  var dyIn = Math.abs(middle2.getY() - d2);
  // Deltas for outer corner
  var dxOut = Math.abs(second.getX() - d1);
  var dyOut = Math.abs(second.getY() - d2);
  
  return [
    new Point(d1, d2 - i),
    new Point(d1 + dxIn, d2 - dyIn),
    new Point(d1 + dxOut, d2 - dyOut),
    new Point(d1 + dyIn, d2 - dxIn),
    new Point(d1 + i, d2),
    new Point(d1 + dyIn, d2 + dxIn),
    new Point(d1 + dxOut, d2 + dyOut),
    new Point(d1 + dxIn, d2 + dyIn),
    new Point(d1, d2 + i),
    new Point(d1 - dxIn, d2 + dyIn),
    new Point(d1 - dxOut, d2 + dyOut),
    new Point(d1 - dyIn, d2 + dxIn),
    new Point(d1 - i, d2),
    new Point(d1 - dyIn, d2 - dxIn),
    new Point(d1 - dxOut, d2 - dyOut),
    new Point(d1 - dxIn, d2 - dyIn)
  ];
};

