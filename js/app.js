angular.module('starter', ['ionic', 'starter.craze',
               'starter.services', 'starter.tabs', 'ngCordova'])
// $ cordova plugin add org.apache.cordova.geolocation
// $ bower install ngCordova
// $ bower install angular-socket-io
// http://ngcordova.com/docs/install/
// http://ngcordova.com/docs/plugins/geolocation/

.run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
        if(window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if(window.StatusBar) {
           StatusBar.styleDefault();
        }
    });
})

.config(['$compileProvider',
function ($compileProvider) {
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|local|data):/);
}])

.config(['$stateProvider', '$urlRouterProvider', '$ionicConfigProvider', 
 function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {


    $ionicConfigProvider.tabs.position('bottom');
    // Because in Android by default it attempts putting the tabs at the
    // top, which is a behavior we don't want if we want consistent be-
    // haviour across platforms.
    
    $ionicConfigProvider.navBar.alignTitle('center');
    // Because in Android by default the navBar title is aligned to the
    // left, which is a behavior we don't want if we want consistent be-
    // havior across platforms.

    $stateProvider

    // Abstract state for the basic tabs of the application, it will
    // contain the views in which to render the tabs, and rendering
    // a tab implies rendering this view, containing the tab.
    .state('tabs', {
        'url' : '/tabs',
        'abstract' : true,
        'template' : '<ion-side-menus><ion-side-menu-content id=\'mainContent\' drag-content=\'false\'><ion-nav-view name=\'tab-craze\'></ion-nav-view></ion-side-menu-content><ion-side-menu side=\'left\' ng-controller=\'CraZeCtrl\'><ion-content id=\'menucontent\'><table class=\'butable\'><tr><td class=\'half\'><button type="button" class=\'button button-positive butn\' ng-click=\'newImage()\'><strong>New</strong> Image</button></td><td class=\'half\'><div><a class=\'button button-balanced butn\' id=\'downloadey\' ng-click=\'saveImage()\' href="{{base64}}" download=\'{{fname}}\'><strong>Save</strong> Image</a></div></td></tr><tr><td class=\'entire\' colspan=\'2\'><button class=\'button button-assertive butn\' ng-click=\'crazeMode()\'><strong>CraZe</strong> Mode</button></td></tr><tr><td class=\'entire\' colspan=\'2\'><button class=\'button button-energized butn\' ng-click=\'handsFreeMode()\'><strong>HandsFree</strong> JS</button></td></tr><tr><td class=\'half\'><button class=\'button butn\' ng-click=\'undo()\'><strong>U</strong>ndo</button></td><td class=\'half\'><button class=\'button butn\' ng-click=\'redo()\'><strong>R</strong>edo</button></td></tr></table><label class=\'item item-dark item-input\'><span class=\'input-label stable\'><strong>Brush</strong></span><select ng-model=\'crazeData.brush\' class=\'selector\' ng-change=\'updateBrush()\'><option value=\'1\'>Regular Line</option><option value=\'2\'>Lines From Start</option><option value=\'3\'>Vertical Lines</option><option value=\'4\'>Horizontal Lines</option><option value=\'5\'>Great Cross</option><option value=\'6\'>Triangles</option><option value=\'7\'>Squares</option><option value=\'8\'>Circles</option><option value=\'9\'>Chain</option><option value=\'10\'>Tangent</option></select></label><label class=\'item item-dark item-input\'><span class=\'input-label stable\'><strong>Palette</strong></span><select ng-model=\'crazeData.palette\' class=\'selector\' ng-change=\'updatePalette()\'><option value=\'1\'>Manual</option><option value=\'2\'>Rainbow</option><option value=\'3\'>Fire</option><option value=\'4\'>Ice</option><option value=\'5\'>Nature</option><option value=\'6\'>Mystic</option><option value=\'7\'>Borealis</option><option value=\'8\'>Grayscale</option><option value=\'9\'>Foxes</option></select></label><label ng-if=\'(crazeData.palette == 1)\' class=\'item range range-assertive item-dark\'><strong>  R</strong><input type=\'range\' value=\'{{crazeData.colors[0]}}\' min=\'0\' max=\'255\' step=\'1\' ng-model=\'crazeData.colors[0]\' ng-change=\'colorChanged(0)\'>{{crazeData.colors[0]}} </label><label ng-if=\'(crazeData.palette == 1)\' class=\'item range range-balanced item-dark\'><strong>  G</strong><input type=\'range\' value=\'{{crazeData.colors[1]}}\' min=\'0\' max=\'255\' step=\'1\' ng-model=\'crazeData.colors[1]\' ng-change=\'colorChanged(1)\'>{{crazeData.colors[1]}} </label><label ng-if=\'(crazeData.palette == 1)\' class=\'item range range-positive item-dark\'><strong>  B</strong><input type=\'range\' value=\'{{crazeData.colors[2]}}\' min=\'0\' max=\'255\' step=\'1\' ng-model=\'crazeData.colors[2]\' ng-change=\'colorChanged(2)\'>{{crazeData.colors[2]}} </label><label ng-if=\'(crazeData.palette == 1)\' class=\'item item-dark item-input\'><span class=\'input-label stable\'><strong>Color</strong></span><input type=\'text\' id=\'coltxt\' readonly/></label><label class=\'item range range-energized item-dark\'><strong>  Transparency</strong><input type=\'range\' value=\'{{crazeData.alpha}}\' min=\'0\' max=\'100\' step=\'1\' ng-model=\'crazeData.alpha\' ng-change=\'alphaChanged()\'>{{crazeData.alpha}} </label><label class=\'item item-dark item-input\'><span class=\'input-label stable\'><strong>Size</strong> of Brush</span><input type=\'number\' value=\'{{crazeData.bsize}}\' style=\'background-color:#FFF; max-width:60px; border-radius: 10px; padding-left:5px;\' min=\'1\' max=\'1742\' step=\'1\' ng-model=\'crazeData.bsize\' ng-change=\'updateSize()\'></label><label class=\'item item-dark item-input\'><span class=\'input-label stable\'><strong>Rotation</strong> Amount</span><input type=\'number\' value=\'{{crazeData.rotnum}}\' style=\'background-color:#FFF; max-width:60px; border-radius: 10px; padding-left:5px;\' min=\'1\' max=\'360\' step=\'1\' ng-model=\'crazeData.rotnum\' ng-change=\'updateRotNum()\'></label><label class=\'item item-dark item-input\'><span class=\'input-label stable\'><strong>Thickness</strong> of Brush</span><input type=\'number\' value=\'{{crazeData.thickness}}\' style=\'background-color:#FFF; max-width:60px; border-radius: 10px; padding-left:5px;\' min=\'1\' max=\'7\' step=\'1\' ng-model=\'crazeData.thickness\' ng-change=\'updateThick()\'></label><ul class="list"><li class="item item-toggle item-dark"><strong>Symmetry</strong> Axis<label class="toggle toggle-positive"><input type="checkbox" ng-model=\'crazeData.symmetry\' ng-change=\'updateSymmetry()\'><div class="track"><div class="handle"></div></div></label></li><li class="item item-toggle item-dark"><strong>Variable</strong> Size<label class="toggle toggle-calm"><input type="checkbox" ng-model=\'crazeData.variable\' ng-change=\'updateVariable()\'><div class="track"><div class="handle"></div></div></label></li><li class="item item-toggle item-dark"><strong>Rotating</strong> Shape<label class="toggle toggle-balanced"><input type="checkbox" ng-model=\'crazeData.rotating\' ng-change=\'updateRotating()\'><div class="track"><div class="handle"></div></div></label></li><li class="item item-toggle item-dark"><strong>Connect</strong> Borders<label class="toggle toggle-energized"><input type="checkbox" ng-model=\'crazeData.connect\' ng-change=\'updateConnect()\'><div class="track"><div class="handle"></div></div></label></li><li class="item item-toggle item-dark"><strong>Fill</strong> Shape<label class="toggle toggle-assertive"><input type="checkbox" ng-model=\'crazeData.fill\' ng-change=\'updateFill()\'><div class="track"><div class="handle"></div></div></label></li><li class="item item-toggle item-dark"><strong>Fading</strong> Image<label class="toggle toggle-royal"><input type="checkbox" ng-model=\'crazeData.fade\' ng-change=\'updateFade()\'><div class="track"><div class="handle"></div></div></label></li><li class="item item-toggle item-dark"><strong>Fit</strong> to Grid<label class="toggle toggle-positive"><input type="checkbox" ng-model=\'crazeData.grid\' ng-change=\'updateGrid()\'><div class="track"><div class="handle"></div></div></label></li><li class="item item-toggle item-dark"><strong>Perspective</strong> Size<label class="toggle toggle-energized"><input type="checkbox" ng-model=\'crazeData.pers\' ng-change=\'updatePers()\'><div class="track"><div class="handle"></div></div></label></li><li><table class=\'butable\'><tr><td class=\'half\'><button class=\'button button-royal butn\' ng-click=\'changeCenter()\'><strong>Change</strong> Center</button></td><td class=\'half\'><button class=\'button button-calm butn\' ng-click=\'resetCenter()\'><strong>Reset</strong> Center</button></td></tr></table></li></ul></ion-content></ion-side-menu><ion-side-menu side=\'right\'></ion-side-menu></ion-side-menus>',
        'controller' : 'TabsCtrl'
    })

    .state('tabs.craze', {
        'url' : '/craze',
        'views' : {
            'tab-craze' : {
                'template' : '<ion-view view-title=\'CraZe\'><ion-nav-buttons side=\'right\'><button class=\'button button-clear\' ng-click=\'z10z()\'>Info!</button></ion-nav-buttons><ion-nav-buttons side="left"><button class="button button-icon icon ion-navicon" ng-click="toggleMenu()"> Menu</button></ion-nav-buttons><ion-content scroll=\'false\'><div style="position: relative;"><canvas id=\'myCanvas\' style="margin-top: -42px;"></canvas><canvas id=\'handsOverlayCanvas\' style="position: absolute; top: 0; left: 0; pointer-events: none; margin-top: -42px;"></canvas></div></ion-content></ion-view>',
                'controller' : 'CraZeCtrl'
            }
        }
    })

    // Default router. I'll look up later some way to route to an initial
    // temporal state which will check for the token and then redirect to
    // the home view, if not, redirect to signin, all this with LocalStorage,
    // or make signin first check for the local storage and then redirecting,
    // But then it could hang in a signin screen whereas we could have a pse-
    // udo 'splash' screen that will be there only when resolving whether to
    // go to signin view or check the token and go to home view.
    $urlRouterProvider.otherwise('tabs/craze');
}]);
