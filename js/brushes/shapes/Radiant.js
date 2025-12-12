// Radiant brush - line from start to pointer
function Radiant(params, points, pointer) {
  Brush.call(this, params, points, pointer);
}

Radiant.prototype = Object.create(Brush.prototype);
Radiant.prototype.constructor = Radiant;

Radiant.buildBrush = function(params, pointer) {
  var points = Radiant.getStaticBrushPoints(pointer, pointer);
  return new Radiant(params, points, pointer);
};

Radiant.prototype.getBrushPoints = function(pointer) {
  var start = this.posPoints[0];
  return Radiant.getStaticBrushPoints(start, pointer);
};

Radiant.getStaticBrushPoints = function(start, pointer) {
  return [start, pointer];
};

// Override draw for filling
Radiant.prototype.draw = function(ctx, engine) {
  Brush.prototype.draw.call(this, ctx, engine);
  
  if (this.params.fillShape) {
    var color = engine.getColor();
    // Combine previous and current points for filling
    var newPoints = this.prePoints.slice().reverse().concat(this.posPoints);
    // Draw filled shape with rotation
    for (var i = 0; i < this.params.rotationAmount; i++) {
      var angle = (2 * Math.PI / this.params.rotationAmount) * i;
      var center = new Point(engine.centerX, engine.centerY);
      var rotatedPoints = this.rotatePoints(center, newPoints, angle);
      engine.drawShape(rotatedPoints, true);
      
      if (this.params.symmetry) {
        var mirroredPoints = this.mirrorPoints(center, rotatedPoints);
        engine.drawShape(mirroredPoints, true);
      }
    }
  }
};

