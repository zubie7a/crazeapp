// Drawing Engine - Ported from original CraZe app
// No modules - plain JavaScript that works with file:// URLs

// Brush types - matching iOS indices (0-42)
var BRUSHES = {
  LINES: 0,
  RADIANT: 1,
  VERTICAL_LINES: 2,
  HORIZONTAL_LINES: 3,
  GREAT_CROSS: 4,
  TRIANGLES: 5,
  SQUARES: 6,
  DIAMOND: 7,
  HEXAGON: 8,
  SNOWFLAKE: 9,
  FLOWER: 10,
  MOON: 11,
  CIRCLES: 12,
  CHAIN: 13,
  INSIGNIA: 14,
  FOUR_STAR: 15,
  SIX_STAR: 16,
  EIGHT_STAR: 17,
  LIGHTNING: 18,
  TANGENT: 19,
  HOURGLASS: 20,
  PINWHEEL: 21,
  TILES: 22,
  SAW: 23,
  SEAL: 24,
  PRESENT: 25,
  ARROWHEAD: 26,
  FORCE: 27,
  WINDOW: 28,
  XXXXXXX: 29,
  ZZZZZZZ: 30,
  COMET: 31,
  RECTANGLE: 32,
  PARALLELOGRAM: 33,
  FIVE_STAR: 34,
  PENTAGON: 35,
  FAIRY: 36,
  HEART: 37,
  WAVE: 38,
  PEAK: 39,
  TRAPEZE: 40,
  INWARDS: 41,
  OUTWARDS: 42,
  // Legacy names for compatibility
  REGULAR_LINE: 0,
  LINES_FROM_START: 1,
};

// Palette types - matching iOS indices
var PALETTES = {
  MANUAL: 0,
  RAINBOW: 1,
  BLAZE: 2,      // was FIRE
  GLACIER: 3,    // was ICE
  OCEAN: 4,
  NATURAL: 5,    // was NATURE
  BLUESKY: 6,
  GRAYSCALE: 7,
  SEPIA: 8,
  MYSTICAL: 9,   // was MYSTIC
  TROPICAL: 10,
  AURORA: 11,
  NEON: 12,
  BRAZIL: 13,
  MEXICO: 14,
  COLOMBIA: 15,
  GERMANY: 16,
  NETHERLANDS: 17,
  INDIA: 18,
  SUNSET: 19,
  BEACH: 20,
  FUTURE: 21,
  SUNNY: 22,
  PASTEL: 23,
  INTENSE: 24,
  DASH: 25,
  RUNNER: 26,
  MINT: 27,
  VIRIDIS: 28,
  HAPPY: 29,
  COMFY: 30,
  SHINY: 31,
  CYBER: 32,
  JUPITER: 33,
  BLOSSOM: 34,
  HOLIDAY: 35,
  SUNRISE: 36,
  FLORAL: 37,
  CMYK: 38,
  DAYDREAM: 39,
  COSMOS: 40,
  HYPERSPACE: 41,
  GOLDEN: 42,
  LIME: 43,
};

// Drawing Engine Class
function DrawingEngine(canvas) {
  this.canvas = canvas;
  this.ctx = canvas.getContext('2d');

  // Default settings (from Parameters module)
  this.settings = Parameters.getDefaults();

  // Drawing state
  this.drawing = false;
  this.x1 = 0; this.y1 = 0;
  this.x2 = 0; this.y2 = 0;
  this.aX = 0; this.aY = 0;
  
  // Current brush instance (for default mouse/touch drawing)
  this.currentBrush = null;
  
  // Active strokes map for multi-hand drawing (strokeId -> { brush, x1, y1, aX, aY })
  this.activeStrokes = {};

  // Rotation state (kept for perspectiveSize calculation)
  this.currentBrushSize = this.settings.brushSize;

  // Palette state
  this.currentPalette = null;
  this.fadeCount = 0;
  this.triDir = 1;

  // Center
  this.centerX = canvas.width / 2;
  this.centerY = canvas.height / 2;

  // Undo/redo stacks
  this.undoStack = [];
  this.redoStack = [];

  // Initialize
  this.initializePalette();
  this.ctx.lineWidth = this.settings.thickness;
}

