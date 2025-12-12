// Point class - represents a 2D coordinate point
// Note: This replaces the old Point class in drawingEngine.js for brush system
function Point(x, y) {
  this._x = x;
  this._y = y;
}

// Support both .x()/.y() (old API) and .getX()/.getY() (new API) for compatibility
Point.prototype.x = function() { return this._x; };
Point.prototype.y = function() { return this._y; };
Point.prototype.getX = function() { return this._x; };
Point.prototype.getY = function() { return this._y; };

Point.prototype.setX = function(x) {
  this._x = x;
};

Point.prototype.setY = function(y) {
  this._y = y;
};

Point.prototype.copy = function() {
  return new Point(this._x, this._y);
};

Point.prototype.toString = function() {
  return 'Point(' + this._x + ', ' + this._y + ')';
};

