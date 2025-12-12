// Maths utility functions - ported from iOS Maths.swift
// Static utility class for mathematical operations on points

var Maths = {
  
  // Calculate distance between two points (takes array of 2 points)
  distance: function(points) {
    if (points.length !== 2) {
      return 0.0;
    }
    
    var pointer1 = points[0];
    var pointer2 = points[1];
    var dX = pointer1.getX() - pointer2.getX();
    var dY = pointer1.getY() - pointer2.getY();
    var dist = Math.sqrt(dX * dX + dY * dY);
    return dist;
  },
  
  // Calculate distance between two individual points
  distanceBetweenPoints: function(p1, p2) {
    var dX = p1.getX() - p2.getX();
    var dY = p1.getY() - p2.getY();
    return Math.sqrt(dX * dX + dY * dY);
  },
  
  // Get centroid (average point) of a set of points
  getCentroid: function(points) {
    if (points.length === 0) {
      return new Point(0, 0);
    }
    
    var sumX = 0;
    var sumY = 0;
    for (var i = 0; i < points.length; i++) {
      sumX += points[i].getX();
      sumY += points[i].getY();
    }
    
    var len = points.length;
    return new Point(sumX / len, sumY / len);
  },
  
  // Align a point to a grid
  alignGridPoint: function(center, point, w, h) {
    var cX = center.getX();
    var cY = center.getY();
    var pX = point.getX();
    var pY = point.getY();
    var dX = (pX - cX) + (w / 2.0);
    var dY = (pY - cY) + (h / 2.0);
    var roundX = Math.floor(dX / w) * w;
    var roundY = Math.floor(dY / h) * h;
    var nX = roundX + cX;
    var nY = roundY + cY;
    return new Point(nX, nY);
  },
  
  // Move a point by a vector
  movePoint: function(pointOrig, vectorDest) {
    var nX = pointOrig.getX() + vectorDest.getX();
    var nY = pointOrig.getY() + vectorDest.getY();
    return new Point(nX, nY);
  },
  
  // Subtract a point from another (point difference)
  substractPoint: function(pointOrig, vectorDest) {
    var nX = pointOrig.getX() - vectorDest.getX();
    var nY = pointOrig.getY() - vectorDest.getY();
    return new Point(nX, nY);
  },
  
  // Scale a point around a center with a single factor
  scalePoint: function(center, point, factor) {
    return Maths.scalePointXY(center, point, factor, factor);
  },
  
  // Scale a point around a center with separate X and Y factors
  scalePointXY: function(center, point, factorX, factorY) {
    var cX = center.getX();
    var cY = center.getY();
    var pX = point.getX();
    var pY = point.getY();
    var nX = ((pX - cX) * factorX) + cX;
    var nY = ((pY - cY) * factorY) + cY;
    return new Point(nX, nY);
  },
  
  // Rotate a point around a center
  rotatePoint: function(center, point, angle) {
    var cX = center.getX();
    var cY = center.getY();
    var pX = point.getX() - cX;
    var pY = point.getY() - cY;
    var sinAngle = Math.sin(angle);
    var cosAngle = Math.cos(angle);
    var nX = (cosAngle * pX - sinAngle * pY) + cX;
    var nY = (sinAngle * pX + cosAngle * pY) + cY;
    return new Point(nX, nY);
  },
  
  // Mirror a point vertically around a center
  verticalMirrorPoint: function(center, point) {
    var cY = center.getY();
    var nX = point.getX();
    var nY = (2 * cY) - point.getY();
    return new Point(nX, nY);
  },
  
  // Mirror a point horizontally around a center
  horizontalMirrorPoint: function(center, point) {
    var cX = center.getX();
    var nX = (2 * cX) - point.getX();
    var nY = point.getY();
    return new Point(nX, nY);
  },
  
  // Align points to a grid
  alignGridPoints: function(center, points, w, h) {
    var alignedPoints = [];
    for (var i = 0; i < points.length; i++) {
      alignedPoints.push(Maths.alignGridPoint(center, points[i], w, h));
    }
    return alignedPoints;
  },
  
  // Move points by a vector
  movePoints: function(points, vectorDest) {
    var movedPoints = [];
    for (var i = 0; i < points.length; i++) {
      movedPoints.push(Maths.movePoint(points[i], vectorDest));
    }
    return movedPoints;
  },
  
  // Scale points around a center with a single factor
  scalePoints: function(center, points, factor) {
    var scaledPoints = [];
    for (var i = 0; i < points.length; i++) {
      scaledPoints.push(Maths.scalePoint(center, points[i], factor));
    }
    return scaledPoints;
  },
  
  // Scale points around a center with separate X and Y factors
  scalePointsXY: function(center, points, factorX, factorY) {
    var scaledPoints = [];
    for (var i = 0; i < points.length; i++) {
      scaledPoints.push(Maths.scalePointXY(center, points[i], factorX, factorY));
    }
    return scaledPoints;
  },
  
  // Rotate points around a center
  rotatePoints: function(center, points, angle) {
    var rotatedPoints = [];
    for (var i = 0; i < points.length; i++) {
      rotatedPoints.push(Maths.rotatePoint(center, points[i], angle));
    }
    return rotatedPoints;
  },
  
  // Mirror points vertically around a center
  verticalMirrorPoints: function(center, points) {
    var verticalMirroredPoints = [];
    for (var i = 0; i < points.length; i++) {
      verticalMirroredPoints.push(Maths.verticalMirrorPoint(center, points[i]));
    }
    return verticalMirroredPoints;
  },
  
  // Mirror points horizontally around a center
  horizontalMirrorPoints: function(center, points) {
    var horizontalMirroredPoints = [];
    for (var i = 0; i < points.length; i++) {
      horizontalMirroredPoints.push(Maths.horizontalMirrorPoint(center, points[i]));
    }
    return horizontalMirroredPoints;
  },
  
  // Convert degrees to radians
  degreesToRadians: function(degrees) {
    return degrees * Math.PI / 180.0;
  },
  
  // Get point difference (p1 - p2)
  pointDifference: function(p1, p2) {
    var dX = p1.getX() - p2.getX();
    var dY = p1.getY() - p2.getY();
    return new Point(dX, dY);
  },
  
  // Get points difference (points - point)
  pointsDifference: function(points, point) {
    var diffPoints = [];
    for (var i = 0; i < points.length; i++) {
      diffPoints.push(Maths.pointDifference(points[i], point));
    }
    return diffPoints;
  },
  
  // Check if a point is inside a triangle
  insideTriangle: function(point, points) {
    if (points.length < 3) return false;
    
    var pX = point.getX();
    var pY = point.getY();
    var pAX = points[0].getX();
    var pAY = points[0].getY();
    var pBX = points[1].getX();
    var pBY = points[1].getY();
    var pCX = points[2].getX();
    var pCY = points[2].getY();
    
    var cp1 = (pBX - pAX) * (pY - pAY) - (pBY - pAY) * (pX - pAX);
    var cp2 = (pCX - pBX) * (pY - pBY) - (pCY - pBY) * (pX - pBX);
    var cp3 = (pAX - pCX) * (pY - pCY) - (pAY - pCY) * (pX - pCX);
    
    return (cp1 * cp2 >= 0) && (cp2 * cp3 >= 0) && (cp3 * cp1 >= 0);
  },
  
  // Check if a point is inside a square
  insideSquare: function(point, points) {
    if (points.length < 2) return false;
    
    var pX = point.getX();
    var pY = point.getY();
    var pAX = points[0].getX();
    var pAY = points[0].getY();
    var pBX = points[1].getX();
    var pBY = points[1].getY();
    
    return (pAX <= pX && pX <= pBX) && (pAY <= pY && pY <= pBY);
  },
  
  // Create sub centers (for multi-center drawing)
  createSubCenters: function(center, amount, size) {
    var subCenters = [center];
    
    var screenHeight = size.height;
    var subCenter = new Point(
      center.getX(),
      center.getY() - screenHeight / 4
    );
    
    var angle = (2 * Math.PI) / amount;
    
    for (var i = 0; i < amount; i++) {
      var rotatedSubCenter = Maths.rotatePoint(
        center, subCenter, angle * i
      );
      subCenters.push(rotatedSubCenter);
    }
    
    return subCenters;
  },
  
  // Normalize a vector
  normalizeVector: function(vector) {
    var componentsRoot = Math.sqrt(
      Math.pow(vector.getX(), 2.0) + Math.pow(vector.getY(), 2.0)
    );
    
    if (componentsRoot === 0) {
      return new Point(0, 0);
    }
    
    return new Point(
      vector.getX() / componentsRoot,
      vector.getY() / componentsRoot
    );
  }
  
};

