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
    persistentRandomize: false,
  };

  // Expose functions globally
  window.Parameters = {
    getDefaults: function() {
      // Return a copy of default parameters
      return JSON.parse(JSON.stringify(DEFAULT_PARAMETERS));
    },
    randomize: function(engine, crazeController, elements, showToast) {
      if (!engine) return;
      
      // Store state for all active strokes (default and multi-hand)
      var activeStrokeStates = {};
      
      // Capture state for default stroke
      if (engine.drawing) {
        if (crazeController && crazeController.active) {
          // CraZe mode is active - use its current point
          activeStrokeStates['default'] = {
            x: crazeController.point.x,
            y: crazeController.point.y
          };
        } else {
          // Manual drawing - use engine's current position
          activeStrokeStates['default'] = {
            x: engine.x1,
            y: engine.y1
          };
        }
      }
      
      // Capture state for multi-hand strokes
      if (engine.activeStrokes) {
        for (var strokeId in engine.activeStrokes) {
          var stroke = engine.activeStrokes[strokeId];
          if (stroke && stroke.aX !== undefined && stroke.aY !== undefined) {
            activeStrokeStates[strokeId] = {
              x: stroke.aX,
              y: stroke.aY
            };
          }
        }
      }
      
      // Backup current settings to restore after individual randomizations
      var originalSettings = JSON.parse(JSON.stringify(engine.settings));
      var originalCenterX = engine.centerX;
      var originalCenterY = engine.centerY;
      
      // Store default stroke's randomized settings for UI sync
      var defaultStrokeSettings = null;
      
      // Randomize separately for each active stroke - each gets its own unique random brush
      for (var strokeId in activeStrokeStates) {
        var state = activeStrokeStates[strokeId];
        var pointer = new Point(state.x, state.y);
        
        // Randomize parameters for this specific stroke (independent randomization)
        Randomizer.randomizeParameters(engine);
        
        // Update center coordinates in settings for brush creation
        engine.settings.centerX = engine.centerX;
        engine.settings.centerY = engine.centerY;
        
        // Store settings for default stroke (to sync UI later)
        if (strokeId === 'default') {
          defaultStrokeSettings = JSON.parse(JSON.stringify(engine.settings));
        }
        
        // Create a new brush with randomized settings for this stroke
        // The brush stores its own copy of params, so it won't be affected by later changes
        var newBrush = BrushGenerator.buildBrush(engine.settings, pointer);
        
        if (strokeId === 'default') {
          engine.currentBrush = newBrush;
        } else {
          // Update brush for multi-hand stroke
          if (engine.activeStrokes && engine.activeStrokes[strokeId]) {
            engine.activeStrokes[strokeId].brush = newBrush;
          }
        }
        
        // Restore original settings before next randomization (so each stroke gets independent randomization)
        engine.settings = JSON.parse(JSON.stringify(originalSettings));
        engine.centerX = originalCenterX;
        engine.centerY = originalCenterY;
      }
      
      // Set final engine.settings to match default stroke (if it exists) for UI consistency
      if (defaultStrokeSettings) {
        engine.settings = defaultStrokeSettings;
        if (elements) {
          Randomizer.syncUI(engine, elements);
        }
      } else if (Object.keys(activeStrokeStates).length > 0) {
        // If no default stroke, randomize one more time for UI (use first stroke's settings)
        Randomizer.randomizeParameters(engine);
        if (elements) {
          Randomizer.syncUI(engine, elements);
        }
      } else {
        // No active strokes - just randomize for UI
        Randomizer.randomizeParameters(engine);
        if (elements) {
          Randomizer.syncUI(engine, elements);
        }
      }
      
      if (engine.settings.thickness) {
        engine.ctx.lineWidth = engine.settings.thickness;
      }

      if (showToast) {
        showToast('Parameters RandomiZed!');
      }
    }
  };

})();

