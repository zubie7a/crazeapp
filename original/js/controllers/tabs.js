angular.module('starter.tabs', [])

.controller('TabsCtrl', ['User', 'System',
                         '$state', '$scope', '$rootScope',
            function(User, System,
                     $state, $scope, $rootScope) {
// The controller of the Tabs abstract view, which will contain other views inside it.
// We need this to fire some methods when some actions occurr on the 'bigger' scope,
// like changing between tabs and stuff.
}]);