// Lines brush - connects to previous points (like iOS Lines)
// This is the same as RegularLine but with enhanced connection logic
function Lines(params, points, pointer) {
  Brush.call(this, params, points, pointer);
  // Keep all points for connections
  this.allPoints = points ? points.slice() : [];
}

Lines.prototype = Object.create(Brush.prototype);
Lines.prototype.constructor = Lines;

Lines.buildBrush = function(params, pointer) {
  var points = Lines.getStaticBrushPoints(pointer, pointer);
  return new Lines(params, points, pointer);
};

Lines.prototype.getBrushPoints = function(pointer) {
  // For lines, we need the previous point
  if (this.posPoints.length > 0) {
    var start = this.posPoints[this.posPoints.length - 1];
    this.allPoints.push(pointer);
    return Lines.getStaticBrushPoints(start, pointer);
  }
  this.allPoints.push(pointer);
  return Lines.getStaticBrushPoints(pointer, pointer);
};

Lines.getStaticBrushPoints = function(start, pointer) {
  return [start, pointer];
};

// Override connectPosPre to connect to multiple previous points
Lines.prototype.connectPosPre = function(ctx, color, engine) {
  if (!this.params.connectBorders) {
    return;
  }
  
  var posPoint = this.posPoints[1];
  // Create lines between current point and up to previous 5 points
  var limit = Math.min(5, this.allPoints.length);
  for (var i = 0; i < limit; i++) {
    var index = this.allPoints.length - i - 1;
    var prePoint = this.allPoints[index];
    var connectionPoints = [prePoint, posPoint];
    // Draw this connection with rotation/mirroring
    this.rotateBrushForPoints(connectionPoints, ctx, color, engine);
  }
};

// Override finishStroke for filling
Lines.prototype.finishStroke = function(ctx) {
  if (this.params.fillShape && this.allPoints.length > 0) {
    // Fill shape described by all points of the stroke
    var color = this.ctx.getColor ? this.ctx.getColor() : 'rgba(255,255,255,1)';
    // Would need to draw all points with rotation - simplified for now
  }
};

