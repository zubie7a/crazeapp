// Present brush
function Present(params, points, pointer) {
  Brush.call(this, params, points, pointer);
}

Present.prototype = Object.create(Brush.prototype);
Present.prototype.constructor = Present;

Present.buildBrush = function(params, pointer) {
  var points = Present.getStaticBrushPoints(params, pointer);
  return new Present(params, points, pointer);
};

Present.prototype.getBrushPoints = function(pointer) {
  return Present.getStaticBrushPoints(this.params, pointer);
};

Present.getStaticBrushPoints = function(params, pointer) {
  var brushSize = params.brushSize;
  var d1 = pointer.getX();
  var d2 = pointer.getY();
  var i = brushSize / 2;
  var k = brushSize * 4 / 5;
  
  var p1 = new Point(d1 - k/2, d2 - i);
  var p2 = new Point(d1 + k/2, d2 - i);
  var p3 = new Point(d1 + i, d2 - k/2);
  var p4 = new Point(d1 + i, d2 + k/2);
  var p5 = new Point(d1 + k/2, d2 + i);
  var p6 = new Point(d1 - k/2, d2 + i);
  var p7 = new Point(d1 - i, d2 + k/2);
  var p8 = new Point(d1 - i, d2 - k/2);
  
  return [p1, p4, p7, p2, p5, p8, p3, p6];
};