DrawingEngine.prototype.getColor = function() {
  var settings = this.settings;
  var alpha = settings.alpha / 100;
  
  if (settings.palette === PALETTES.MANUAL) {
    return 'rgba(' + settings.r + ',' + settings.g + ',' + settings.b + ',' + alpha + ')';
  }
  
  if (this.currentPalette && this.currentPalette.colors.length > 0) {
    // Get color without shifting (shifting happens in shiftColor())
    var RGB = this.currentPalette.colors[this.currentPalette.colorIndex];
    return 'rgba(' + RGB[0] + ',' + RGB[1] + ',' + RGB[2] + ',' + alpha + ')';
  }
  
  return 'rgba(' + settings.r + ',' + settings.g + ',' + settings.b + ',' + alpha + ')';
};

DrawingEngine.prototype.initializePalette = function() {
  var settings = this.settings;
  var rgb = settings.palette === PALETTES.MANUAL ? [settings.r / 255, settings.g / 255, settings.b / 255] : [];
  this.currentPalette = PaletteGenerator.buildPalette(settings.palette, rgb);
};

DrawingEngine.prototype.updateSetting = function(key, value) {
  var paletteChanged = key === 'palette' && this.settings.palette !== value;
  var manualColorChanged = key === 'r' || key === 'g' || key === 'b';
  
  this.settings[key] = value;

  if (paletteChanged || (manualColorChanged && this.settings.palette === PALETTES.MANUAL)) {
    this.initializePalette();
  }
  if (key === 'thickness') {
    this.ctx.lineWidth = value;
  }
  
  // Recreate brushes for all active strokes when parameters change
  this.recreateActiveBrushes();
};

// Recreate brushes for all active strokes when parameters change
DrawingEngine.prototype.recreateActiveBrushes = function() {
  // Update center coordinates in settings
  this.settings.centerX = this.centerX;
  this.settings.centerY = this.centerY;
  
  // Recreate default brush if drawing
  if (this.drawing && this.currentBrush) {
    var currentPointer = new Point(this.x1, this.y1);
    this.currentBrush = BrushGenerator.buildBrush(this.settings, currentPointer);
  }
  
  // Recreate brushes for all active multi-hand strokes
  for (var strokeId in this.activeStrokes) {
    var stroke = this.activeStrokes[strokeId];
    if (stroke && stroke.brush) {
      var pointer = new Point(stroke.aX, stroke.aY);
      var newBrush = BrushGenerator.buildBrush(this.settings, pointer);
      stroke.brush = newBrush;
    }
  }
};

// Randomize a specific active brush (for persistent randomize)
// strokeId: 'default' for default stroke, or 'hand0', 'hand1', etc. for multi-hand strokes
DrawingEngine.prototype.randomizeActiveBrushes = function(strokeId) {
  if (!this.settings.persistentRandomize) return;
  
  strokeId = strokeId || 'default';
  
  // Get the brush for this specific stroke
  var brush = null;
  var pointer = null;
  
  if (strokeId === 'default') {
    if (!this.drawing || !this.currentBrush) return;
    brush = this.currentBrush;
    pointer = new Point(this.x1, this.y1);
  } else {
    var stroke = this.activeStrokes[strokeId];
    if (!stroke || !stroke.brush) return;
    brush = stroke.brush;
    pointer = new Point(stroke.aX, stroke.aY);
  }
  
  // Backup current settings
  var originalSettings = JSON.parse(JSON.stringify(this.settings));
  var persistentRandomize = this.settings.persistentRandomize;
  
  // Randomize parameters for this specific brush
  Randomizer.randomizeParameters(this);
  this.settings.persistentRandomize = persistentRandomize;
  
  // Update center coordinates in settings for brush creation
  this.settings.centerX = this.centerX;
  this.settings.centerY = this.centerY;
  
  // Create new brush with randomized settings for this stroke only
  var newBrush = BrushGenerator.buildBrush(this.settings, pointer);
  
  if (strokeId === 'default') {
    this.currentBrush = newBrush;
  } else {
    this.activeStrokes[strokeId].brush = newBrush;
  }
  
  // Restore original settings (so other brushes aren't affected)
  this.settings = originalSettings;
  this.settings.persistentRandomize = persistentRandomize;
};

DrawingEngine.prototype.setCenter = function(x, y) {
  this.centerX = x;
  this.centerY = y;
};

