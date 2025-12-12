// Lightning brush
function Lightning(params, points, pointer) {
  Brush.call(this, params, points, pointer);
}

Lightning.prototype = Object.create(Brush.prototype);
Lightning.prototype.constructor = Lightning;

Lightning.buildBrush = function(params, pointer) {
  var points = Lightning.getStaticBrushPoints(params, pointer);
  return new Lightning(params, points, pointer);
};

Lightning.prototype.getBrushPoints = function(pointer) {
  return Lightning.getStaticBrushPoints(this.params, pointer);
};

Lightning.getStaticBrushPoints = function(params, pointer) {
  var brushSize = params.brushSize;
  var i = brushSize / 2;
  var j = brushSize / 4;
  var k = brushSize / 8;
  var l = brushSize / 16;
  var d1 = pointer.getX();
  var d2 = pointer.getY();
  
  return [
    new Point(d1 + j, d2 - i),
    new Point(d1 - k, d2 - l),
    new Point(d1 + i, d2 - l),
    new Point(d1 + j - i, d2 + i),
    new Point(d1 + k, d2 + l),
    new Point(d1 - i, d2 + l)
  ];
};

