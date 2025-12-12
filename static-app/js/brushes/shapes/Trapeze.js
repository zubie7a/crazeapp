// Trapeze brush
function Trapeze(params, points, pointer) {
  Brush.call(this, params, points, pointer);
}

Trapeze.prototype = Object.create(Brush.prototype);
Trapeze.prototype.constructor = Trapeze;

Trapeze.buildBrush = function(params, pointer) {
  var points = Trapeze.getStaticBrushPoints(params, pointer);
  return new Trapeze(params, points, pointer);
};

Trapeze.prototype.getBrushPoints = function(pointer) {
  return Trapeze.getStaticBrushPoints(this.params, pointer);
};

Trapeze.getStaticBrushPoints = function(params, pointer) {
  var brushSize = params.brushSize;
  var i = brushSize / 2;
  var j = brushSize / 4;
  var d1 = pointer.getX();
  var d2 = pointer.getY();
  
  return [
    new Point(d1 - j, d2 - i),
    new Point(d1 + j, d2 - i),
    new Point(d1 + i, d2 + i),
    new Point(d1 - i, d2 + i)
  ];
};

// Override alignPoints for custom trapeze grid alignment
Trapeze.prototype.alignPoints = function(points, genCenter) {
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
  
  // To help determining alternating trapeze orientation
  var hPosFactor = (fitPosCenter.getY() - center.getY()) / h;
  var vPosFactor = (fitPosCenter.getX() - center.getX()) / w;
  
  // Now use both these factors to determine trapeze orientation
  var posTrapezeUpV = Math.floor(Math.abs(vPosFactor)) % 2 === 0;
  var posTrapezeUpH = Math.floor(Math.abs(hPosFactor)) % 2 === 0;
  
  var posTrapezePoints = Trapeze.getStaticBrushPoints(this.params, fitPosCenter);
  
  if (posTrapezeUpV === posTrapezeUpH) {
    posTrapezePoints = this.verticalMirrorPoints(fitPosCenter, posTrapezePoints);
  }
  
  return posTrapezePoints;
};

