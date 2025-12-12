// FourSides brush - same as Square
function FourSides(params, points, pointer) {
  Brush.call(this, params, points, pointer);
}

FourSides.prototype = Object.create(Brush.prototype);
FourSides.prototype.constructor = FourSides;

FourSides.buildBrush = function(params, pointer) {
  // The basic shape will be a square
  var points = Squares.getStaticBrushPoints(params, pointer);
  return new FourSides(params, points, pointer);
};

FourSides.prototype.getBrushPoints = function(pointer) {
  return Squares.getStaticBrushPoints(this.params, pointer);
};

FourSides.getStaticBrushPoints = function(params, pointer) {
  // Same as Square
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

