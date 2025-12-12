// Base Brush class - all brushes extend this
function Brush(params, points, pointer) {
  // The points that describe the brush at the current position
  this.posPoints = points || [];
  // The points that describe the brush at the previous position
  this.prePoints = [];
  // The parameters at the time this brush was created
  this.params = params;
  // Store center coordinates in params for alignment
  if (!this.params.centerX && params.centerX !== undefined) {
    this.params.centerX = params.centerX;
  }
  if (!this.params.centerY && params.centerY !== undefined) {
    this.params.centerY = params.centerY;
  }
  // The steps that the current stroke has taken
  this.steps = 0;
  // Center points
  this.preCenter = pointer ? pointer.copy() : null;
  this.posCenter = pointer ? pointer.copy() : null;
}

// Move the brush to a new location
Brush.prototype.move = function(pointer) {
  // Copy current position's points to previous position
  this.prePoints = this.copyPoints(this.posPoints);
  // Create points again at the new current position
  this.posPoints = this.getBrushPoints(pointer);
  
  if (this.posCenter) {
    this.preCenter = this.posCenter.copy();
    this.posCenter = pointer.copy();
  }
};

// This method should be overridden in all children classes
Brush.prototype.getBrushPoints = function(pointer) {
  throw new Error('getBrushPoints must be overridden');
};

// Copy points so you can mutate them freely
Brush.prototype.copyPoints = function(points) {
  return points.map(function(p) { return p.copy(); });
};

// Get current position points
Brush.prototype.getPosPoints = function() {
  return this.posPoints;
};

// Get previous position points
Brush.prototype.getPrePoints = function() {
  return this.prePoints;
};

// Get parameters
Brush.prototype.getParams = function() {
  return this.params;
};

// Move steps counter
Brush.prototype.moveSteps = function() {
  this.steps += 1;
  this.steps %= 360;
};

// Transform the brush (align, variable size, spinning)
Brush.prototype.transform = function() {
  this.moveSteps();
  this.transformAlign();
  this.transformVariable();
  this.transformSpinning();
};

// Align brush to grid
Brush.prototype.transformAlign = function() {
  if (!this.params.fitToGrid) {
    return;
  }
  
  // Align points using alignPoints method (can be overridden by brushes)
  this.posPoints = this.alignPoints(this.posPoints, this.posCenter);
  
  // If no previous points, copy current points
  if (this.prePoints.length === 0) {
    this.prePoints = this.copyPoints(this.posPoints);
  }
};

// Align points to grid (generic implementation, can be overridden)
Brush.prototype.alignPoints = function(points, genCenter) {
  if (!genCenter || points.length === 0) {
    return points;
  }
  
  var centroid = this.getCentroid(points);
  var center = new Point(this.params.centerX || 0, this.params.centerY || 0);
  
  var i = 0;
  
  // Variable size altering grid if brush size ends in 0 or 5
  if (this.params.variableSize) {
    if (this.params.brushSize % 5 === 0) {
      i = this.steps;
    }
  }
  
  // Determine grid size (usually brush size unless variable size is enabled)
  var factor = Math.sin((i * Math.PI) / 180.0);
  var gridSize = this.params.brushSize * (1.0 + (0.5 * factor));
  
  var aligned = this.alignGridPoint(center, centroid, gridSize, gridSize);
  
  // Calculate shift vector
  var cX = centroid.getX();
  var cY = centroid.getY();
  var aX = aligned.getX();
  var aY = aligned.getY();
  var vector = new Point(aX - cX, aY - cY);
  
  // Move points by vector
  return this.movePoints(points, vector);
};

// Get centroid (average point) of a set of points (delegates to Maths)
Brush.prototype.getCentroid = function(points) {
  return Maths.getCentroid(points);
};

// Scale points around a center point (delegates to Maths)
Brush.prototype.scalePoints = function(center, points, factor) {
  return Maths.scalePoints(center, points, factor);
};

// Transform variable size (oscillates between 0.5 and 1.5 times size)
Brush.prototype.transformVariable = function() {
  if (!this.params.variableSize) {
    return;
  }
  
  // Use sin to oscillate between 0.5 and 1.5 times the shape's size
  var angleRad = (this.steps * Math.PI) / 180.0;
  var factor = 1 + (0.5 * Math.sin(angleRad));
  
  var centroid = this.getCentroid(this.posPoints);
  this.posPoints = this.scalePoints(centroid, this.posPoints, factor);
};

