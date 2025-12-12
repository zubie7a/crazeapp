// Window brush - uses arcs (simplified for now)
function Window(params, points, pointer) {
  Brush.call(this, params, points, pointer);
}

Window.prototype = Object.create(Brush.prototype);
Window.prototype.constructor = Window;

Window.buildBrush = function(params, pointer) {
  var points = Window.getStaticBrushPoints(params, pointer);
  return new Window(params, points, pointer);
};

Window.prototype.getBrushPoints = function(pointer) {
  return Window.getStaticBrushPoints(this.params, pointer);
};

Window.getStaticBrushPoints = function(params, pointer) {
  var brushSize = params.brushSize;
  var i = brushSize / 2;
  var d1 = pointer.getX();
  var d2 = pointer.getY();
  
  return [
    new Point(d1, d2 - i),
    new Point(d1 + i, d2),
    new Point(d1, d2 + i),
    new Point(d1 - i, d2)
  ];
};

