// Parallelogram brush
function Parallelogram(params, points, pointer) {
  Brush.call(this, params, points, pointer);
}

Parallelogram.prototype = Object.create(Brush.prototype);
Parallelogram.prototype.constructor = Parallelogram;

Parallelogram.buildBrush = function(params, pointer) {
  var points = Parallelogram.getStaticBrushPoints(params, pointer);
  return new Parallelogram(params, points, pointer);
};

Parallelogram.prototype.getBrushPoints = function(pointer) {
  return Parallelogram.getStaticBrushPoints(this.params, pointer);
};

Parallelogram.getStaticBrushPoints = function(params, pointer) {
  var brushSize = params.brushSize;
  var i = brushSize / 2;
  var j = brushSize / 4;
  var d1 = pointer.getX();
  var d2 = pointer.getY();
  
  return [
    new Point(d1 - i, d2 - i),
    new Point(d1 + j, d2 - i),
    new Point(d1 + i, d2 + i),
    new Point(d1 - j, d2 + i)
  ];
};

// Override alignPoints for custom parallelogram grid alignment
Parallelogram.prototype.alignPoints = function(points, genCenter) {
  if (!genCenter || points.length === 0) {
    return points;
  }
  
  // The center of rotations/symmetry
  var center = new Point(this.params.centerX || 0, this.params.centerY || 0);
  // The size of the box to fit
  var brushSize = this.params.brushSize;
  var i = brushSize / 2;
  var j = brushSize / 4 + brushSize / 8;
  
  var h = i * 2;
  var w = j * 2;
  
  // Fit position to center of shape
  var fitPosCenter = this.alignGridPoint(center, genCenter, w, h);
  
  // To help determining alternating parallelogram orientation
  var hPosFactor = (fitPosCenter.getY() - center.getY()) / h;
  // Now use this factor to determine parallelogram orientation
  var posParallelogramUp = (Math.floor(Math.abs(hPosFactor)) % 2 === 0);
  
  var posParallelogramPoints = Parallelogram.getStaticBrushPoints(this.params, fitPosCenter);
  
  if (!posParallelogramUp) {
    posParallelogramPoints = this.verticalMirrorPoints(fitPosCenter, posParallelogramPoints);
  }
  
  return posParallelogramPoints;
};

