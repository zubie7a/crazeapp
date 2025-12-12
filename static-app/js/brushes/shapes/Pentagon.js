// Pentagon brush
function Pentagon(params, points, pointer) {
  Brush.call(this, params, points, pointer);
}

Pentagon.prototype = Object.create(Brush.prototype);
Pentagon.prototype.constructor = Pentagon;

Pentagon.buildBrush = function(params, pointer) {
  var points = Pentagon.getStaticBrushPoints(params, pointer);
  return new Pentagon(params, points, pointer);
};

Pentagon.prototype.getBrushPoints = function(pointer) {
  return Pentagon.getStaticBrushPoints(this.params, pointer);
};

Pentagon.getStaticBrushPoints = function(params, pointer) {
  var brushSize = params.brushSize;
  var i = brushSize / 2;
  var d1 = pointer.getX();
  var d2 = pointer.getY();
  
  // Top of the pentagon will be at the middle-top
  var top = new Point(d1, d2 - i);
  var base = [top];
  
  var angle72 = (72.0 * Math.PI) / 180.0;
  var result = [];
  var tempBrush = new Brush(params, [], pointer);
  for (var j = 0; j < 5; j++) {
    var subPoints = tempBrush.rotatePoints(pointer, base, j * angle72);
    result = result.concat(subPoints);
  }
  
  return result;
};

