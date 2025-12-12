// Peak brush
function Peak(params, points, pointer) {
  Brush.call(this, params, points, pointer);
}

Peak.prototype = Object.create(Brush.prototype);
Peak.prototype.constructor = Peak;

Peak.buildBrush = function(params, pointer) {
  var points = Peak.getStaticBrushPoints(params, pointer);
  return new Peak(params, points, pointer);
};

Peak.prototype.getBrushPoints = function(pointer) {
  return Peak.getStaticBrushPoints(this.params, pointer);
};

Peak.getStaticBrushPoints = function(params, pointer) {
  var brushSize = params.brushSize;
  var l = brushSize;
  var i = brushSize / 2;
  var d1 = pointer.getX();
  var d2 = pointer.getY();
  
  // Bottom-left corner
  var p1 = new Point(d1 - i, d2 + i);
  // Bottom-right corner
  var p2 = new Point(d1 + i, d2 + i);
  // Hypothetical height of equilateral triangle
  var h = Math.sqrt(3.0) / 2.0 * l;
  // Hypothetical third corner of equilateral triangle
  var top = new Point(d1, d2 - (h - l / 2));
  
  var x = l - (Math.pow(l, 2) / (2 * h));
  
  // Calculate relative vector and normalize
  var relativeToZero = new Point(p2.getX() - top.getX(), p2.getY() - top.getY());
  var dist = Math.sqrt(relativeToZero.getX() * relativeToZero.getX() + relativeToZero.getY() * relativeToZero.getY());
  var normalizedVector = new Point(relativeToZero.getX() / dist, relativeToZero.getY() / dist);
  var normalizedScaled = new Point(normalizedVector.getX() * x, normalizedVector.getY() * x);
  var c1 = new Point(top.getX() + normalizedScaled.getX(), top.getY() + normalizedScaled.getY());
  var tempBrush = new Brush(params, [], pointer);
  var c2Points = tempBrush.rotatePoints(pointer, [c1], Math.PI);
  var c2 = c2Points[0];
  var c3 = tempBrush.getCentroid([pointer, c1]);
  var c4Points = tempBrush.rotatePoints(c1, [c3], Math.PI / 3.0);
  var c4 = c4Points[0];
  var c5Points = tempBrush.rotatePoints(c2, [c3], -Math.PI / 3.0);
  var c5 = c5Points[0];
  
  return [p1, p2, c4, c3, c5];
};

// Override alignPoints for custom peak grid alignment
Peak.prototype.alignPoints = function(points, genCenter) {
  if (!genCenter || points.length === 0) {
    return points;
  }
  
  var center = new Point(this.params.centerX || 0, this.params.centerY || 0);
  var brushSize = this.params.brushSize;
  var i = brushSize / 2;
  var j = brushSize / 2;
  
  var h = i * 2;
  var w = j * 2;
  
  var fitPosCenter = this.alignGridPoint(center, genCenter, w, h);
  var hPosFactor = (fitPosCenter.getY() - center.getY()) / h;
  var vPosFactor = (fitPosCenter.getX() - center.getX()) / w;
  
  var posPeakUpV = Math.floor(Math.abs(vPosFactor)) % 2 === 0;
  var posPeakUpH = Math.floor(Math.abs(hPosFactor)) % 2 === 0;
  
  var posPeakPoints = Peak.getStaticBrushPoints(this.params, fitPosCenter);
  
  if (!posPeakUpV) {
    posPeakPoints = this.horizontalMirrorPoints(fitPosCenter, posPeakPoints);
  }
  
  if (!posPeakUpH) {
    posPeakPoints = this.verticalMirrorPoints(fitPosCenter, posPeakPoints);
  }
  
  return posPeakPoints;
};

