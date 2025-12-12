// GreatCross brush - combination of vertical and horizontal lines
function GreatCross(params, points, pointer) {
  Brush.call(this, params, points, pointer);
}

GreatCross.prototype = Object.create(Brush.prototype);
GreatCross.prototype.constructor = GreatCross;

GreatCross.buildBrush = function(params, pointer) {
  // Great cross uses both vertical and horizontal points
  var vPoints = VerticalLines.getStaticBrushPoints(params, pointer);
  var hPoints = HorizontalLines.getStaticBrushPoints(params, pointer);
  var points = vPoints.concat(hPoints);
  return new GreatCross(params, points, pointer);
};

GreatCross.prototype.getBrushPoints = function(pointer) {
  var vPoints = VerticalLines.getStaticBrushPoints(this.params, pointer);
  var hPoints = HorizontalLines.getStaticBrushPoints(this.params, pointer);
  return vPoints.concat(hPoints);
};

GreatCross.getStaticBrushPoints = function(params, pointer) {
  var vPoints = VerticalLines.getStaticBrushPoints(params, pointer);
  var hPoints = HorizontalLines.getStaticBrushPoints(params, pointer);
  return vPoints.concat(hPoints);
};

