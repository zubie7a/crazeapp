// Rectangle brush
function Rectangle(params, points, pointer) {
  Brush.call(this, params, points, pointer);
}

Rectangle.prototype = Object.create(Brush.prototype);
Rectangle.prototype.constructor = Rectangle;

Rectangle.buildBrush = function(params, pointer) {
  var points = Rectangle.getStaticBrushPoints(params, pointer);
  return new Rectangle(params, points, pointer);
};

Rectangle.prototype.getBrushPoints = function(pointer) {
  return Rectangle.getStaticBrushPoints(this.params, pointer);
};

Rectangle.getStaticBrushPoints = function(params, pointer) {
  var brushSize = params.brushSize;
  var i = brushSize / 2;
  var j = brushSize / 4;
  var d1 = pointer.getX();
  var d2 = pointer.getY();
  
  return [
    new Point(d1 - j, d2 - i),
    new Point(d1 + j, d2 - i),
    new Point(d1 + j, d2 + i),
    new Point(d1 - j, d2 + i)
  ];
};

// Override alignPoints for custom rectangle grid alignment
Rectangle.prototype.alignPoints = function(points, genCenter) {
  if (!genCenter || points.length === 0) {
    return points;
  }
  
  // The center of rotations/symmetry
  var center = new Point(this.params.centerX || 0, this.params.centerY || 0);
  // The size of the box to fit, special for the rectangle
  var brushSize = this.params.brushSize;
  var i = brushSize / 2;
  var j = brushSize / 4;
  
  var h = i * 2;
  var w = j * 2;
  
  // Fit position to center of shape
  var fitPosCenter = this.alignGridPoint(center, genCenter, w, h);
  
  var posRectanglePoints = Rectangle.getStaticBrushPoints(this.params, fitPosCenter);
  
  return posRectanglePoints;
};

