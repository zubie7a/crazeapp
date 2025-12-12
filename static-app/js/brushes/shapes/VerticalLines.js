// VerticalLines brush - vertical line
function VerticalLines(params, points, pointer) {
  Brush.call(this, params, points, pointer);
}

VerticalLines.prototype = Object.create(Brush.prototype);
VerticalLines.prototype.constructor = VerticalLines;

VerticalLines.buildBrush = function(params, pointer) {
  var points = VerticalLines.getStaticBrushPoints(params, pointer);
  return new VerticalLines(params, points, pointer);
};

VerticalLines.prototype.getBrushPoints = function(pointer) {
  return VerticalLines.getStaticBrushPoints(this.params, pointer);
};

VerticalLines.getStaticBrushPoints = function(params, pointer) {
  var brushSize = params.brushSize;
  var i = brushSize / 2;
  var d1 = pointer.getX();
  var d2 = pointer.getY();
  
  return [
    new Point(d1 + i, d2),
    new Point(d1 - i, d2)
  ];
};