// Transform spinning (rotates points around their centroid)
Brush.prototype.transformSpinning = function() {
  if (!this.params.rotatingShape) {
    return;
  }
  
  // Rotate points around their centroid by the steps angle
  var angleRad = (this.steps * Math.PI) / 180.0;
  var centroid = this.getCentroid(this.posPoints);
  this.posPoints = this.rotatePoints(centroid, this.posPoints, angleRad);
};

// Align a point to a grid (delegates to Maths)
Brush.prototype.alignGridPoint = function(center, point, w, h) {
  return Maths.alignGridPoint(center, point, w, h);
};

// Move points by a vector (delegates to Maths)
Brush.prototype.movePoints = function(points, vector) {
  return Maths.movePoints(points, vector);
};

// Mirror points vertically around a center (delegates to Maths)
Brush.prototype.verticalMirrorPoints = function(center, points) {
  return Maths.verticalMirrorPoints(center, points);
};

// Mirror points horizontally around a center (delegates to Maths)
Brush.prototype.horizontalMirrorPoints = function(center, points) {
  return Maths.horizontalMirrorPoints(center, points);
};

// Check if a point is inside a triangle (delegates to Maths)
Brush.prototype.insideTriangle = function(point, triangle) {
  return Maths.insideTriangle(point, triangle);
};

// Finish stroke (override in children if needed)
Brush.prototype.finishStroke = function(ctx) {
  // Override in children
};

// Draw the brush - main entry point (like iOS)
Brush.prototype.draw = function(ctx, engine) {
  // Get color
  var color = engine.getColor();
  
  // Apply transformations
  this.transform();
  
  // Do connections if required (this will also rotate/mirror connections)
  this.connectPosPre(ctx, color, engine);
  
  // Draw (and Fill) the brush with rotation
  this.rotateBrush(ctx, color, engine);
};

// Rotate and draw the brush points
Brush.prototype.rotateBrush = function(ctx, color, engine) {
  var params = this.params;
  var points = this.posPoints;
  var rotations = params.rotationAmount;
  var center = new Point(engine.centerX, engine.centerY);
  var angle = 2 * Math.PI / rotations;
  
  // Get screen size for subCenters (like iOS)
  var screenSize = {
    width: engine.canvas.width,
    height: engine.canvas.height
  };
  
  // Create subCenters (for now with amount=0 to match iOS, but structure supports multiple centers)
  var subCenters = Maths.createSubCenters(center, 0, screenSize);
  
  for (var i = 0; i < rotations; i++) {
    var rotAngle = angle * i;
    
    // Rotate the points around the current center
    var rotatedPoints = this.rotatePoints(center, points, rotAngle);
    // Mirror the points horizontally in case they're needed
    var mirroredPoints = this.mirrorPoints(center, rotatedPoints);
    
    // Now draw the points translated to each of the "sub centers"
    for (var j = 0; j < subCenters.length; j++) {
      var subCenter = subCenters[j];
      var diff = Maths.pointDifference(subCenter, center);
      var subRotatedPoints = Maths.movePoints(rotatedPoints, diff);
      var subMirroredPoints = Maths.movePoints(mirroredPoints, diff);
      
      // Draw rotated path at this subCenter
      this.drawPath(subRotatedPoints, rotAngle, false, ctx, color, engine);
      
      // Mirror for symmetry if enabled
      if (params.symmetry) {
        this.drawPath(subMirroredPoints, rotAngle, true, ctx, color, engine);
      }
    }
  }
};

// Rotate points around a center (delegates to Maths)
Brush.prototype.rotatePoints = function(center, points, angle) {
  return Maths.rotatePoints(center, points, angle);
};

// Mirror points horizontally around center (delegates to Maths)
Brush.prototype.mirrorPoints = function(center, points) {
  return Maths.horizontalMirrorPoints(center, points);
};

// Get path from points (can be overridden by children)
Brush.prototype.getPath = function(points, rotAngle, symmetry) {
  return Brush.getPathStatic(points, rotAngle, symmetry);
};

// Static method to create path from points
Brush.getPathStatic = function(points, rotAngle, symmetry) {
  // For now, return points array - will be converted to drawing commands
  return points;
};

