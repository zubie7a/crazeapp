// ZZZZZZZ brush
function ZZZZZZZ(params, points, pointer) {
  Brush.call(this, params, points, pointer);
}

ZZZZZZZ.prototype = Object.create(Brush.prototype);
ZZZZZZZ.prototype.constructor = ZZZZZZZ;

ZZZZZZZ.buildBrush = function(params, pointer) {
  var points = ZZZZZZZ.getStaticBrushPoints(params, pointer);
  return new ZZZZZZZ(params, points, pointer);
};

ZZZZZZZ.prototype.getBrushPoints = function(pointer) {
  return ZZZZZZZ.getStaticBrushPoints(this.params, pointer);
};

ZZZZZZZ.getStaticBrushPoints = function(params, pointer) {
  var brushSize = params.brushSize;
  var i = brushSize / 2;
  var j = brushSize / 4;
  var k = brushSize / 16;
  var d1 = pointer.getX();
  var d2 = pointer.getY();
  
  return [
    new Point(d1 - i, d2 - i),
    new Point(d1 + i, d2 - i),
    new Point(d1 - j, d2 + i - k),
    new Point(d1 + i, d2 + i - k),
    new Point(d1 + i, d2 + i),
    new Point(d1 - i, d2 + i),
    new Point(d1 + j, d2 - i + k),
    new Point(d1 - i, d2 - i + k)
  ];
};

