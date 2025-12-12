// Window brush - uses arcs (simplified for now)
function Window(params, points, pointer) {
  Brush.call(this, params, points, pointer);
}

Window.prototype = Object.create(Brush.prototype);
Window.prototype.constructor = Window;

Window.buildBrush = function(params, pointer) {
  var points = Window.getStaticBrushPoints(params, pointer);
  return new Window(params, points, pointer);
};

Window.prototype.getBrushPoints = function(pointer) {
  return Window.getStaticBrushPoints(this.params, pointer);
};

Window.getStaticBrushPoints = function(params, pointer) {
  var brushSize = params.brushSize;
  var i = brushSize / 2;
  var d1 = pointer.getX();
  var d2 = pointer.getY();
  
  return [
    new Point(d1, d2 - i),
    new Point(d1 + i, d2),
    new Point(d1, d2 + i),
    new Point(d1 - i, d2)
  ];
};

// Override getPath to draw window with arcs
Window.prototype.getPath = function(points, rotAngle, symmetry) {
  if (points.length < 4) return points;
  
  var mirror = symmetry ? -1.0 : 1.0;
  var pA = points[0];
  var pB = points[1];
  var pC = points[2];
  var pD = points[3];
  
  var center = this.getCentroid(points);
  var pAB = this.getCentroid([pA, pB]);
  var pBC = this.getCentroid([pB, pC]);
  var pCD = this.getCentroid([pC, pD]);
  var pDA = this.getCentroid([pD, pA]);
  
  var cAB = this.scalePoint(center, pAB, 2.0);
  var cBC = this.scalePoint(center, pBC, 2.0);
  var cCD = this.scalePoint(center, pCD, 2.0);
  var cDA = this.scalePoint(center, pDA, 2.0);
  
  var radius = this.distance(pA, pC) / 2;
  
  var radians4th = 2 * Math.PI / 4.0;
  var offset = 0.0;
  
  // Account for spinning
  if (this.params.rotatingShape) {
    offset -= (mirror * (this.steps * Math.PI / 180.0));
  }
  
  // Account for rotation angle
  offset -= (mirror * rotAngle);
  
  var fixSector = function(sector, sym) {
    if (!sym) return sector;
    if (sector === 4) return 2;
    if (sector === 2) return 4;
    return sector;
  };
  
  var sector1 = fixSector(1, symmetry);
  var sector2 = fixSector(2, symmetry);
  var sector3 = fixSector(3, symmetry);
  var sector4 = fixSector(4, symmetry);
  
  // Build arcs in reverse order (for web Canvas compatibility)
  var arcs = [];
  
  // Final outer circle first
  if (symmetry) {
    arcs.push({
      center: center,
      radius: radius,
      startAngle: Math.PI - offset,
      endAngle: (3 * Math.PI) - offset,
      clockwise: true
    });
  } else {
    arcs.push({
      center: center,
      radius: radius,
      startAngle: (2 * Math.PI) - offset,
      endAngle: 0 - offset,
      clockwise: false
    });
  }
  
  // Then inner arcs in reverse order
  arcs.push(
    {
      center: cBC,
      radius: radius,
      startAngle: (sector3 * radians4th) - offset,
      endAngle: (sector2 * radians4th) - offset,
      clockwise: symmetry
    },
    {
      center: cCD,
      radius: radius,
      startAngle: (sector4 * radians4th) - offset,
      endAngle: (sector3 * radians4th) - offset,
      clockwise: symmetry
    },
    {
      center: cDA,
      radius: radius,
      startAngle: (sector1 * radians4th) - offset,
      endAngle: (sector4 * radians4th) - offset,
      clockwise: symmetry
    },
    {
      center: cAB,
      radius: radius,
      startAngle: (sector2 * radians4th) - offset,
      endAngle: (sector1 * radians4th) - offset,
      clockwise: symmetry
    }
  );
  
  return {
    type: 'arcs',
    arcs: arcs
  };
};

