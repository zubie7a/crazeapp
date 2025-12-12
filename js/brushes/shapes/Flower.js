// Flower brush - uses arcs (simplified for now, will use regular path)
function Flower(params, points, pointer) {
  Brush.call(this, params, points, pointer);
}

Flower.prototype = Object.create(Brush.prototype);
Flower.prototype.constructor = Flower;

Flower.buildBrush = function(params, pointer) {
  var points = Flower.getStaticBrushPoints(params, pointer);
  return new Flower(params, points, pointer);
};

Flower.prototype.getBrushPoints = function(pointer) {
  return Flower.getStaticBrushPoints(this.params, pointer);
};

Flower.getStaticBrushPoints = function(params, pointer) {
  var brushSize = params.brushSize;
  var i = brushSize / 2;
  var j = brushSize / 4;
  var d1 = pointer.getX();
  var d2 = pointer.getY();
  var d3 = Math.sqrt(3.0) * j;
  
  return [
    new Point(d1, d2 - i),
    new Point(d1 + d3, d2 - j),
    new Point(d1 + d3, d2 + j),
    new Point(d1, d2 + i),
    new Point(d1 - d3, d2 + j),
    new Point(d1 - d3, d2 - j)
  ];
};

// Override getPath to draw flower with arcs
Flower.prototype.getPath = function(points, rotAngle, symmetry) {
  if (points.length < 6) return points;
  
  var p1 = points[0];
  var p2 = points[1];
  var p3 = points[2];
  var p4 = points[3];
  var p5 = points[4];
  var p6 = points[5];
  
  var radius = this.distance(p1, p4) / 2.0;
  
  var fixSector = function(sector, sym) {
    if (!sym) return sector;
    if (sector === 3) return 1;
    if (sector === 1 || sector === 7) return 3;
    if (sector === 4) return 6;
    if (sector === 6) return 4;
    return sector;
  };
  
  var addFlowerArc = function(center, radius, sectors, rotAngle, symmetry) {
    var radians6th = 2 * Math.PI / 6.0;
    var offset = 2 * Math.PI / 12.0;
    var mirror = symmetry ? -1.0 : 1.0;
    
    // Account for spinning
    if (this.params.rotatingShape) {
      offset -= (mirror * (this.steps * Math.PI / 180.0));
    }
    
    // Account for rotation angle
    offset -= (mirror * rotAngle);
    
    var sectorA = fixSector(sectors[0], symmetry);
    var sectorB = fixSector(sectors[1], symmetry);
    
    return {
      center: center,
      radius: radius,
      startAngle: (sectorB * radians6th) - offset,
      endAngle: (sectorA * radians6th) - offset,
      clockwise: symmetry
    };
  }.bind(this);
  
  // Build arcs in reverse order (for web Canvas compatibility)
  var arcs = [
    addFlowerArc(p4, radius, [4, 5], rotAngle, symmetry),
    addFlowerArc(p6, radius, [1, 2], rotAngle, symmetry),
    addFlowerArc(p3, radius, [3, 4], rotAngle, symmetry),
    addFlowerArc(p5, radius, [6, 7], rotAngle, symmetry),
    addFlowerArc(p2, radius, [2, 3], rotAngle, symmetry),
    addFlowerArc(p4, radius, [5, 6], rotAngle, symmetry),
    addFlowerArc(p1, radius, [1, 2], rotAngle, symmetry),
    addFlowerArc(p3, radius, [4, 5], rotAngle, symmetry),
    addFlowerArc(p2, radius, [3, 4], rotAngle, symmetry),
    addFlowerArc(p6, radius, [6, 7], rotAngle, symmetry),
    addFlowerArc(p5, radius, [5, 6], rotAngle, symmetry),
    addFlowerArc(p1, radius, [2, 3], rotAngle, symmetry)
  ];
  
  return {
    type: 'arcs',
    arcs: arcs
  };
};

// Override alignPoints for custom flower grid alignment (same as hexagon)
Flower.prototype.alignPoints = function(points, genCenter) {
  if (!genCenter || points.length === 0) {
    return points;
  }
  
  var center = new Point(this.params.centerX || 0, this.params.centerY || 0);
  var brushSize = this.params.brushSize;
  var i = brushSize / 2;
  var j = brushSize / 4;
  var d3 = Math.sqrt(3.0) * j;
  
  var h = i * 3;
  var w = d3 * 2;
  
  var fitCenter = this.alignGridPoint(center, genCenter, w, h);
  var hexPoints = Flower.getStaticBrushPoints(this.params, fitCenter);
  
  var posInside1 = this.insideTriangle(genCenter, [hexPoints[0], hexPoints[1], hexPoints[2]]);
  var posInside2 = this.insideTriangle(genCenter, [hexPoints[0], hexPoints[2], hexPoints[3]]);
  var posInside3 = this.insideTriangle(genCenter, [hexPoints[0], hexPoints[3], hexPoints[4]]);
  var posInside4 = this.insideTriangle(genCenter, [hexPoints[0], hexPoints[4], hexPoints[5]]);
  var posInsideHex = (posInside1 || posInside2 || posInside3 || posInside4);
  
  if (!posInsideHex) {
    var fitX = fitCenter.getX();
    var fitY = fitCenter.getY();
    var shiftVector = new Point(0, 0);
    var found = false;
    
    if (!found) {
      var p1 = new Point(fitX - d3, fitY - (j * 3));
      var p2 = new Point(fitX, fitY - (j * 3));
      var p3 = new Point(fitX, fitY - i);
      var p4 = new Point(fitX - d3, fitY - j);
      var inside1 = this.insideTriangle(genCenter, [p1, p2, p3]);
      var inside2 = this.insideTriangle(genCenter, [p1, p3, p4]);
      if (inside1 || inside2) {
        shiftVector = new Point(-d3, -(j * 3));
        found = true;
      }
    }
    
    if (!found) {
      var p1 = new Point(fitX, fitY - (j * 3));
      var p2 = new Point(fitX + d3, fitY - (j * 3));
      var p3 = new Point(fitX + d3, fitY - j);
      var p4 = new Point(fitX, fitY - i);
      var inside1 = this.insideTriangle(genCenter, [p1, p2, p3]);
      var inside2 = this.insideTriangle(genCenter, [p1, p3, p4]);
      if (inside1 || inside2) {
        shiftVector = new Point(d3, -(j * 3));
        found = true;
      }
    }
    
    if (!found) {
      var p1 = new Point(fitX, fitY + i);
      var p2 = new Point(fitX + d3, fitY + j);
      var p3 = new Point(fitX + d3, fitY + (j * 3));
      var p4 = new Point(fitX, fitY + (j * 3));
      var inside1 = this.insideTriangle(genCenter, [p1, p2, p3]);
      var inside2 = this.insideTriangle(genCenter, [p1, p3, p4]);
      if (inside1 || inside2) {
        shiftVector = new Point(d3, (j * 3));
        found = true;
      }
    }
    
    if (!found) {
      var p1 = new Point(fitX - d3, fitY + j);
      var p2 = new Point(fitX, fitY + i);
      var p3 = new Point(fitX, fitY + (j * 3));
      var p4 = new Point(fitX - d3, fitY + (j * 3));
      var inside1 = this.insideTriangle(genCenter, [p1, p2, p3]);
      var inside2 = this.insideTriangle(genCenter, [p1, p3, p4]);
      if (inside1 || inside2) {
        shiftVector = new Point(-d3, (j * 3));
        found = true;
      }
    }
    
    hexPoints = this.movePoints(hexPoints, shiftVector);
  }
  
  return hexPoints;
};