DrawingEngine.prototype.resetCenter = function() {
  this.centerX = this.canvas.width / 2;
  this.centerY = this.canvas.height / 2;
};

DrawingEngine.prototype.shiftColor = function() {
  // Shift color once per drawing operation
  if (this.settings.palette !== PALETTES.MANUAL && this.currentPalette && this.currentPalette.colors.length > 0) {
    this.currentPalette.shiftIndex();
  }
};

// Note: variableSize and rotatingShape are now handled by brushes internally
// This function only handles perspectiveSize (not yet implemented in brushes)
DrawingEngine.prototype.varySize = function() {
  // PerspectiveSize is not yet handled by brushes, so we keep this for now
  // TODO: Move perspectiveSize logic to Brush class
  if (this.settings.perspectiveSize) {
    this.currentBrushSize = this.settings.brushSize;
    var dx = this.x1 - this.centerX;
    var dy = this.y1 - this.centerY;
    var dist = Math.sqrt(dx * dx + dy * dy) / 200;
    this.currentBrushSize *= dist;
  }
};

DrawingEngine.prototype.fadeDrawing = function() {
  if (this.settings.brush === BRUSHES.LINES && this.settings.fillShape) return;
  this.fadeCount++;
  if (this.fadeCount > 30 && this.settings.fadingImage) {
    var imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    var data = imageData.data;
    for (var i = 0; i < data.length; i += 4) {
      data[i] *= 0.9;
      data[i + 1] *= 0.9;
      data[i + 2] *= 0.9;
    }
    this.ctx.putImageData(imageData, 0, 0);
    this.fadeCount = 0;
  }
};

DrawingEngine.prototype.modifier = function() {
  this.shiftColor();
  this.varySize(); // Only handles perspectiveSize now
  this.fadeDrawing();
};

DrawingEngine.prototype.drawLine = function(xi, yi, xf, yf, fill) {
  this.ctx.strokeStyle = this.getColor();
  this.ctx.shadowColor = this.getColor();
  this.ctx.shadowBlur = fill ? 0 : 0;
  this.ctx.beginPath();
  this.ctx.moveTo(xi, yi);
  this.ctx.lineTo(xf, yf);
  this.ctx.stroke();
  this.ctx.closePath();
};

DrawingEngine.prototype.drawCircle = function(x, y, radius, fill) {
  this.ctx.strokeStyle = this.getColor();
  this.ctx.shadowColor = this.getColor();
  this.ctx.shadowBlur = fill ? 0 : 2;
  this.ctx.beginPath();
  this.ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
  this.ctx.closePath();
  if (fill) {
    var fillbak = this.ctx.fillStyle;
    this.ctx.fillStyle = this.ctx.strokeStyle;
    this.ctx.fill();
    this.ctx.fillStyle = fillbak;
  } else {
    this.ctx.stroke();
  }
};

DrawingEngine.prototype.drawShape = function(points, fill) {
  if (points.length < 3) return;
  
  this.ctx.strokeStyle = this.getColor();
  this.ctx.shadowColor = this.getColor();
  this.ctx.shadowBlur = fill ? 0 : 0;
  this.ctx.beginPath();
  
  var firstPoint = points[0];
  this.ctx.moveTo(firstPoint.getX(), firstPoint.getY());
  
  for (var i = 1; i < points.length; i++) {
    var p = points[i];
    this.ctx.lineTo(p.getX(), p.getY());
  }
  
  this.ctx.closePath();
  
  if (fill) {
    var fillbak = this.ctx.fillStyle;
    this.ctx.fillStyle = this.ctx.strokeStyle;
    this.ctx.fill();
    this.ctx.fillStyle = fillbak;
  }
  this.ctx.stroke();
};

// Undo/Redo
DrawingEngine.prototype.pushUndo = function() {
  var undoCnv = document.createElement('canvas');
  undoCnv.width = this.canvas.width;
  undoCnv.height = this.canvas.height;
  var ctx = undoCnv.getContext('2d');
  ctx.drawImage(this.canvas, 0, 0);
  this.undoStack.push(undoCnv);
  if (this.undoStack.length > 10) {
    this.undoStack.shift();
  }
};

DrawingEngine.prototype.clearRedo = function() {
  this.redoStack = [];
};

