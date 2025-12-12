// Moon brush - uses arcs (simplified for now)
function Moon(params, points, pointer) {
  Brush.call(this, params, points, pointer);
}

Moon.prototype = Object.create(Brush.prototype);
Moon.prototype.constructor = Moon;

Moon.buildBrush = function(params, pointer) {
  var points = Moon.getStaticBrushPoints(params, pointer);
  return new Moon(params, points, pointer);
};

Moon.prototype.getBrushPoints = function(pointer) {
  return Moon.getStaticBrushPoints(this.params, pointer);
};

Moon.getStaticBrushPoints = function(params, pointer) {
  // Same points as vertical brush
  var brushSize = params.brushSize;
  var i = brushSize / 2;
  var d1 = pointer.getX();
  var d2 = pointer.getY();
  
  return [
    new Point(d1, d2 - i),
    new Point(d1, d2 + i)
  ];
};

// Override getPath to draw moon shape with arcs
Moon.prototype.getPath = function(points, rotAngle, symmetry) {
  // For now, return regular path - full arc implementation would be complex
  // This creates a simple crescent approximation
  if (points.length < 2) return points;
  
  var p1 = points[0];
  var p2 = points[1];
  var radius = Math.sqrt(Math.pow(p2.getX() - p1.getX(), 2) + Math.pow(p2.getY() - p1.getY(), 2)) / 2;
  var center = this.getCentroid(points);
  
  // Return special marker for moon shape
  return { type: 'moon', center: center, radius: radius, points: points };
};

