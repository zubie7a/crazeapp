// Squares brush - square shape
function Squares(params, points, pointer) {
  Brush.call(this, params, points, pointer);
}

Squares.prototype = Object.create(Brush.prototype);
Squares.prototype.constructor = Squares;

Squares.buildBrush = function(params, pointer) {
  var points = Squares.getStaticBrushPoints(params, pointer);
  return new Squares(params, points, pointer);
};

Squares.prototype.getBrushPoints = function(pointer) {
  return Squares.getStaticBrushPoints(this.params, pointer);
};

Squares.getStaticBrushPoints = function(params, pointer) {
  var brushSize = params.brushSize;
  var i = brushSize / 2;
  var d1 = pointer.getX();
  var d2 = pointer.getY();
  
  return [
    new Point(d1 - i, d2 - i),
    new Point(d1 - i, d2 + i),
    new Point(d1 + i, d2 + i),
    new Point(d1 + i, d2 - i)
  ];
};

