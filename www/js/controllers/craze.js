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
        'fade' : false,
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

    $scope.getBase64 = function() {
    // Save the canvas. We may need to rework this later for saving into a device.
        //if(canvas) {
        //    canvas.saveImage();
        //}
        canvas.transcribe(); 
        var dataUrl = canvas.getCnv().toDataURL('image/jpeg');
        return dataUrl;
    }

    $scope.base64 = '';
    $scope.fname = 'CrazeAppDrawing';
    $scope.saveImage = function() {
    // To update the href of the anchor for downloading or opening image in a new window.
        if(platform == 'ios') {
            var confirmPromise = System.confirm('Save Image',
                                 'Image will open in a new tab, touch and hold it to save it.');
            confirmPromise.then(
                function(res) {
                    if(res) {
                        canvas.saveImage($scope.getBase64());
                        $ionicSideMenuDelegate.toggleLeft();
                    }
                }
            )
            $scope.base64 = '';
        }
        else {
            $scope.base64 = $scope.getBase64();
        }
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

    var instagram = '<a class="item" href="#" onclick="window.open(\'https://instagram.com/crazeapp\',' +
                                              '\'_system\', \'location=yes\'); return false;">' +
                        'Instagram' +
                    '</a>';

    $scope.z10z = function() {
    // Open the menu modal.
        //$scope.crazemodal.show();
        System.alert('Made with love!',
            'Made by <a href=\'https://github.com/Zubieta\'>Santiago Zubieta</a>.<br/>' +
            'Visit my <a href=\'https://zubieta.github.io/z10z\'>website</a> for nice things!<br/>' +
            'Also, see the <a href=\'https://instagram.com/crazeapp\'>Instagram</a> account, and share images with <strong>#crazeapp</strong> to get them featured!<br/>' +
            '<strong>You are awesome!</strong>'
        );
    }

    $scope.close = function() {
    // Close the menu modal.
        //$scope.crazemodal.hide();
    }

    setTimeout(function() {
        if(platform == 'ios' && !init) {
            init = true;
            System.alert('Welcome to CraZe!', 'Have a great time drawing!');
        }
        else if(platform == 'android' && !init) {
            init = true;
            System.confirm('Version', 'Do you want to go to the Play Store for the app version?')
            .then(function(res) {
                if(res) {
                   window.location.href = "https://play.google.com/store/apps/details?id=com.zubieta.craze";        
                }
                else {
                    System.alert('Welcome to CraZe!', 'Have a great time drawing!');
                }
            });
        }
        else if(!init){
            init = true;
            System.alert('Welcome to CraZe!',
                '<strong>r</strong> : redo stroke,<br/>'+
                '<strong>u</strong> : undo stroke,<br/>'+
                '<strong>n</strong> : new image,<br/>'+
                '<strong>arrows</strong> : move canvas.<br/>'+
                '<strong>more keyboard options soon!</strong><br/> Have a great time drawing!'
            );
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

    function randColors() {
        var arr = [];
        arr.push(randInt(0, 255));
        arr.push(randInt(0, 255));
        arr.push(randInt(0, 255));
        return arr;
    }

    $scope.randomizer = function() {
        $scope.crazeData = {
            'brush'   : randInt(1, 9),
            'palette' : randPalette(),
            'colors' : randColors(),
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
            'alpha' : randInt(50, 80)
        };
        $scope.variableInitializer();
    }

    $scope.changeCenter = function() {
        changeCenter = true;
        System.alert('Change Center', 'Please click on the new center\'s location!');
        $ionicSideMenuDelegate.toggleLeft();
        menuOpen = false;
    }

    $scope.resetCenter = function() {
        $ionicSideMenuDelegate.toggleLeft();
        menuOpen = false;
        resetCenter();
    }

    $scope.undo = function() {
        canvas.undo();
    }

    $scope.redo = function() {
        canvas.redo();
    }

}]);