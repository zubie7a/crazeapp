// XXXXXXX brush
function XXXXXXX(params, points, pointer) {
  Brush.call(this, params, points, pointer);
}

XXXXXXX.prototype = Object.create(Brush.prototype);
XXXXXXX.prototype.constructor = XXXXXXX;

XXXXXXX.buildBrush = function(params, pointer) {
  var points = XXXXXXX.getStaticBrushPoints(params, pointer);
  return new XXXXXXX(params, points, pointer);
};

XXXXXXX.prototype.getBrushPoints = function(pointer) {
  return XXXXXXX.getStaticBrushPoints(this.params, pointer);
};

XXXXXXX.getStaticBrushPoints = function(params, pointer) {
  var brushSize = params.brushSize;
  var i = brushSize / 2;
  var j = brushSize / 4;
  var k = brushSize / 8;
  var d1 = pointer.getX();
  var d2 = pointer.getY();
  
  return [
    new Point(d1 - i, d2 - i),
    new Point(d1 - j, d2 - i),
    new Point(d1, d2 - k),
    new Point(d1 + j, d2 - i),
    new Point(d1 + i, d2 - i),
    new Point(d1 + k, d2),
    new Point(d1 + i, d2 + i),
    new Point(d1 + j, d2 + i),
    new Point(d1, d2 + k),
    new Point(d1 - j, d2 + i),
    new Point(d1 - i, d2 + i),
    new Point(d1 - k, d2)
  ];
};