// Draw path from points
Brush.prototype.drawPath = function(points, rotAngle, symmetry, ctx, color, engine) {
  var path = this.getPath(points, rotAngle, symmetry);
  if (!path) return;
  
  // Handle special path types (circle, chain)
  if (path.type === 'circle') {
    var p1 = path.points[0];
    var p2 = path.points[1];
    var centerX = (p1.getX() + p2.getX()) / 2;
    var centerY = (p1.getY() + p2.getY()) / 2;
    var radius = this.params.brushSize / 2;
    engine.drawCircle(centerX, centerY, radius, this.params.fillShape);
    return;
  }
  
  if (path.type === 'chain') {
    var p1 = path.points[0];
    var p2 = path.points[1];
    var centerX = (p1.getX() + p2.getX()) / 2;
    var centerY = (p1.getY() + p2.getY()) / 2;
    var dx = p1.getX() - p2.getX();
    var dy = p1.getY() - p2.getY();
    var radius = Math.sqrt(dx * dx + dy * dy) / 2;
    engine.drawCircle(centerX, centerY, radius, this.params.fillShape);
    return;
  }
  
  // Handle arc-based paths (Heart, Flower, Wave, Moon, Window)
  if (path.type === 'arcs') {
    this.drawArcPath(path, rotAngle, symmetry, ctx, color, engine);
    return;
  }
  
  // Regular path - array of points
  if (!Array.isArray(path) || path.length === 0) return;
  
  // For shapes (3+ points), draw as closed path
  if (path.length >= 3) {
    engine.drawShape(path, this.params.fillShape);
  } else {
    // Draw lines between consecutive points
    if (path.length >= 2) {
      for (var i = 0; i < path.length - 1; i++) {
        var p1 = path[i];
        var p2 = path[i + 1];
        engine.drawLine(p1.getX(), p1.getY(), p2.getX(), p2.getY(), false);
      }
    }
  }
};

// Draw arc-based path (for Heart, Flower, Wave, Moon, Window)
Brush.prototype.drawArcPath = function(pathData, rotAngle, symmetry, ctx, color, engine) {
  ctx.beginPath();
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  
  var arcs = pathData.arcs;
  if (!arcs || arcs.length === 0) return;
  
  // Track current position as we draw
  var currentX, currentY;
  
  // Start at first arc's start point
  var firstArc = arcs[0];
  currentX = firstArc.center.getX() + firstArc.radius * Math.cos(firstArc.startAngle);
  currentY = firstArc.center.getY() + firstArc.radius * Math.sin(firstArc.startAngle);
  ctx.moveTo(currentX, currentY);
  
  // Draw each arc (or line)
  // Note: Canvas arc() uses anticlockwise (true = counter-clockwise), iOS uses clockwise (true = clockwise)
  // So we need to invert the boolean
  // Canvas arc() automatically adds a line from current point to arc start, then draws the arc
  for (var i = 0; i < arcs.length; i++) {
    var arc = arcs[i];
    
    // Handle line segments (for Wave brush)
    if (arc.type === 'line') {
      ctx.lineTo(arc.point.getX(), arc.point.getY());
      currentX = arc.point.getX();
      currentY = arc.point.getY();
      continue;
    }
    
    // Calculate where this arc should start
    var arcStartX = arc.center.getX() + arc.radius * Math.cos(arc.startAngle);
    var arcStartY = arc.center.getY() + arc.radius * Math.sin(arc.startAngle);
    
    // If we're not already at the start of this arc, move there
    // (This handles cases where arcs don't connect end-to-end, like in Heart)
    // But only if close is true - for open paths like Flower, don't auto-connect
    var dist = Math.sqrt(Math.pow(arcStartX - currentX, 2) + Math.pow(arcStartY - currentY, 2));
    if (dist > 0.1) {  // If more than 0.1 pixels away
      if (pathData.close) {
        // For closed paths, connect with a line
        ctx.lineTo(arcStartX, arcStartY);
      } else {
        // For open paths, move to the start (creates a break in the path)
        ctx.moveTo(arcStartX, arcStartY);
      }
      currentX = arcStartX;
      currentY = arcStartY;
    }
    
    // Draw the arc
    ctx.arc(
      arc.center.getX(),
      arc.center.getY(),
      arc.radius,
      arc.startAngle,
      arc.endAngle,
      !arc.clockwise  // Invert: Canvas uses anticlockwise, iOS uses clockwise
    );
    
    // Update current position to end of arc
    currentX = arc.center.getX() + arc.radius * Math.cos(arc.endAngle);
    currentY = arc.center.getY() + arc.radius * Math.sin(arc.endAngle);
  }
  
  // Close path if needed (only for closed shapes like Heart, Wave)
  if (pathData.close) {
    ctx.closePath();
  }
  
  // Fill or stroke
  if (this.params.fillShape) {
    ctx.fill();
  } else {
    ctx.stroke();
  }
};

