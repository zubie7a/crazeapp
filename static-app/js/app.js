// CraZe App - Main Application
// No modules - plain JavaScript that works with file:// URLs

(function() {
  'use strict';

  // Wait for DOM to be ready
  document.addEventListener('DOMContentLoaded', init);

  // State
  var engine = null;
  var crazeController = null;
  var handsFreeInstance = null;
  var handsFreeActive = false;
  var activeHands = {}; // Map of handIndex -> { wasDrawing: boolean }
  var changeCenterMode = false;

  // DOM Elements (populated in init)
  var elements = {};

  // Hand connections for skeleton drawing
  var HAND_CONNECTIONS = [
    [0, 1], [1, 2], [2, 3], [3, 4],
    [0, 5], [5, 6], [6, 7], [7, 8],
    [0, 9], [9, 10], [10, 11], [11, 12],
    [0, 13], [13, 14], [14, 15], [15, 16],
    [0, 17], [17, 18], [18, 19], [19, 20],
    [5, 9], [9, 13], [13, 17]
  ];

  function $(id) {
    return document.getElementById(id);
  }

  function init() {
    // Get DOM elements
    elements = {
      menuToggle: $('menuToggle'),
      closeSidebar: $('closeSidebar'),
      sidebar: $('sidebar'),
      overlay: $('overlay'),
      mainCanvas: $('mainCanvas'),
      overlayCanvas: $('overlayCanvas'),
      canvasContainer: document.querySelector('.canvas-container'),

      newBtn: $('newBtn'),
      saveBtn: $('saveBtn'),
      undoBtn: $('undoBtn'),
      redoBtn: $('redoBtn'),
      crazeBtn: $('crazeBtn'),
      handsBtn: $('handsBtn'),
      randomizeBtn: $('randomizeBtn'),
      infoBtn: $('infoBtn'),
      setCenterBtn: $('setCenterBtn'),
      resetCenterBtn: $('resetCenterBtn'),
      advancedToggle: $('advancedToggle'),

      brushSelect: $('brushSelect'),
      paletteSelect: $('paletteSelect'),

      alphaSlider: $('alphaSlider'),
      sizeSlider: $('sizeSlider'),
      rotSlider: $('rotSlider'),
      thickSlider: $('thickSlider'),

      alphaValue: $('alphaValue'),
      sizeValue: $('sizeValue'),
      rotValue: $('rotValue'),
      thickValue: $('thickValue'),

      symmetryToggle: $('symmetryToggle'),
      variableToggle: $('variableToggle'),
      rotatingToggle: $('rotatingToggle'),
      connectToggle: $('connectToggle'),
      fillToggle: $('fillToggle'),
      fadeToggle: $('fadeToggle'),
      gridToggle: $('gridToggle'),
      perspectiveToggle: $('perspectiveToggle'),

      colorPicker: $('colorPicker'),
      colorInput: $('colorInput'),
      colorText: $('colorText'),

      advancedSection: $('advancedSection'),
      advancedArrow: $('advancedArrow'),

      welcomeModal: $('welcomeModal'),
      modalTitle: $('modalTitle'),
      modalMessage: $('modalMessage'),
      modalOkBtn: $('modalOkBtn'),
    };

    // Initialize canvas
    var canvas = elements.mainCanvas;
    var bigdim = Math.max(window.innerHeight, window.innerWidth);
    canvas.width = bigdim;
    canvas.height = bigdim;

    // Initialize engine
    engine = new DrawingEngine(canvas);
    crazeController = new CrazeModeController(engine);
    engine.clearCanvas();

    updateCanvasDisplay();
    setupEventListeners();
    
    // Show welcome popup after 2 seconds on first load (only once per session)
    setTimeout(function() {
      var welcomeShown = sessionStorage.getItem('crazeWelcomeShown');
      if (!welcomeShown) {
        showWelcomePopup();
        sessionStorage.setItem('crazeWelcomeShown', 'true');
      }
    }, 2000);
  }

  var canvasPanX = 0;
  var canvasPanY = 0;

  function updateCanvasDisplay() {
    var canvas = elements.mainCanvas;
    var overlay = elements.overlayCanvas;

    var windowWidth = window.innerWidth;
    var windowHeight = window.innerHeight;
    var canvasWidth = canvas.width;
    var canvasHeight = canvas.height;

    // Calculate offsets to center the canvas
    // Canvas is larger than viewport, so we use negative margins to center it
    var offsetX, offsetY;
    var marginLeft, marginTop;

    if (canvasWidth < windowWidth) {
      // Canvas width is smaller than window - center with positive margin
      offsetX = -(windowWidth - canvasWidth) / 2;
      marginLeft = Math.abs(offsetX);
    } else {
      // Canvas width is bigger than window - use negative margin to center
      offsetX = (canvasWidth - windowWidth) / 2;
      marginLeft = -offsetX;
    }

    if (canvasHeight < windowHeight) {
      // Canvas height is smaller than window - center with positive margin
      offsetY = -(windowHeight - canvasHeight) / 2;
      marginTop = Math.abs(offsetY);
    } else {
      // Canvas height is bigger than window - use negative margin to center
      offsetY = (canvasHeight - windowHeight) / 2;
      marginTop = -offsetY;
    }

    // Apply panning offset
    marginLeft += canvasPanX;
    marginTop += canvasPanY;

    // Apply positioning - canvas stays at native size, just positioned
    canvas.style.marginLeft = marginLeft + 'px';
    canvas.style.marginTop = marginTop + 'px';

    // Overlay matches the canvas position and size
    overlay.width = canvasWidth;
    overlay.height = canvasHeight;
    overlay.style.marginLeft = marginLeft + 'px';
    overlay.style.marginTop = marginTop + 'px';
  }

  function panCanvas(dx, dy) {
    canvasPanX += dx;
    canvasPanY += dy;
    updateCanvasDisplay();
  }

  function openSidebar() {
    elements.sidebar.classList.add('open');
    elements.overlay.classList.add('visible');
  }

  function closeSidebar() {
    elements.sidebar.classList.remove('open');
    elements.overlay.classList.remove('visible');
  }

  // Modal functions
  function showModal(title, message) {
    elements.modalTitle.textContent = title;
    elements.modalMessage.innerHTML = '<p>' + message + '</p>';
    elements.welcomeModal.classList.add('show');
  }

  function hideModal() {
    elements.welcomeModal.classList.remove('show');
  }

  function showWelcomePopup() {
    var message = '<strong>r</strong> : redo stroke,<br/>' +
                  '<strong>u</strong> : undo stroke,<br/>' +
                  '<strong>n</strong> : new image,<br/>' +
                  '<strong>z</strong> : randomiZe parameters,<br/>' +
                  '<strong>arrows</strong> : move canvas.<br/>' +
                  '<br/>' +
                  '<strong>Have a great time drawing! Spread the love!</strong>';
    showModal('Welcome to CraZe!', message);
  }

  function showInfoPopup() {
    var message = 'Made by <a href="https://github.com/zubie7a" target="_blank">Santiago Zubieta</a>.<br/>' +
                  'Visit my <a href="https://www.z10z.xyz" target="_blank">website</a> for nice things!<br/>' +
                  'Also, see the <a href="https://instagram.com/crazeapp" target="_blank">Instagram</a> account, and share images with <strong>#CraZeApp</strong> to get them featured!<br/>' +
                  '<br/>' +
                  '<strong>You are awesome!</strong>';
    showModal('Made with love! 2012-2026', message);
  }

  function showToast(message) {
    // Simple toast notification (like iOS)
    var toast = document.createElement('div');
    toast.textContent = message;
    toast.style.cssText = 'position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%); ' +
                          'background: rgba(0, 0, 0, 0.8); color: white; padding: 12px 24px; ' +
                          'border-radius: 8px; z-index: 10000; font-size: 14px; pointer-events: none;';
    document.body.appendChild(toast);
    setTimeout(function() {
      toast.style.opacity = '0';
      toast.style.transition = 'opacity 0.3s';
      setTimeout(function() {
        document.body.removeChild(toast);
      }, 300);
    }, 2000);
  }

  function randomizeParameters() {
    Parameters.randomize(engine, crazeController, elements, showToast);
  }

  function getCanvasCoords(e) {
    var canvas = elements.mainCanvas;
    var rect = canvas.getBoundingClientRect();
    var scaleX = canvas.width / rect.width;
    var scaleY = canvas.height / rect.height;

    var clientX, clientY;
    if (e.touches && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  }

  function handleMouseDown(e) {
    if (!engine) return;

    if (crazeController && crazeController.active) {
      crazeController.stop();
      elements.crazeBtn.classList.remove('active');
    }
    if (handsFreeActive) {
      stopHandsFree();
    }

    var coords = getCanvasCoords(e);

    if (changeCenterMode) {
      engine.setCenter(coords.x, coords.y);
      changeCenterMode = false;
      elements.canvasContainer.classList.remove('center-mode');
      return;
    }

    engine.onMouseDown(coords.x, coords.y);
  }

  function handleMouseMove(e) {
    if (!engine || !engine.drawing) return;
    var coords = getCanvasCoords(e);
    engine.onMouseMove(coords.x, coords.y);
  }

  function handleMouseUp() {
    if (!engine) return;
    engine.onMouseUp();
  }

  function newImage() {
    if (crazeController && crazeController.active) {
      crazeController.stop();
      elements.crazeBtn.classList.remove('active');
    }
    if (handsFreeActive) {
      stopHandsFree();
    }

    var canvas = elements.mainCanvas;
    var bigdim = Math.max(window.innerHeight, window.innerWidth);
    canvas.width = bigdim;
    canvas.height = bigdim;
    engine.clearCanvas();
    engine.resetCenter();
    updateCanvasDisplay();
    closeSidebar();
  }

  function saveImage() {
    var dataUrl = elements.mainCanvas.toDataURL('image/jpeg');
    var link = document.createElement('a');
    link.download = 'craze-' + Date.now() + '.jpg';
    link.href = dataUrl;
    link.click();
  }

  function toggleCrazeMode() {
    CrazeMode.toggle(crazeController, handsFreeActive, stopHandsFree, elements.crazeBtn);
  }

  // HandsFree functions
  function drawHandsOnOverlay(landmarks) {
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

  function startHandsFree() {
    if (typeof window.Handsfree === 'undefined') {
      alert('HandsFree library is not loaded. Please check your internet connection and refresh.');
      return;
    }

    if (crazeController && crazeController.active) {
      crazeController.stop();
      elements.crazeBtn.classList.remove('active');
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
          var ctx = elements.overlayCanvas.getContext('2d');
          ctx.clearRect(0, 0, elements.overlayCanvas.width, elements.overlayCanvas.height);
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
      elements.handsBtn.classList.add('active');
    } catch (error) {
      console.error('Error initializing HandsFree:', error);
      alert('Error starting hand detection. Please check camera permissions.');
    }
  }

  function stopHandsFree() {
    // Stop all active hand strokes
    for (var handIndex in activeHands) {
      if (engine) engine.onMouseUp('hand' + handIndex);
    }
    activeHands = {};
    
    // Also stop default stroke if active
    if (engine) engine.onMouseUp();

    var ctx = elements.overlayCanvas.getContext('2d');
    ctx.clearRect(0, 0, elements.overlayCanvas.width, elements.overlayCanvas.height);

    if (handsFreeInstance) {
      try {
        if (handsFreeInstance.pause) handsFreeInstance.pause();
        setTimeout(function() {
          if (handsFreeInstance && handsFreeInstance.stop) handsFreeInstance.stop();
          handsFreeInstance = null;
        }, 100);
      } catch (e) { /* ignore */ }
    }

    handsFreeActive = false;
    elements.handsBtn.classList.remove('active');
  }

  function toggleHandsFree() {
    if (handsFreeActive) {
      stopHandsFree();
    } else {
      startHandsFree();
    }
  }

  function setupEventListeners() {
    // Sidebar
    elements.menuToggle.addEventListener('click', function(e) {
      e.preventDefault();
      openSidebar();
    });
    elements.closeSidebar.addEventListener('click', function(e) {
      e.preventDefault();
      closeSidebar();
    });
    elements.overlay.addEventListener('click', function(e) {
      e.preventDefault();
      closeSidebar();
    });

    // Canvas events
    var canvas = elements.mainCanvas;
    canvas.addEventListener('mousedown', function(e) {
      e.preventDefault();
      handleMouseDown(e);
    });
    canvas.addEventListener('mousemove', function(e) {
      if (engine && engine.drawing) {
        e.preventDefault();
      }
      handleMouseMove(e);
    });
    canvas.addEventListener('mouseup', function(e) {
      e.preventDefault();
      handleMouseUp(e);
    });
    canvas.addEventListener('mouseleave', function(e) {
      e.preventDefault();
      handleMouseUp(e);
    });
    canvas.addEventListener('touchstart', function(e) { e.preventDefault(); handleMouseDown(e); });
    canvas.addEventListener('touchmove', function(e) { e.preventDefault(); handleMouseMove(e); });
    canvas.addEventListener('touchend', function(e) {
      e.preventDefault();
      handleMouseUp(e);
    });
    
    // Prevent context menu on canvas (right-click menu)
    canvas.addEventListener('contextmenu', function(e) {
      e.preventDefault();
    });
    
    // Prevent drag and drop on canvas
    canvas.addEventListener('dragstart', function(e) {
      e.preventDefault();
    });
    
    // Prevent double-click selection
    canvas.addEventListener('selectstart', function(e) {
      e.preventDefault();
    });

    // Buttons
    elements.newBtn.addEventListener('click', function(e) {
      e.preventDefault();
      newImage();
    });
    elements.saveBtn.addEventListener('click', function(e) {
      e.preventDefault();
      saveImage();
    });
    elements.undoBtn.addEventListener('click', function(e) {
      e.preventDefault();
      if (engine) engine.undo();
    });
    elements.redoBtn.addEventListener('click', function(e) {
      e.preventDefault();
      if (engine) engine.redo();
    });
    elements.crazeBtn.addEventListener('click', function(e) {
      e.preventDefault();
      toggleCrazeMode();
    });
    elements.handsBtn.addEventListener('click', function(e) {
      e.preventDefault();
      toggleHandsFree();
    });
    elements.randomizeBtn.addEventListener('click', function(e) {
      e.preventDefault();
      randomizeParameters();
    });
    elements.infoBtn.addEventListener('click', function(e) {
      e.preventDefault();
      showInfoPopup();
      closeSidebar();
    });

    elements.setCenterBtn.addEventListener('click', function(e) {
      e.preventDefault();
      changeCenterMode = true;
      elements.canvasContainer.classList.add('center-mode');
      closeSidebar();
    });

    elements.resetCenterBtn.addEventListener('click', function(e) {
      e.preventDefault();
      if (engine) engine.resetCenter();
    });

    // Advanced toggle
    elements.advancedToggle.addEventListener('click', function(e) {
      e.preventDefault();
      elements.advancedSection.classList.toggle('open');
      elements.advancedArrow.textContent = elements.advancedSection.classList.contains('open') ? '▲' : '▼';
    });

    // Modal
    elements.modalOkBtn.addEventListener('click', function(e) {
      e.preventDefault();
      hideModal();
    });
    elements.welcomeModal.querySelector('.modal-backdrop').addEventListener('click', function(e) {
      e.preventDefault();
      hideModal();
    });

    // Selects
    elements.brushSelect.addEventListener('change', function(e) {
      if (engine) engine.updateSetting('brush', parseInt(e.target.value));
    });

    elements.paletteSelect.addEventListener('change', function(e) {
      var value = parseInt(e.target.value);
      if (engine) engine.updateSetting('palette', value);
      elements.colorPicker.style.display = value === PALETTES.MANUAL ? 'block' : 'none';
    });

    // Sliders
    elements.alphaSlider.addEventListener('input', function(e) {
      elements.alphaValue.textContent = e.target.value;
      if (engine) engine.updateSetting('alpha', parseInt(e.target.value));
    });

    elements.sizeSlider.addEventListener('input', function(e) {
      elements.sizeValue.textContent = e.target.value;
      if (engine) engine.updateSetting('brushSize', parseInt(e.target.value));
    });

    elements.rotSlider.addEventListener('input', function(e) {
      elements.rotValue.textContent = e.target.value;
      if (engine) engine.updateSetting('rotationAmount', parseInt(e.target.value));
    });

    elements.thickSlider.addEventListener('input', function(e) {
      elements.thickValue.textContent = e.target.value;
      if (engine) engine.updateSetting('thickness', parseInt(e.target.value));
    });

    // Toggles
    elements.symmetryToggle.addEventListener('change', function(e) {
      if (engine) engine.updateSetting('symmetry', e.target.checked);
    });

    elements.variableToggle.addEventListener('change', function(e) {
      if (engine) engine.updateSetting('variableSize', e.target.checked);
    });

    elements.rotatingToggle.addEventListener('change', function(e) {
      if (engine) engine.updateSetting('rotatingShape', e.target.checked);
    });

    elements.connectToggle.addEventListener('change', function(e) {
      if (engine) engine.updateSetting('connectBorders', e.target.checked);
    });

    elements.fillToggle.addEventListener('change', function(e) {
      if (engine) engine.updateSetting('fillShape', e.target.checked);
    });

    elements.fadeToggle.addEventListener('change', function(e) {
      if (engine) engine.updateSetting('fadingImage', e.target.checked);
    });

    elements.gridToggle.addEventListener('change', function(e) {
      if (engine) engine.updateSetting('fitToGrid', e.target.checked);
    });

    elements.perspectiveToggle.addEventListener('change', function(e) {
      if (engine) engine.updateSetting('perspectiveSize', e.target.checked);
    });

    // Color picker
    elements.colorInput.addEventListener('input', function(e) {
      var hex = e.target.value;
      elements.colorText.value = hex;
      var r = parseInt(hex.slice(1, 3), 16);
      var g = parseInt(hex.slice(3, 5), 16);
      var b = parseInt(hex.slice(5, 7), 16);
      if (engine) {
        engine.updateSetting('r', r);
        engine.updateSetting('g', g);
        engine.updateSetting('b', b);
      }
    });

    elements.colorText.addEventListener('change', function(e) {
      var hex = e.target.value;
      if (/^#[0-9A-Fa-f]{6}$/.test(hex)) {
        elements.colorInput.value = hex;
        var r = parseInt(hex.slice(1, 3), 16);
        var g = parseInt(hex.slice(3, 5), 16);
        var b = parseInt(hex.slice(5, 7), 16);
        if (engine) {
          engine.updateSetting('r', r);
          engine.updateSetting('g', g);
          engine.updateSetting('b', b);
        }
      }
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
      if (e.key === 'u' || e.key === 'U') { if (engine) engine.undo(); }
      else if (e.key === 'r' || e.key === 'R') { if (engine) engine.redo(); }
      else if (e.key === 'n' || e.key === 'N') { newImage(); }
      else if (e.key === 'z' || e.key === 'Z') { randomizeParameters(); }
      else if (e.key === 'Escape') {
        if (elements.welcomeModal.classList.contains('show')) {
          hideModal();
        } else {
          closeSidebar();
        }
      }
      else if (e.key === 'ArrowUp') {
        e.preventDefault();
        panCanvas(0, -20);
      }
      else if (e.key === 'ArrowDown') {
        e.preventDefault();
        panCanvas(0, 20);
      }
      else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        panCanvas(-20, 0);
      }
      else if (e.key === 'ArrowRight') {
        e.preventDefault();
        panCanvas(20, 0);
      }
    });

    // Window resize
    window.addEventListener('resize', updateCanvasDisplay);
  }

})();
