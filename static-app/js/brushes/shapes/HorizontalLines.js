// HorizontalLines brush - horizontal line
function HorizontalLines(params, points, pointer) {
  Brush.call(this, params, points, pointer);
}

HorizontalLines.prototype = Object.create(Brush.prototype);
HorizontalLines.prototype.constructor = HorizontalLines;

HorizontalLines.buildBrush = function(params, pointer) {
  var points = HorizontalLines.getStaticBrushPoints(params, pointer);
  return new HorizontalLines(params, points, pointer);
};

HorizontalLines.prototype.getBrushPoints = function(pointer) {
  return HorizontalLines.getStaticBrushPoints(this.params, pointer);
};

HorizontalLines.getStaticBrushPoints = function(params, pointer) {
    var brushSize = params.brushSize;
    var i = brushSize / 2;
    var d1 = pointer.getX();
    var d2 = pointer.getY();
    
    return [
      new Point(d1 + i, d2),
      new Point(d1 - i, d2)
    ];
};