DrawingEngine.prototype.undo = function() {
  if (this.undoStack.length === 0) return false;
  var redoCnv = document.createElement('canvas');
  redoCnv.width = this.canvas.width;
  redoCnv.height = this.canvas.height;
  var redoCtx = redoCnv.getContext('2d');
  redoCtx.drawImage(this.canvas, 0, 0);
  this.redoStack.push(redoCnv);

  var undoCnv = this.undoStack.pop();
  this.ctx.drawImage(undoCnv, 0, 0);
  return true;
};

DrawingEngine.prototype.redo = function() {
  if (this.redoStack.length === 0) return false;
  this.pushUndo();
  var redoCnv = this.redoStack.pop();
  this.ctx.drawImage(redoCnv, 0, 0);
  return true;
};

// Mouse handlers
DrawingEngine.prototype.onMouseDown = function(x, y, strokeId) {
  strokeId = strokeId || 'default';
  
  // Only push undo once when first stroke starts (for default stroke or first hand)
  if (strokeId === 'default') {
    this.pushUndo();
    this.clearRedo();
  } else {
    // For multi-hand drawing, only push undo if no other strokes are active
    var hasActiveStrokes = Object.keys(this.activeStrokes).length > 0;
    if (!hasActiveStrokes && !this.drawing) {
      this.pushUndo();
      this.clearRedo();
    }
  }

  this.x2 = this.x1 = x;
  this.y2 = this.y1 = y;

  this.currentBrushSize = this.settings.brushSize;
  
  if (strokeId === 'default') {
    this.drawing = true;
  }

  // Create brush instance
  var pointer = new Point(x, y);
  // Add center coordinates to settings for brushes
  this.settings.centerX = this.centerX;
  this.settings.centerY = this.centerY;
  var brush = BrushGenerator.buildBrush(this.settings, pointer);
  
  if (strokeId === 'default') {
    this.currentBrush = brush;
  } else {
    // Store brush for this stroke ID
    this.activeStrokes[strokeId] = {
      brush: brush,
      x1: x, y1: y,
      x2: x, y2: y,
      aX: x, aY: y
    };
  }

  this.onMouseMove(x, y, strokeId);
};

DrawingEngine.prototype.onMouseUp = function(strokeId) {
  strokeId = strokeId || 'default';
  
  var brush = null;
  if (strokeId === 'default') {
    brush = this.currentBrush;
    this.drawing = false;
    this.currentBrush = null;
  } else {
    var stroke = this.activeStrokes[strokeId];
    if (stroke) {
      brush = stroke.brush;
      delete this.activeStrokes[strokeId];
    }
  }
  
  // Finish stroke on brush if needed (handles filling for Lines brush)
  if (brush && brush.finishStroke) {
    brush.finishStroke(this.ctx, this);
  }
};

DrawingEngine.prototype.onMouseMove = function(x, y, strokeId) {
  strokeId = strokeId || 'default';
  
  var brush = null;
  var stroke = null;
  
  if (strokeId === 'default') {
    if (!this.drawing) return;
    brush = this.currentBrush;
    this.aX = this.x1 = x;
    this.aY = this.y1 = y;
  } else {
    stroke = this.activeStrokes[strokeId];
    if (!stroke) return;
    brush = stroke.brush;
    stroke.aX = stroke.x1 = x;
    stroke.aY = stroke.y1 = y;
  }

  // Only call modifier for default stroke (to avoid multiple color shifts)
  // But always call fadeDrawing for all strokes (fading should work for all)
  if (strokeId === 'default') {
    this.modifier();
  } else {
    // For multi-hand strokes, only call fadeDrawing (not shiftColor/varySize)
    this.fadeDrawing();
  }

  // Use brush system - just call draw() like iOS
  if (brush) {
    var pointer = new Point(x, y);
    // Update center coordinates in brush params
    brush.params.centerX = this.centerX;
    brush.params.centerY = this.centerY;
    brush.move(pointer);
    
    // Store steps before drawing (to check if we crossed a 30-step boundary)
    var stepsBefore = brush.steps;
    
    // Draw the brush (handles all rotation, symmetry, fit to grid, etc.)
    // This will increment brush.steps in transform()
    brush.draw(this.ctx, this);
    
    // Check for persistent randomize after drawing
    // brush.steps is incremented in transform() which is called in draw()
    // Check if we've crossed a 30-step boundary (but not at step 0)
    if (this.settings.persistentRandomize && brush.steps > 0 && brush.steps % 30 === 0 && stepsBefore % 30 !== 0) {
      // Randomize only this specific brush (identified by strokeId)
      this.randomizeActiveBrushes(strokeId);
    }
  }
};

