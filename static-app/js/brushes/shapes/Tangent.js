// Tangent brush - extended line
function Tangent(params, points, pointer) {
  Brush.call(this, params, points, pointer);
}

Tangent.prototype = Object.create(Brush.prototype);
Tangent.prototype.constructor = Tangent;

Tangent.buildBrush = function(params, pointer) {
  var points = RegularLine.getStaticBrushPoints(pointer, pointer);
  return new Tangent(params, points, pointer);
};

Tangent.prototype.getBrushPoints = function(pointer) {
  // Tangent extends the line from previous point
  if (this.posPoints.length > 0) {
    var start = this.posPoints[this.posPoints.length - 1];
    return Tangent.getStaticBrushPoints(this.params, start, pointer);
  }
  return Tangent.getStaticBrushPoints(this.params, pointer, pointer);
};

Tangent.getStaticBrushPoints = function(params, start, pointer) {
  // Calculate distance between points
  var dx = pointer.getX() - start.getX();
  var dy = pointer.getY() - start.getY();
  var lineDistance = Math.sqrt(dx * dx + dy * dy);
  
  // Scale factor to extend line to brush size
  var scaleFactor = Math.max(1, params.brushSize / Math.max(1, lineDistance));
  
  // Scale points from pointer
  var scaledStart = new Point(
    pointer.getX() - (dx * scaleFactor),
    pointer.getY() - (dy * scaleFactor)
  );
  
  return [scaledStart, pointer];
};

