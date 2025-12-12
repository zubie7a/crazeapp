// Circles brush - circle shape (represented as two points for diameter)
function Circles(params, points, pointer) {
  Brush.call(this, params, points, pointer);
}

Circles.prototype = Object.create(Brush.prototype);
Circles.prototype.constructor = Circles;

Circles.buildBrush = function(params, pointer) {
  var points = Circles.getStaticBrushPoints(params, pointer);
  return new Circles(params, points, pointer);
};

Circles.prototype.getBrushPoints = function(pointer) {
  return Circles.getStaticBrushPoints(this.params, pointer);
};

Circles.getStaticBrushPoints = function(params, pointer) {
  var brushSize = params.brushSize;
  var i = brushSize / 2;
  var d1 = pointer.getX();
  var d2 = pointer.getY();
  
  // Circle is represented as horizontal diameter points
  return [
    new Point(d1 - i, d2),
    new Point(d1 + i, d2)
  ];
};

// Override getPath to draw circles
Circles.prototype.getPath = function(points, rotAngle, symmetry) {
  // For circles, return special marker
  return { type: 'circle', points: points };
};