DrawingEngine.prototype.clearCanvas = function() {
  this.ctx.globalAlpha = 1.0;
  this.ctx.fillStyle = '#000000';
  this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  this.undoStack = [];
  this.redoStack = [];
};

DrawingEngine.prototype.resizeCanvas = function(width, height) {
  this.canvas.width = width;
  this.canvas.height = height;
  this.clearCanvas();
  this.resetCenter();
};

// CraZe Mode Controller
function CrazeModeController(engine) {
  this.engine = engine;
  this.active = false;
  this.intervalId = null;
  this.point = { x: 0, y: 0 };
  this.stage = true;
}

CrazeModeController.prototype.start = function() {
  if (this.active) {
    this.stop();
    return false;
  }

  this.active = true;
  this.point.x = this.engine.canvas.width / 2;
  this.point.y = this.engine.canvas.height / 2;
  this.engine.onMouseDown(this.point.x, this.point.y);

  var self = this;
  this.intervalId = setInterval(function() { self.move(); }, 1);
  return true;
};

CrazeModeController.prototype.stop = function() {
  if (this.intervalId) {
    clearInterval(this.intervalId);
    this.intervalId = null;
  }
  this.active = false;
  this.engine.onMouseUp();
};

CrazeModeController.prototype.move = function() {
  var fade = this.engine.settings.fadingImage;
  var dis = fade ? 20 : 11;
  if (!this.stage) dis *= 3;

  var dx = Math.floor(Math.random() * dis);
  var dy = Math.floor(Math.random() * dis);
  dx *= Math.random() * 2 > 1 ? 1 : -1;
  dy *= Math.random() * 2 > 1 ? 1 : -1;

  var width = this.engine.canvas.width;
  var height = this.engine.canvas.height;

  if (this.point.x + dx >= width || this.point.x + dx <= 0) dx *= -1;
  if (this.point.y + dy >= height || this.point.y + dy <= 0) dy *= -1;

  var x1 = this.point.x;
  var y1 = this.point.y;

    var points = this.stage
      ? CrazeMode.bresenhamCircle(x1, y1, x1 + dx, y1 + dy)
      : CrazeMode.bresenhamLine(x1, y1, x1 + dx, y1 + dy);

  if (points.length === 0) return;

  var index = 0;
  var minn = 1000000;

  if (this.stage) {
    var start = dx > 0 ? 0 : points.length - 1;
    var end = points.length / 2;
    var inc = dx > 0 ? 1 : -1;

    for (var i = start; dx > 0 ? i < end : i >= end; i += inc) {
      var n = points[i];
      var ddx = n.x() - x1;
      var ddy = n.y() - y1;
      var rad = Math.sqrt(ddx * ddx + ddy * ddy);
      if (rad < minn) {
        index = i;
        minn = rad;
      }
    }
  } else {
    index = x1 < x1 + dx ? 0 : points.length - 1;
  }

  var step = 3;
  var self = this;
  if (x1 < x1 + dx) {
    for (var i = index; i < points.length; i += step) {
      var p = points[i];
      if (p.x() > width || p.y() > height || p.x() < 0 || p.y() < 0) break;
      this.point.x = p.x();
      this.point.y = p.y();
      this.engine.onMouseMove(this.point.x, this.point.y);
      if (this.stage && i + 5 >= points.length) i = 0;
      if (this.stage && Math.floor(Math.random() * 20 + 1) === 1) break;
    }
  } else {
    for (var i = index; i >= 0; i -= step) {
      var p = points[i];
      if (p.x() > width || p.y() > height || p.x() < 0 || p.y() < 0) break;
      this.point.x = p.x();
      this.point.y = p.y();
      this.engine.onMouseMove(this.point.x, this.point.y);
      if (this.stage && i - 5 < 0) i = points.length - 1;
      if (this.stage && Math.floor(Math.random() * 20 + 1) === 1) break;
    }
  }

  this.stage = !this.stage;
};
