// HandsFree module - Hand tracking for drawing
// No modules - plain JavaScript that works with file:// URLs

var HandsFree = (function() {
  'use strict';

  // Hand connections for skeleton drawing
  var HAND_CONNECTIONS = [
    [0, 1], [1, 2], [2, 3], [3, 4],
    [0, 5], [5, 6], [6, 7], [7, 8],
    [0, 9], [9, 10], [10, 11], [11, 12],
    [0, 13], [13, 14], [14, 15], [15, 16],
    [0, 17], [17, 18], [18, 19], [19, 20],
    [5, 9], [9, 13], [13, 17]
  ];

  // Internal state
  var handsFreeInstance = null;
  var handsFreeActive = false;
  var activeHands = {}; // Map of handIndex -> { wasDrawing: boolean }
  
  // External references (set via init)
  var engine = null;
  var elements = null;
  var crazeController = null;

  // Draw hand skeletons on overlay canvas
  function drawHandsOnOverlay(landmarks) {
    if (!elements || !elements.overlayCanvas) return;
    
    var canvas = elements.overlayCanvas;
    var ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!landmarks || landmarks.length === 0) return;

    var width = canvas.width;
    var height = canvas.height;

    for (var handIndex = 0; handIndex < landmarks.length; handIndex++) {
      var hand = landmarks[handIndex];
      if (!hand || !Array.isArray(hand)) continue;

      var handColor = handIndex === 0 ? '#00FF41' : '#FF0080';
      ctx.strokeStyle = handColor;
      ctx.lineWidth = 3;
      ctx.shadowBlur = 10;
      ctx.shadowColor = handColor;

      // Draw connections
      for (var c = 0; c < HAND_CONNECTIONS.length; c++) {
        var conn = HAND_CONNECTIONS[c];
        var startPoint = hand[conn[0]];
        var endPoint = hand[conn[1]];
        if (startPoint && endPoint && startPoint.x !== undefined) {
          ctx.beginPath();
          ctx.moveTo((1 - startPoint.x) * width, startPoint.y * height);
          ctx.lineTo((1 - endPoint.x) * width, endPoint.y * height);
          ctx.stroke();
        }
      }

      // Draw landmarks
      ctx.shadowBlur = 15;
      for (var i = 0; i < hand.length; i++) {
        var landmark = hand[i];
        if (landmark && landmark.x !== undefined) {
          ctx.fillStyle = i === 0 ? '#FFFFFF' : (i % 4 === 0 ? '#FFD700' : handColor);
          ctx.beginPath();
          ctx.arc((1 - landmark.x) * width, landmark.y * height, i === 0 ? 8 : (i % 4 === 0 ? 6 : 4), 0, 2 * Math.PI);
          ctx.fill();
        }
      }
      ctx.shadowBlur = 0;
    }
  }

  // Start HandsFree hand tracking
  function start() {
    if (typeof window.Handsfree === 'undefined') {
      alert('HandsFree library is not loaded. Please check your internet connection and refresh.');
      return;
    }

    if (crazeController && crazeController.active) {
      crazeController.stop();
      if (elements && elements.crazeBtn) {
        elements.crazeBtn.classList.remove('active');
      }
    }

    try {
      handsFreeInstance = new window.Handsfree({
        hands: { enabled: true, maxNumHands: 2, minDetectionConfidence: 0.7, minTrackingConfidence: 0.7 },
        showDebug: false
      });

      handsFreeInstance.on('data', function(data) {
        if (!handsFreeActive) return;

        if (data.hands && data.hands.landmarks) {
          drawHandsOnOverlay(data.hands.landmarks);
        } else {
          if (elements && elements.overlayCanvas) {
            var ctx = elements.overlayCanvas.getContext('2d');
            ctx.clearRect(0, 0, elements.overlayCanvas.width, elements.overlayCanvas.height);
          }
        }

        if (data.hands && data.hands.landmarks && data.hands.landmarks.length > 0) {
          // Track which hands are currently visible
          var visibleHands = {};
          
          // Process each hand independently
          for (var h = 0; h < data.hands.landmarks.length; h++) {
            var hand = data.hands.landmarks[h];
            if (!hand || !Array.isArray(hand) || hand.length <= 8 || !hand[8] || hand[8].x === undefined) {
              // Hand not visible or invalid - stop drawing for this hand
              if (activeHands[h]) {
                if (engine) engine.onMouseUp('hand' + h);
                delete activeHands[h];
              }
              continue;
            }
            
            visibleHands[h] = true;
            var drawingPoint = { x: hand[8].x, y: hand[8].y };
            
            if (drawingPoint && engine && elements) {
              var mainCanvas = elements.mainCanvas;
              var overlay = elements.overlayCanvas;
              var mainRect = mainCanvas.getBoundingClientRect();
              var overlayRect = overlay.getBoundingClientRect();
              
              var videoX = 1 - drawingPoint.x;
              var videoY = drawingPoint.y;
              var overlayX = videoX * overlayRect.width;
              var overlayY = videoY * overlayRect.height;
              var viewportX = overlayRect.left + overlayX;
              var viewportY = overlayRect.top + overlayY;
              var relativeX = viewportX - mainRect.left;
              var relativeY = viewportY - mainRect.top;
              var scaleX = mainCanvas.width / mainRect.width;
              var scaleY = mainCanvas.height / mainRect.height;
              var canvasX = relativeX * scaleX;
              var canvasY = relativeY * scaleY;
              
              var strokeId = 'hand' + h;
              
              if (!activeHands[h]) {
                // Start drawing for this hand
                engine.onMouseDown(canvasX, canvasY, strokeId);
                activeHands[h] = { wasDrawing: true };
              } else {
                // Continue drawing for this hand
                engine.onMouseMove(canvasX, canvasY, strokeId);
              }
            }
          }
          
          // Stop drawing for hands that are no longer visible
          for (var handIndex in activeHands) {
            if (!visibleHands[handIndex]) {
              if (engine) engine.onMouseUp('hand' + handIndex);
              delete activeHands[handIndex];
            }
          }
        } else {
          // No hands visible - stop all drawing
          for (var handIndex in activeHands) {
            if (engine) engine.onMouseUp('hand' + handIndex);
            delete activeHands[handIndex];
          }
        }
      });

      handsFreeInstance.start();
      handsFreeActive = true;
      if (elements && elements.handsBtn) {
        elements.handsBtn.classList.add('active');
      }
    } catch (error) {
      console.error('Error initializing HandsFree:', error);
      alert('Error starting hand detection. Please check camera permissions.');
    }
  }

  // Stop HandsFree hand tracking
  function stop() {
    // Prevent any errors from causing page reloads - wrap everything in try-catch
    try {
      // Set flag first to prevent data handler from running during cleanup
      var wasActive = handsFreeActive;
      handsFreeActive = false;
      
      // Stop all active hand strokes
      for (var handIndex in activeHands) {
        if (engine) {
          try {
            engine.onMouseUp('hand' + handIndex);
          } catch (error) {
            console.error('Error in engine.onMouseUp during HandsFree cleanup for hand ' + handIndex + ':', error);
          }
        }
      }
      activeHands = {};
      
      // Also stop default stroke if active
      if (engine && wasActive) {
        try {
          engine.onMouseUp();
        } catch (error) {
          console.error('Error in engine.onMouseUp during HandsFree cleanup:', error);
        }
      }
      
      // Store reference to instance for async cleanup
      var instanceToStop = handsFreeInstance;
      handsFreeInstance = null;
      
      // Clear overlay canvas immediately (safe operation)
      try {
        if (elements && elements.overlayCanvas) {
          var ctx = elements.overlayCanvas.getContext('2d');
          ctx.clearRect(0, 0, elements.overlayCanvas.width, elements.overlayCanvas.height);
        }
      } catch (error) {
        console.error('Error clearing overlay canvas:', error);
      }
      
      // Don't call stop() - it might be causing the reload
      // Instead, just remove event listeners and let it run in the background
      // The flag is set to false, so the data handler won't process anything
      if (instanceToStop) {
        // Remove event listeners to stop processing
        setTimeout(function() {
          try {
            // Remove event listeners before stopping to prevent errors
            try {
              if (typeof instanceToStop.off === 'function') {
                instanceToStop.off('data');
              } else if (typeof instanceToStop.removeListener === 'function') {
                instanceToStop.removeListener('data');
              } else if (typeof instanceToStop.removeAllListeners === 'function') {
                instanceToStop.removeAllListeners('data');
              }
            } catch (e) {
              console.warn('Could not remove HandsFree event listeners:', e);
            }
            
            // Try to pause instead of stop - might be safer
            if (typeof instanceToStop.pause === 'function') {
              try {
                instanceToStop.pause();
              } catch (pauseError) {
                console.error('Error in handsFreeInstance.pause():', pauseError);
              }
            }
            
            // Only call stop() as a last resort, and wrap it very carefully
            // Skip stop() entirely if pause() worked
            if (typeof instanceToStop.pause !== 'function' && typeof instanceToStop.stop === 'function') {
              try {
                // Use requestAnimationFrame to defer stop() even more
                requestAnimationFrame(function() {
                  try {
                    instanceToStop.stop();
                  } catch (stopError) {
                    console.error('Error in handsFreeInstance.stop():', stopError);
                  }
                });
              } catch (stopError) {
                console.error('Error calling handsFreeInstance.stop():', stopError);
              }
            }
          } catch (error) {
            console.error('Error in HandsFree cleanup:', error);
            // Don't rethrow - we want to continue even if cleanup fails
          }
        }, 50); // Longer delay to ensure current operation completes
      }
      
      if (elements && elements.handsBtn) {
        elements.handsBtn.classList.remove('active');
      }
    } catch (error) {
      console.error('Fatal error in stopHandsFree:', error);
      // Reset state even if there's an error to prevent further issues
      handsFreeActive = false;
      handsFreeInstance = null;
      wasDrawing = false;
      if (elements && elements.handsBtn) {
        elements.handsBtn.classList.remove('active');
      }
    }
  }

  // Toggle HandsFree on/off
  function toggle() {
    if (handsFreeActive) {
      stop();
    } else {
      start();
    }
  }

  // Check if HandsFree is currently active
  function isActive() {
    return handsFreeActive;
  }

  // Initialize HandsFree module with required references
  function init(engineRef, elementsRef, crazeControllerRef) {
    engine = engineRef;
    elements = elementsRef;
    crazeController = crazeControllerRef;
  }

  // Public API
  return {
    init: init,
    start: start,
    stop: stop,
    toggle: toggle,
    isActive: isActive
  };
})();

