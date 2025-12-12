// Snowflake brush
function Snowflake(params, points, pointer) {
  Brush.call(this, params, points, pointer);
}

Snowflake.prototype = Object.create(Brush.prototype);
Snowflake.prototype.constructor = Snowflake;

Snowflake.buildBrush = function(params, pointer) {
  var points = Snowflake.getStaticBrushPoints(params, pointer);
  return new Snowflake(params, points, pointer);
};

Snowflake.prototype.getBrushPoints = function(pointer) {
  return Snowflake.getStaticBrushPoints(this.params, pointer);
};

Snowflake.getStaticBrushPoints = function(params, pointer) {
  var brushSize = params.brushSize;
  var d1 = pointer.getX();
  var d2 = pointer.getY();
  var i = brushSize / 2;
  var j = brushSize / 8;
  
  var top = new Point(d1, d2 - i);
  var tempBrush = new Brush(params, [], pointer);
  var middle = tempBrush.getCentroid([pointer, top]);
  var left = new Point(middle.getX() - j, middle.getY());
  var right = new Point(middle.getX() + j, middle.getY());
  var base = [pointer, left, top, right];
  
  // Rotate this 60 degrees, 6 times
  var angle = (60.0 * Math.PI) / 180.0;
  var result = [];
  for (var k = 0; k < 6; k++) {
    var subPoints = tempBrush.rotatePoints(pointer, base, k * angle);
    result = result.concat(subPoints);
  }
  
  // Add scaled version
  var baseHalf = tempBrush.scalePoints(pointer, tempBrush.scalePoints(pointer, base, 0.75), 0.6666);
  for (var k = 0; k < 6; k++) {
    var subPointsHalf = tempBrush.rotatePoints(pointer, baseHalf, k * angle);
    result = result.concat(subPointsHalf);
  }
  
  return result;
};

