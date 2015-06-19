var init = false;

angular.module('starter.craze', [])


.controller('CraZeCtrl', ['User', 'LocalStorage', 'System', 'Profile',
                          '$state', '$scope', '$rootScope', '$ionicLoading', '$ionicHistory', '$ionicModal', '$ionicSideMenuDelegate',
                  function(User, LocalStorage, System, Profile,
                           $state, $scope, $rootScope, $ionicLoading, $ionicHistory, $ionicModal, $ionicSideMenuDelegate) {
// The controller of the drawing view.

    $scope.hints = false;
    // For enabling or disabling hints.

    platform = ionic.Platform.platform();
    $scope.plat = platform;
    if(platform == 'android') {
        //window.location.href = "https://play.google.com/store/apps/details?id=com.zubieta.craze";        
    }

    $scope.toggleHints = function() {
        $scope.hints = !($scope.hints);
    }

    $scope.crazeData = {
    // This is the data that will control the application parameters and be stored later
    // in LocalStorage so that these aren't lost between sessions.
        'symmetry' : true,
        'brush' : 1,
        'variable' : false,
        'rotating' : false,
        'connect' : false,
        'fill' : false,
        'fade' : true,
        'grid' : false,
        'palette' : 2,
        'bsize' : 42,
        'rotnum' : 6,
        'thickness' : 1,
        'colors' : [255, 255, 255],
        'alpha' : 50
    };

    $scope.mouseDown = function() {
    // This event is triggered from actions over a certain canvas, use it to call
    // some global methods located in a javascript file.
        mousedown(null);
    }

    $scope.mouseMove = function() {
    // This event is triggered from actions over a certain canvas, use it to call
    // some global methods located in a javascript file.
        mousemove(null);
    }

    $scope.mouseOut = function() {
    // This event is triggered from actions over a certain canvas, use it to call
    // some global methods located in a javascript file.
        mouseout(null);
    }

    $scope.mouseUp = function() {
    // This event is triggered from actions over a certain canvas, use it to call
    // some global methods located in a javascript file.
        mouseup(null);
    }

    $scope.newImage = function() {
    // Clear the canvas.
        if(canvas) {
            canvas.drawNewImage();
        }
    }

    $scope.base64 = "";
    $scope.getBase64 = function() {
    // Save the canvas. We may need to rework this later for saving into a device.
        //if(canvas) {
        //    canvas.saveImage();
        //}
        canvas.transcribe();
        var dataUrl = cnv.toDataURL("image/jpeg");
        System.alert("Hey", dataUrl.substring(0, 20));
        //return canvas.toDataURL("image/jpeg");
    }

    $scope.saveImage = function() {
        System.alert('Save Image', 'Right Click on the image to save it!');
    }

    $scope.crazeMode = function() {
    // Toggle the crazeMode!
        if(canvas) {
            crazeMode();
        }
    }

    $scope.updateBrush = function() {
    // Update the selected Brush value.
        updateBrush($scope.crazeData.brush);
    }

    $scope.updateSymmetry = function() {
    // Update the selected Symmetry boolean.
        updateSymmetry($scope.crazeData.symmetry);
    }

    $scope.updateVariable = function() {
    // Update the selected Variable Size boolean.
        updateVariable($scope.crazeData.variable);
    }

    $scope.updateRotating = function() {
    // Update the selected Rotating Brush boolean.
        updateRotating($scope.crazeData.rotating);
    }

    $scope.updateConnect = function() {
    // Update the selected Connect Borders boolean.
        updateConnect($scope.crazeData.connect);
    }

    $scope.updateFill = function() {
    // Update the selected Shape Fill boolean.
        updateFill($scope.crazeData.fill);
    }

    $scope.updateFade = function() {
    // Update the selected Fading Image boolean.
        updateFade($scope.crazeData.fade);
    }

    $scope.updateGrid = function() {
    // Update the selected Fit to Grid boolean.
        updateGrid($scope.crazeData.grid);
    }

    $scope.updatePalette = function() {
    // Update the selected Color Palette value.
        updatePalette($scope.crazeData.palette)
    }

    $scope.updateSize = function() {
    // Update the inputted Brush Size value.
        updateSize($scope.crazeData.bsize);
    }

    $scope.updateRotNum = function() {
    // Update the inputted rotation number.
        updateRotNum($scope.crazeData.rotnum);
    }

    $scope.updateThick = function() {
    // Update the inputted thickness value.
        updateThick($scope.crazeData.thickness);
    }

    $scope.colorChanged = function(index) {
    // Update the inputted color value.
        var col = $scope.crazeData.colors[index];
        colorChanged(index, col);
    }

    $scope.alphaChanged = function() {
    // Update the inputted alpha value.
        alphaChanged(100 - $scope.crazeData.alpha);
    }

    $scope.variableInitializer = function() {
    // Initialize all the variables from this controller to the drawing math library.
        $scope.updateBrush();
        $scope.updateSymmetry();
        $scope.updateVariable();
        $scope.updateRotating();
        $scope.updateConnect();        
        $scope.updateFill();
        $scope.updateFade();
        $scope.updateGrid();
        $scope.updatePalette();
        $scope.updateSize();
        $scope.updateRotNum();
        $scope.updateThick();
        $scope.colorChanged(0)
        $scope.colorChanged(1)
        $scope.colorChanged(2)
        $scope.alphaChanged();
    }

    $ionicModal.fromTemplateUrl('templates/craze-modal.html', {
    // Set up a modal for displaying more specific information about
    // a request than the 'contracted' view.
        scope: $scope
        //backdropClickToClose: false
    }).then(function(modal) {
        $scope.crazemodal = modal;
    });

    $scope.menu = function() {
    // Open the menu modal.
        $scope.crazemodal.show();
    }

    $scope.close = function() {
    // Close the menu modal.
        $scope.crazemodal.hide();
    }

    setTimeout(function() {
        if(platform == 'ios' && !init) {
            System.alert('Welcome to CraZe!', 'Scroll up the banner to hide the URL bar. Have a great time drawing!');
            init = true;
        }
        $scope.variableInitializer();
        $scope.newImage();
    }, 2000);

    $scope.toggleMenu = function() {
        menuOpen = !menuOpen;
        $ionicSideMenuDelegate.toggleLeft();
    }

    function randInt(min, max) {
    // Random Integer between min and max inclusive.
        max = max + 1;
        return Math.floor(Math.random() * (max - min)) + min;
    }

    function randBool() {
    // Random Boolean.
        return (randInt(0, 1) == 0);
    }

    function randPalette() {
    // Returns a random palette, but the manual palette has 50% chances.
        if(randBool()) {
            return 1;
        }
        else {
            return randInt(2, 9);
        }
    }

    $scope.randomizer = function() {
        $scope.crazeData = {
            'brush'   : randInt(1, 9),
            'palette' : randPalette(),
            'colors' : [randInt(0, 255), randInt(0, 255), randInt(0, 255)],
            'symmetry' : randBool(),
            'variable' : randBool(),
            'rotating' : randBool(),
            'connect' : randBool(),
            'fill' : randBool(),
            'fade' : randBool(),
            'grid' : randBool(),
            'bsize' : randInt(42, 142),
            'rotnum' : randInt(2, 10),
            'thickness' : 1,
            'alpha' : randInt(50, 90)
        };
        $scope.variableInitializer();
    }

    $scope.changeCenter = function() {
        changeCenter = true;
        System.alert("Please click on the new center's location!");
        $ionicSideMenuDelegate.toggleLeft();
        menuOpen = false;
    }

    $scope.resetCenter = function() {
        $ionicSideMenuDelegate.toggleLeft();
        menuOpen = false;
        resetCenter();
    }

}]);