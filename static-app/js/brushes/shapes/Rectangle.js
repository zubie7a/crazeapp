// Rectangle brush
function Rectangle(params, points, pointer) {
  Brush.call(this, params, points, pointer);
}

Rectangle.prototype = Object.create(Brush.prototype);
Rectangle.prototype.constructor = Rectangle;

Rectangle.buildBrush = function(params, pointer) {
  var points = Rectangle.getStaticBrushPoints(params, pointer);
  return new Rectangle(params, points, pointer);
};

Rectangle.prototype.getBrushPoints = function(pointer) {
  return Rectangle.getStaticBrushPoints(this.params, pointer);
};

Rectangle.getStaticBrushPoints = function(params, pointer) {
  var brushSize = params.brushSize;
  var i = brushSize / 2;
  var j = brushSize / 4;
  var d1 = pointer.getX();
  var d2 = pointer.getY();
  
  return [
    new Point(d1 - j, d2 - i),
    new Point(d1 + j, d2 - i),
    new Point(d1 + j, d2 + i),
    new Point(d1 - j, d2 + i)
  ];
};

