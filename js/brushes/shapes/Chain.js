// Chain brush - chain of circles
function Chain(params, points, pointer) {
  Brush.call(this, params, points, pointer);
}

Chain.prototype = Object.create(Brush.prototype);
Chain.prototype.constructor = Chain;

Chain.buildBrush = function(params, pointer) {
  var points = Chain.getStaticBrushPoints(pointer, pointer);
  return new Chain(params, points, pointer);
};

Chain.prototype.getBrushPoints = function(pointer) {
  // Chain uses the previous point as start
  if (this.posPoints.length > 0) {
    var start = this.posPoints[this.posPoints.length - 1];
    return Chain.getStaticBrushPoints(start, pointer);
  }
  return Chain.getStaticBrushPoints(pointer, pointer);
};

Chain.getStaticBrushPoints = function(start, pointer) {
  return [start, pointer];
};

// Override getPath to draw circles
Chain.prototype.getPath = function(points, rotAngle, symmetry) {
  // For chain, return special marker
  return { type: 'chain', points: points };
};

