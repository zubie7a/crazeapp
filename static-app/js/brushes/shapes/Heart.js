// Heart brush - uses arcs (simplified for now)
function Heart(params, points, pointer) {
  Brush.call(this, params, points, pointer);
}

Heart.prototype = Object.create(Brush.prototype);
Heart.prototype.constructor = Heart;

Heart.buildBrush = function(params, pointer) {
  var points = Heart.getStaticBrushPoints(params, pointer);
  return new Heart(params, points, pointer);
};

Heart.prototype.getBrushPoints = function(pointer) {
  return Heart.getStaticBrushPoints(this.params, pointer);
};

Heart.getStaticBrushPoints = function(params, pointer) {
  var brushSize = params.brushSize;
  var i = brushSize / 2;
  var j = brushSize / 4;
  var k = brushSize / 8;
  var d1 = pointer.getX();
  var d2 = pointer.getY();
  
  return [
    new Point(d1, d2 - j),
    new Point(d1 + i, d2 - j),
    new Point(d1, d2 + i - k),
    new Point(d1 - i, d2 - j)
  ];
};

