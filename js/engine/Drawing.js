// Drawing utility functions - ported from iOS Drawing.swift
// Static utility class for drawing operations with rotation and paths

var Drawing = {
  
  // Rotate brush and draw it multiple times (like iOS Drawing.rotateBrush)
  rotateBrush: function(params, points, context, color, brush) {
    var rotations = params.rotationAmount;
    var center = new Point(params.centerX || 0, params.centerY || 0);
    var angle = (2 * Math.PI) / rotations;
    
    // For now, we don't use subCenters in web version (iOS has this for multi-center drawing)
    // var screenSize = { width: context.canvas.width, height: context.canvas.height };
    // var subCenters = Maths.createSubCenters(center, 0, screenSize);
    
    for (var i = 0; i < rotations; i++) {
      var rotAngle = angle * i;
      
      // Rotate the points around the current center
      var rotatedPoints = Maths.rotatePoints(center, points, rotAngle);
      // Mirror the points horizontally in case they're needed
      var mirroredPoints = Maths.horizontalMirrorPoints(center, rotatedPoints);
      
      // Draw the rotated path
      var rotatedPath;
      var mirroredPath;
      if (brush) {
        // Use the brush's own path creating method for its points
        rotatedPath = brush.getPath(rotatedPoints, rotAngle, false);
        mirroredPath = brush.getPath(mirroredPoints, rotAngle, true);
      } else {
        // Use generic path creating method for a list of points
        rotatedPath = Brush.getPathStatic(rotatedPoints, rotAngle, false);
        mirroredPath = Brush.getPathStatic(mirroredPoints, rotAngle, true);
      }
      
      Drawing.drawPath(params, rotatedPath, context, color, brush);
      if (params.symmetry) {
        Drawing.drawPath(params, mirroredPath, context, color, brush);
      }
    }
  },
  
  // Draw a path with proper styling (like iOS Drawing.drawPath)
  drawPath: function(params, path, context, color, brush) {
    // Set base properties of the path to draw
    context.globalAlpha = 1.0;
    context.lineCap = 'butt';
    context.globalCompositeOperation = 'source-over';
    context.lineWidth = params.thickness;
    context.strokeStyle = color;
    context.fillStyle = color;
    
    // Check the Filling parameter
    if (params.fillShape) {
      // For filled paths, we need to handle different path types
      if (brush && brush.drawArcPath) {
        // Arc-based paths are handled by brush.drawArcPath
        brush.drawArcPath(path, 0, false, context, color, null);
      } else if (Array.isArray(path) && path.length >= 3) {
        // Regular shape path
        context.beginPath();
        var firstPoint = path[0];
        context.moveTo(firstPoint.getX(), firstPoint.getY());
        for (var i = 1; i < path.length; i++) {
          var p = path[i];
          context.lineTo(p.getX(), p.getY());
        }
        context.closePath();
        context.fill();
        context.stroke();
      } else {
        // Fallback: just stroke
        if (Array.isArray(path) && path.length >= 2) {
          context.beginPath();
          context.moveTo(path[0].getX(), path[0].getY());
          for (var i = 1; i < path.length; i++) {
            context.lineTo(path[i].getX(), path[i].getY());
          }
          context.stroke();
        }
      }
    } else {
      // Stroke only
      if (brush && brush.drawArcPath && path.type === 'arcs') {
        // Arc-based paths
        brush.drawArcPath(path, 0, false, context, color, null);
      } else if (Array.isArray(path) && path.length >= 2) {
        context.beginPath();
        context.moveTo(path[0].getX(), path[0].getY());
        for (var i = 1; i < path.length; i++) {
          context.lineTo(path[i].getX(), path[i].getY());
        }
        context.stroke();
      }
    }
    
    // Note: Shining parameter is not implemented in web version yet
    // iOS has: if params.getShining() { ... }
  }
  
};

