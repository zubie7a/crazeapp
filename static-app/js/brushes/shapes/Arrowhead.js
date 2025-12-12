// Arrowhead brush
function Arrowhead(params, points, pointer) {
  Brush.call(this, params, points, pointer);
}

Arrowhead.prototype = Object.create(Brush.prototype);
Arrowhead.prototype.constructor = Arrowhead;

Arrowhead.buildBrush = function(params, pointer) {
  var points = Arrowhead.getStaticBrushPoints(params, pointer);
  return new Arrowhead(params, points, pointer);
};

Arrowhead.prototype.getBrushPoints = function(pointer) {
  return Arrowhead.getStaticBrushPoints(this.params, pointer);
};

Arrowhead.getStaticBrushPoints = function(params, pointer) {
  var brushSize = params.brushSize;
  var i = brushSize / 2;
  var d1 = pointer.getX();
  var d2 = pointer.getY();
  var d3 = (i * 2) / Math.sqrt(3.0);
  
  return [
    new Point(d1, d2 - i),
    new Point(d1 - d3, d2 + i),
    new Point(d1, d2),
    new Point(d1 + d3, d2 + i)
  ];
};

// Override alignPoints for custom arrowhead grid alignment (same as triangle)
Arrowhead.prototype.alignPoints = function(points, genCenter) {
  if (!genCenter || points.length === 0) {
    return points;
  }
  
  var center = new Point(this.params.centerX || 0, this.params.centerY || 0);
  var h = this.params.brushSize;
  var w = Math.sqrt(4.0 / 3.0) * h;
  
  var fitPosCenter = this.alignGridPoint(center, genCenter, w, h);
  var hPosFactor = (fitPosCenter.getY() - center.getY()) / h;
  var posTriangleUp = (Math.floor(Math.abs(hPosFactor)) % 2 === 0);
  
  var posTriPoints = Arrowhead.getStaticBrushPoints(this.params, fitPosCenter);
  if (!posTriangleUp) {
    posTriPoints = this.verticalMirrorPoints(fitPosCenter, posTriPoints);
  }
  
  var posInside = this.insideTriangle(genCenter, posTriPoints);
  
  if (!posInside) {
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

