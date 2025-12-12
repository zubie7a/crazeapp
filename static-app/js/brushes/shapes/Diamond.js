// Diamond brush
function Diamond(params, points, pointer) {
  Brush.call(this, params, points, pointer);
}

Diamond.prototype = Object.create(Brush.prototype);
Diamond.prototype.constructor = Diamond;

Diamond.buildBrush = function(params, pointer) {
  var points = Diamond.getStaticBrushPoints(params, pointer);
  return new Diamond(params, points, pointer);
};

Diamond.prototype.getBrushPoints = function(pointer) {
  return Diamond.getStaticBrushPoints(this.params, pointer);
};

Diamond.getStaticBrushPoints = function(params, pointer) {
  var brushSize = params.brushSize;
  var i = brushSize / 2;
  var j = brushSize / 4;
  var d1 = pointer.getX();
  var d2 = pointer.getY();
  
  return [
    new Point(d1, d2 - i),
    new Point(d1 + j, d2),
    new Point(d1, d2 + i),
    new Point(d1 - j, d2)
  ];
};

