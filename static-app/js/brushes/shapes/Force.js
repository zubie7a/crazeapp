// Force brush - triangle with inner paths
function Force(params, points, pointer) {
  Brush.call(this, params, points, pointer);
}

Force.prototype = Object.create(Brush.prototype);
Force.prototype.constructor = Force;

Force.buildBrush = function(params, pointer) {
  var points = Force.getStaticBrushPoints(params, pointer);
  return new Force(params, points, pointer);
};

Force.prototype.getBrushPoints = function(pointer) {
  return Force.getStaticBrushPoints(this.params, pointer);
};

Force.getStaticBrushPoints = function(params, pointer) {
  var brushSize = params.brushSize;
  var i = brushSize / 2;
  var d1 = pointer.getX();
  var d2 = pointer.getY();
  var d3 = (i * 2) / Math.sqrt(3.0);
  
  return [
    new Point(d1, d2 - i),
    new Point(d1 + d3, d2 + i),
    new Point(d1 - d3, d2 + i)
  ];
};

// Override getPath to draw inner triangle paths
Force.prototype.getPath = function(points, rotAngle, symmetry) {
  if (points.length < 3) return points;
  
  var pA = points[0];
  var pB = points[1];
  var pC = points[2];
  
  var pAB = this.getCentroid([pA, pB]);
  var pBC = this.getCentroid([pB, pC]);
  var pCA = this.getCentroid([pC, pA]);
  
  // Return path with inner triangle connections
  return [pC, pCA, pA, pAB, pCA, pBC, pAB, pB, pBC, pC];
};

