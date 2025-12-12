// Wave brush - uses arcs (simplified for now)
function Wave(params, points, pointer) {
  Brush.call(this, params, points, pointer);
}

Wave.prototype = Object.create(Brush.prototype);
Wave.prototype.constructor = Wave;

Wave.buildBrush = function(params, pointer) {
  var points = Wave.getStaticBrushPoints(params, pointer);
  return new Wave(params, points, pointer);
};

Wave.prototype.getBrushPoints = function(pointer) {
  return Wave.getStaticBrushPoints(this.params, pointer);
};

Wave.getStaticBrushPoints = function(params, pointer) {
  var brushSize = params.brushSize;
  var i = brushSize / 2;
  var j = brushSize / 4;
  var d1 = pointer.getX();
  var d2 = pointer.getY();
  
  return [
    new Point(d1 - i, d2 - j),
    new Point(d1 + i, d2 - j),
    new Point(d1 + i, d2 + j),
    new Point(d1 - i, d2 + j)
  ];
};

