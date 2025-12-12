// Lines brush - connects to previous points (like iOS Lines)
// This is the same as RegularLine but with enhanced connection logic
function Lines(params, points, pointer) {
  Brush.call(this, params, points, pointer);
  // Keep all points for connections and filling
  this.allPoints = [];
  if (pointer) {
    this.allPoints.push(pointer.copy());
  }
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
    // Track all points for filling (avoid duplicates)
    var lastPoint = this.allPoints[this.allPoints.length - 1];
    if (!lastPoint || lastPoint.getX() !== pointer.getX() || lastPoint.getY() !== pointer.getY()) {
      this.allPoints.push(pointer.copy());
    }
    return Lines.getStaticBrushPoints(start, pointer);
  }
  // First call - pointer was already added in constructor, but make sure it's there
  if (this.allPoints.length === 0 && pointer) {
    this.allPoints.push(pointer.copy());
  }
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
  
  if (this.posPoints.length < 2) return;
  var posPoint = this.posPoints[1];
  // Create lines between current point and up to previous 5 points
  var limit = Math.min(5, this.allPoints.length);
  for (var i = 0; i < limit; i++) {
    var index = this.allPoints.length - i - 1;
    if (index < 0 || index >= this.allPoints.length) continue;
    var prePoint = this.allPoints[index];
    var connectionPoints = [prePoint, posPoint];
    // Draw this connection with rotation/mirroring
    this.rotateBrushForPoints(connectionPoints, ctx, color, engine);
  }
};

// Override finishStroke for filling
Lines.prototype.finishStroke = function(ctx, engine) {
  if (!this.params.fillShape || this.allPoints.length < 2) {
    return;
  }
  
  var color = engine.getColor();
  var settings = this.params;
  var rotations = settings.rotationAmount;
  var center = new Point(engine.centerX, engine.centerY);
  var angle = 2 * Math.PI / rotations;
  
  var fillbak = ctx.fillStyle;
  ctx.fillStyle = color;
  ctx.strokeStyle = color;
  
  // Fill for each rotation
  for (var j = 0; j < rotations; j++) {
    var rotAngle = angle * j;
    ctx.beginPath();
    
    // Rotate all points and draw path
    for (var i = 0; i < this.allPoints.length; i++) {
      var p = this.allPoints[i];
      var x = p.getX() - center.getX();
      var y = p.getY() - center.getY();
      var xNew = x * Math.cos(rotAngle) - y * Math.sin(rotAngle);
      var yNew = x * Math.sin(rotAngle) + y * Math.cos(rotAngle);
      
      if (i === 0) {
        ctx.moveTo(xNew + center.getX(), yNew + center.getY());
      } else {
        ctx.lineTo(xNew + center.getX(), yNew + center.getY());
      }
    }
    
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    
    // Mirror for symmetry if enabled
    if (settings.symmetry) {
      ctx.beginPath();
      for (var i = 0; i < this.allPoints.length; i++) {
        var p = this.allPoints[i];
        var x = p.getX() - center.getX();
        var y = p.getY() - center.getY();
        var xNew = x * Math.cos(rotAngle) - y * Math.sin(rotAngle);
        var yNew = x * Math.sin(rotAngle) + y * Math.cos(rotAngle);
        var mirroredX = 2 * center.getX() - (xNew + center.getX());
        
        if (i === 0) {
          ctx.moveTo(mirroredX, yNew + center.getY());
        } else {
          ctx.lineTo(mirroredX, yNew + center.getY());
        }
      }
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }
  }
  
  ctx.fillStyle = fillbak;
};

