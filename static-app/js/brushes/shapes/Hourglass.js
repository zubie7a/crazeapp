// Hourglass brush
function Hourglass(params, points, pointer) {
  Brush.call(this, params, points, pointer);
}

Hourglass.prototype = Object.create(Brush.prototype);
Hourglass.prototype.constructor = Hourglass;

Hourglass.buildBrush = function(params, pointer) {
  var points = Hourglass.getStaticBrushPoints(params, pointer);
  return new Hourglass(params, points, pointer);
};

Hourglass.prototype.getBrushPoints = function(pointer) {
  return Hourglass.getStaticBrushPoints(this.params, pointer);
};

Hourglass.getStaticBrushPoints = function(params, pointer) {
  var brushSize = params.brushSize;
  var i = brushSize / 2;
  var k = brushSize / 8;
  var d1 = pointer.getX();
  var d2 = pointer.getY();
  
  return [
    new Point(d1 - i, d2 - i),
    new Point(d1 + i, d2 - i),
    new Point(d1, d2),
    new Point(d1 - i + 2*k, d2 - i + k),
    new Point(d1 + i - 2*k, d2 - i + k),
    new Point(d1, d2),
    new Point(d1 - i, d2 + i),
    new Point(d1 + i, d2 + i),
    new Point(d1, d2),
    new Point(d1 - i + 2*k, d2 + i - k),
    new Point(d1 + i - 2*k, d2 + i - k),
    new Point(d1, d2)
  ];
};

