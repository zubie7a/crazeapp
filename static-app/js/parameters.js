// Parameter randomization functionality
// Handles randomizing drawing parameters

(function() {
  'use strict';

  // Default parameters for drawing engine
  var DEFAULT_PARAMETERS = {
    brush: BRUSHES.LINES, 
    brushSize: 50,
    thickness: 2,
    rotationAmount: 6,
    palette: PALETTES.RAINBOW,
    r: 255,
    g: 0,
    b: 0,
    alpha: 100,
    symmetry: true,
    variableSize: false,
    rotatingShape: false,
    connectBorders: false,
    fillShape: false,
    fadingImage: true,
    fitToGrid: false,
    perspectiveSize: false,
  };

  // Expose functions globally
  window.Parameters = {
    getDefaults: function() {
      // Return a copy of default parameters
      return JSON.parse(JSON.stringify(DEFAULT_PARAMETERS));
    },
    randomize: function(engine, crazeController, elements, showToast) {
      if (!engine) return;
      
      // Check if currently drawing (either manually or in CraZe mode)
      var isDrawing = engine.drawing;
      var currentPointer = null;
      
      if (isDrawing) {
        // Get current pointer position
        if (crazeController && crazeController.active) {
          // CraZe mode is active - use its current point
          currentPointer = new Point(crazeController.point.x, crazeController.point.y);
        } else {
          // Manual drawing - use engine's current position
          currentPointer = new Point(engine.x1, engine.y1);
        }
      }
      
      // Randomize parameters
      Randomizer.randomizeParameters(engine);
      Randomizer.syncUI(engine, elements);
      
      // If drawing, create a new brush instance with the new randomized settings
      if (isDrawing && currentPointer) {
        // Update center coordinates in settings
        engine.settings.centerX = engine.centerX;
        engine.settings.centerY = engine.centerY;
        // Create new brush with updated settings
        engine.currentBrush = BrushGenerator.buildBrush(engine.settings, currentPointer);
      }
      
      // Show toast notification (like iOS)
      showToast('Parameters RandomiZed!');
    }
  };

})();

