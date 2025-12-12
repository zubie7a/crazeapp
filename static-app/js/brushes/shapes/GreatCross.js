// GreatCross brush - combination of vertical and horizontal lines (composite pattern like iOS)
function GreatCross(params, points, pointer) {
  Brush.call(this, params, [], pointer);
  
  // Create separate brush instances for horizontal and vertical (like iOS)
  this.h = HorizontalLines.buildBrush(params, pointer);
  this.v = VerticalLines.buildBrush(params, pointer);
}

GreatCross.prototype = Object.create(Brush.prototype);
GreatCross.prototype.constructor = GreatCross;

GreatCross.buildBrush = function(params, pointer) {
  return new GreatCross(params, [], pointer);
};

GreatCross.prototype.getBrushPoints = function(pointer) {
  // Return combined points for compatibility
  var vPoints = VerticalLines.getStaticBrushPoints(this.params, pointer);
  var hPoints = HorizontalLines.getStaticBrushPoints(this.params, pointer);
  return vPoints.concat(hPoints);
};

GreatCross.getStaticBrushPoints = function(params, pointer) {
  var vPoints = VerticalLines.getStaticBrushPoints(params, pointer);
  var hPoints = HorizontalLines.getStaticBrushPoints(params, pointer);
  return vPoints.concat(hPoints);
};

// Override move to move both brushes (like iOS)
GreatCross.prototype.move = function(pointer) {
  this.h.move(pointer);
  this.v.move(pointer);
  
  // Also update our own state for compatibility
  Brush.prototype.move.call(this, pointer);
};

// Override draw to draw both brushes separately (like iOS)
GreatCross.prototype.draw = function(ctx, engine) {
  // Move steps for both brushes
  this.moveSteps();
  
  // Draw horizontal brush
  this.h.draw(ctx, engine);
  
  // Draw vertical brush
  this.v.draw(ctx, engine);
};