// Helper to calculate distance between two points (delegates to Maths)
Brush.prototype.distance = function(p1, p2) {
  return Maths.distanceBetweenPoints(p1, p2);
};

// Helper to calculate distance from array of points (delegates to Maths)
Brush.prototype.distanceFromPoints = function(points) {
  return Maths.distance(points);
};

// Helper to scale a point relative to another (delegates to Maths)
Brush.prototype.scalePoint = function(center, point, factor) {
  return Maths.scalePoint(center, point, factor);
};

// Helper to rotate a single point around a center (delegates to Maths)
Brush.prototype.rotatePoint = function(center, point, angle) {
  return Maths.rotatePoint(center, point, angle);
};

// Helper to get point difference (delegates to Maths)
Brush.prototype.pointDifference = function(p1, p2) {
  return Maths.pointDifference(p1, p2);
};

// Connect previous and current points (like iOS - uses rotateBrush for connections)
Brush.prototype.connectPosPre = function(ctx, color, engine) {
  if (!this.params.connectBorders) {
    return;
  }
  
  var prePoints = this.prePoints;
  var posPoints = this.posPoints;
  
  if (prePoints.length === 0 || posPoints.length === 0) {
    return;
  }
  
  // Connect corresponding points - each connection goes through rotateBrush
  // so it gets rotated and mirrored like the main brush (like iOS)
  var minLen = Math.min(prePoints.length, posPoints.length);
  for (var i = 0; i < minLen; i++) {
    var preP = prePoints[i];
    var posP = posPoints[i];
    // Create a 2-point path for the connection line
    var connectionPoints = [preP, posP];
    // Draw this connection with rotation/mirroring (like iOS Drawing.rotateBrush)
    this.rotateBrushForPoints(connectionPoints, ctx, color, engine);
  }
};

// Helper to rotate/mirror and draw a set of points (used for connections and filling)
// This matches iOS Drawing.rotateBrush functionality
Brush.prototype.rotateBrushForPoints = function(points, ctx, color, engine) {
  var params = this.params;
  var rotations = params.rotationAmount;
  var center = new Point(engine.centerX, engine.centerY);
  var angle = 2 * Math.PI / rotations;
  
  // Get screen size for subCenters (like iOS)
  var screenSize = {
    width: engine.canvas.width,
    height: engine.canvas.height
  };
  
  // Create subCenters (for now with amount=0 to match iOS, but structure supports multiple centers)
  var subCenters = Maths.createSubCenters(center, 0, screenSize);
  
  for (var i = 0; i < rotations; i++) {
    var rotAngle = angle * i;
    
    // Rotate the points around the current center
    var rotatedPoints = this.rotatePoints(center, points, rotAngle);
    // Mirror the points horizontally in case they're needed
    var mirroredPoints = this.mirrorPoints(center, rotatedPoints);
    
    // Now draw the points translated to each of the "sub centers"
    for (var j = 0; j < subCenters.length; j++) {
      var subCenter = subCenters[j];
      var diff = Maths.pointDifference(subCenter, center);
      var subRotatedPoints = Maths.movePoints(rotatedPoints, diff);
      var subMirroredPoints = Maths.movePoints(mirroredPoints, diff);
      
      // Use drawPath to handle both lines and filled shapes (like iOS)
      // For 2 points, draw as line; for 3+ points, draw as filled shape if fillShape is enabled
      this.drawPath(subRotatedPoints, rotAngle, false, ctx, color, engine);
      
      // Mirror for symmetry if enabled
      if (params.symmetry) {
        this.drawPath(subMirroredPoints, rotAngle, true, ctx, color, engine);
      }
    }
  }
};

