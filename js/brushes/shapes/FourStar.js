// FourStar brush
function FourStar(params, points, pointer) {
  Brush.call(this, params, points, pointer);
}

FourStar.prototype = Object.create(Brush.prototype);
FourStar.prototype.constructor = FourStar;

FourStar.buildBrush = function(params, pointer) {
  var points = FourStar.getStaticBrushPoints(params, pointer);
  return new FourStar(params, points, pointer);
};

FourStar.prototype.getBrushPoints = function(pointer) {
  return FourStar.getStaticBrushPoints(this.params, pointer);
};

FourStar.getStaticBrushPoints = function(params, pointer) {
  var brushSize = params.brushSize;
  var i = brushSize / 2;
  var j = brushSize / 8;
  var d1 = pointer.getX();
  var d2 = pointer.getY();
  
  return [
    new Point(d1, d2 - i),
    new Point(d1 + j, d2 - j),
    new Point(d1 + i, d2),
    new Point(d1 + j, d2 + j),
    new Point(d1, d2 + i),
    new Point(d1 - j, d2 + j),
    new Point(d1 - i, d2),
    new Point(d1 - j, d2 - j)
  ];
};

