// LinesFromStart brush - lines from the start point
function LinesFromStart(params, points, pointer) {
  Brush.call(this, params, points, pointer);
  this.startPoint = pointer ? pointer.copy() : null;
}

LinesFromStart.prototype = Object.create(Brush.prototype);
LinesFromStart.prototype.constructor = LinesFromStart;

LinesFromStart.buildBrush = function(params, pointer) {
  var points = LinesFromStart.getStaticBrushPoints(pointer, pointer);
  return new LinesFromStart(params, points, pointer);
};

LinesFromStart.prototype.getBrushPoints = function(pointer) {
  if (!this.startPoint) {
    this.startPoint = pointer.copy();
  }
  return LinesFromStart.getStaticBrushPoints(this.startPoint, pointer);
};

LinesFromStart.getStaticBrushPoints = function(start, pointer) {
  return [start, pointer];
};

