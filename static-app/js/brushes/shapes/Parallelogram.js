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

