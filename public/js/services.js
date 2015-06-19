var server = 'http://localhost:3000';

angular.module('starter.services', ['btford.socket-io'])

.factory('System', ['$ionicPopup', 
         function($ionicPopup) {
// The service for system related stuff, such as displaying popups for alert or
// confirmation messages for all sorts of operations.
    return {
        alert : function(message) {
        // For displaying beautiful alerts, not using the default alert window.
            var text = '<p align=\'center\'>' + message + '</p>';
            var alertPopup = $ionicPopup.alert({
                'title' : 'Warning!',
                'template' : text
            });
            alertPopup.then(function(res) {
            });
        },
        alert : function(title, message) {
        // For displaying beautiful alerts, not using the default alert window.
            var text = '<p align=\'center\'>' + message + '</p>';
            var alertPopup = $ionicPopup.alert({
                'title' : title,
                'template' : text,
                'okType' : 'button-balanced'
            });
            alertPopup.then(function(res) {
            });
        },
        confirm : function(type, message) {
            var text = '<p align=\'center\'>' + message + '</p>';
            var title = 'Confirm ' + type;
            return confirmPopup = $ionicPopup.confirm({
                'title' : title,
                'template' : text,
                'okType' : 'button-balanced',
                'cancelType' : 'button-assertive'
            })
            .then(function(res) {
                if(res) {
                    return true;
                }
                else {
                    return false;
                }
            })
        },
        prompt : function(title, message, placeholder) {
            var text = '<p align=\'center\'>' + message + '</p>';
            $ionicPopup.prompt({
                'title' : title,
                'template' : text,
                'inputType' : text,
                'inputPlaceholder' : placeholder,
                'okType' : 'button-balanced',
                'cancelType' : 'button-assertive'
            })
            .then(function(res) {
                return res;
            });
        }
    };
}])

.factory('User', ['System', 'LocalStorage', 
                  '$http', '$ionicHistory',
         function(System, LocalStorage, 
                  $http, $ionicHistory) {
// These will be the services related to the User functionality, such as signing
// in~up an user, retrieving the user token for authentication, etc.
    return {
        getUser : function() {
        // All the functionality that depends on sessions will retrieve this
        // object from LocalStorage to check the auth token.
            return LocalStorage.getObject('user');
        },
        setUser : function(user) {
        // This function will set the user after a successful login in the
        // SigninCtrl, the variable will hold the email and the auth token.
            LocalStorage.setObject('user', user);
        },
        signOut : function() {
        // This will destroy the object that holds the email and auth token,
        // so that all the functionalities that work by retrieving it will
        // not be able any longer to use it, terminating the session.
            $ionicHistory.clearCache();
            LocalStorage.setObject('user', null);
        }
    };
}])

.factory('LocalStorage', ['$window', 'System',
        function($window,
                 System) {
// For avoiding constant parsing and writing of localStorage methods.
    return {
        setValue : function(key, value) {
            $window.localStorage[key] = value;
        },
        getValue : function(key, defaultValue) {
            return $window.localStorage[key] || defaultValue;
        },
        setObject : function(key, object) {
            $window.localStorage[key] = JSON.stringify(object);
        },
        getObject : function(key) {
            return JSON.parse($window.localStorage[key], null);
        },
        getUser : function() {
            return JSON.parse($window.localStorage['user'], null);
        }
    };
}])

.factory('Profile', ['LocalStorage', 'User', 'System', '$http',
         function(LocalStorage, User, System,
                  $http) {
// For all communications regarding user profile information.
    return {
        setDistance : function(distance) {
        // Store the distance we want as a limit for getting results.
            LocalStorage.setValue('distance', distance);
        },
        getDistance : function() {
        // Get the distance we want as a limit for getting results.
        // If no distance is defined in the storage, lets use the default
        // max value.
            return LocalStorage.getValue('distance', 50);
        },
        updateInfo : function(phone) {
        // Update the user phone in the server.
            var user = User.getUser();
            return $http({
                'method' : 'POST',
                'url' : server + '/profile/updateInfo',
                'data' : {
                    'user'  : user,
                    'phone' : phone
                }
            })
            .success(function(res) {
                return res;
            })
            .error(function(res) {
                return { 'data' : 'There\'s no connection to the server.' };
            });
        },
        submitPhoto : function(photo) {
            var user = User.getUser();
            return $http({
                'method' : 'POST',
                'url' : server + '/profile/submitPhoto',
                'data' : {
                    'user' : user,
                    'photo' : photo
                }
            })
            .success(function(res) {
                return res;
            })
            .error(function(res) {
                return { 'data' : 'There\'s no connection to the server.' };
            })
        },
        getPhoto : function(email, index) {
            var user = User.getUser();
            return $http({
                'method' : 'POST',
                'url' : server + '/profile/photo',
                'data' : {
                    'user' : user,
                    'email' : email
                }
            })
            .success(function(res) {
                res['index'] = index;
                return res;
            })
            .error(function(res) {
                return { 'data' : 'There\'s no connection to the server.' };
            })
        }
    };
}])

.factory('Camera', ['$q', '$http', 'System', function($q, $http, System) {
// For accessing the camera hardware.
    return {
        getPhoto : function(options) {
            var q = $q.defer();
            navigator.camera.getPicture(function(result) {
                // Do any magic you need
                q.resolve(result);
            },
            function(err) {
                q.reject(err);
            },
            options);
            return q.promise;
        }
    };
}])


.factory('Socket', ['socketFactory', 'User', '$rootScope', 
         function(socketFactory, User, $rootScope){
// For dealing with Socket.io connections with the server

    //var myIoSocket = io.connect('http://chat.socket.io');
    var myIoSocket = io.connect(server);
    //Create socket and connect to our desired server.

    var mySocket = socketFactory({
        'ioSocket' : myIoSocket
    });

    var user = User.getUser();

    mySocket.on('connect', function() {
    // When the application connects with the server, send the email of this particular
    // user so that the server relates it to the socket used in this connection.
        mySocket.emit('register', user.email);
    });

    mySocket.on('message', function(data) {
    // When a message is received, store it in the array where it belongs.
        $rootScope.$broadcast('receiveMessage', data);
    });

    return mySocket;
}]);