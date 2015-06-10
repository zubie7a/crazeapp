angular.module('starter', ['ionic', 'starter.craze',
               'starter.services', 'starter.tabs', 'ngCordova', 'btford.socket-io'])
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
        'templateUrl' : 'templates/tabs.html',
        'controller' : 'TabsCtrl'
    })

    .state('tabs.craze', {
        'url' : '/craze',
        'views' : {
            'tab-craze' : {
                'templateUrl' : 'templates/tab-craze.html',
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
