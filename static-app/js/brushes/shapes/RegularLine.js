// RegularLine brush - simple line from previous to current point
function RegularLine(params, points, pointer) {
  Brush.call(this, params, points, pointer);
}

RegularLine.prototype = Object.create(Brush.prototype);
RegularLine.prototype.constructor = RegularLine;

RegularLine.buildBrush = function(params, pointer) {
  var points = RegularLine.getStaticBrushPoints(pointer, pointer);
  return new RegularLine(params, points, pointer);
};

RegularLine.prototype.getBrushPoints = function(pointer) {
  // For regular line, we need the previous point
  if (this.posPoints.length > 0) {
    var start = this.posPoints[this.posPoints.length - 1];
    return RegularLine.getStaticBrushPoints(start, pointer);
  }
  return RegularLine.getStaticBrushPoints(pointer, pointer);
};

RegularLine.getStaticBrushPoints = function(start, pointer) {
  return [start, pointer];
};

