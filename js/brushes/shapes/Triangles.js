// Triangles brush - equilateral triangle
function Triangles(params, points, pointer) {
  Brush.call(this, params, points, pointer);
}

Triangles.prototype = Object.create(Brush.prototype);
Triangles.prototype.constructor = Triangles;

Triangles.buildBrush = function(params, pointer) {
  var points = Triangles.getStaticBrushPoints(params, pointer);
  return new Triangles(params, points, pointer);
};

Triangles.prototype.getBrushPoints = function(pointer) {
  return Triangles.getStaticBrushPoints(this.params, pointer);
};

Triangles.getStaticBrushPoints = function(params, pointer) {
  var brushSize = params.brushSize;
  var i = brushSize / 2;
  var d1 = pointer.getX();
  var d2 = pointer.getY();
  var d3 = (i * 2) / Math.sqrt(3.0);
  
  return [
    new Point(d1, d2 - i),
    new Point(d1 - d3, d2 + i),
    new Point(d1 + d3, d2 + i)
  ];
};

// Override alignPoints for custom triangle grid alignment
Triangles.prototype.alignPoints = function(points, genCenter) {
  if (!genCenter || points.length === 0) {
    return points;
  }
  
  // The center of rotations/symmetry
  var center = new Point(this.params.centerX || 0, this.params.centerY || 0);
  // The size of the box to fit, width is different than h because of the equilateral triangle
  var h = this.params.brushSize;
  var w = Math.sqrt(4.0 / 3.0) * h;
  
  // Fit position to center of shape
  var fitPosCenter = this.alignGridPoint(center, genCenter, w, h);
  
  // To help determining alternating triangle orientation
  var hPosFactor = (fitPosCenter.getY() - center.getY()) / h;
  // Now use this factor to determine triangle orientation
  var posTriangleUp = (Math.floor(Math.abs(hPosFactor)) % 2 === 0);
  
  var posTriPoints = Triangles.getStaticBrushPoints(this.params, fitPosCenter);
  if (!posTriangleUp) {
    posTriPoints = this.verticalMirrorPoints(fitPosCenter, posTriPoints);
  }
  
  // Now check if the center is inside the fitted triangle
  var posInside = this.insideTriangle(genCenter, posTriPoints);
  
  if (!posInside) {
    // Then shift the fitted center to the left or to the right
    // depending to what side the point is outside the triangle
    var shiftVector = new Point(0, 0);
    if (genCenter.getX() < fitPosCenter.getX()) {
      shiftVector = new Point(-(w / 2), 0);
    } else {
      shiftVector = new Point((w / 2), 0);
    }
    posTriPoints = this.movePoints(posTriPoints, shiftVector);
    posTriPoints = this.verticalMirrorPoints(fitPosCenter, posTriPoints);
  }
  
  return posTriPoints;
};

