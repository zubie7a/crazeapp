angular.module('starter.profile', ['ionic'])

.controller('ProfileCtrl',['User', 'System', 'Profile', 'Camera',
                           '$state', '$scope', '$rootScope', '$cordovaCamera',
             function(User, System, Profile, Camera,
                      $state, $scope, $rootScope, $cordovaCamera) {
// The controller for the profile view, where a user can see its name, its
// phone, its ratings, and set a distance limiter for the matching process.
     
    $scope.profileData = {};
    $scope.platform = ionic.Platform.platform();

    $scope.signOut = function() {
        User.signOut();
        $state.go('signin');
    }

    $scope.getPhoto = function(email) {
    // Get a photo from a given user.
        var getPromise = Profile.getPhoto(email);
        getPromise.success(function(res) {
            if(res.status == true) {
                $scope.profileData.photo = res.photo;
            }
            else {
            // A false 'status' means either absent auth token, invalid token, or
            // the token has expired, so lets clear cache and go to signin view.
                $state.go('signin');
            }
        })
        .error(function(err) {
            System.alert(err.data);
        });
    }

    $scope.updateFields = function() {
        var user = User.getUser();
        $scope.profileData.email = user.email;
        $scope.profileData.uname = user.uname;
        $scope.profileData.phone = user.phone;
        $scope.getPhoto(user.email);
    }
    $scope.updateFields();

    $rootScope.$on('updateFields', function(event, data) {
    // This is supposed to be called after the rootScope broadcasts an
    // event to all its children. This is so when we return from the
    // request creation view, the list of requests is updated.
        $scope.updateFields();
    });

    $scope.distance = {
        'min'   : 0,
        'max'   : 50,
        'step'  : 0.5,
        'value' : Profile.getDistance()
    }

    $scope.distanceChange = function() {
    // Update the value for matching distance limit based on a slider.
        Profile.setDistance($scope.distance.value);
    }

    $scope.updateInfo = function() {
    // Update the phone number field and perhaps other fields later.
        var phone = $scope.profileData.phone;
        if(!phone) {
            System.alert("Please fill all fields.");
            return;
        }
        var updatePromise = Profile.updateInfo(phone);
        // Call the service that will update the user information in the server.
        updatePromise.success(function(res) {
            if(res.status == true) {
                User.setUser(res.user);
                $scope.updateFields();
            }
            else {
            // A false 'status' means either absent auth token, invalid token, or
            // the token has expired, so lets clear cache and go to signin view.
                $state.go('signin');
            }
        })
        .error(function(err) {
            System.alert(err.data);
        });
    }

    $scope.takePicture = function() {
    // Take a picture and upload it to the server.
        if($scope.platform == 'ios' || $scope.platform == 'android') {
            Camera.getPhoto({
                quality: 75,
                targetWidth: 320,
                correctOrientation: true,
                saveToPhotoAlbum: false,
                allowEdit : true,
                destinationType: 0,
                popoverOptions: CameraPopoverOptions,
                sourceType: 1
            }).then(function(imageURI) {
                var photo = 'data:image/jpeg;base64,' + imageURI
                var submitPromise = Profile.submitPhoto(photo);
                submitPromise.success(function(res) {
                    if(res.status == true) {
                        $scope.updateFields();
                    }
                    else {
                    // A false 'status' means either absent auth token, invalid token, or
                    // the token has expired, so lets clear cache and go to signin view.
                        $state.go('signin');
                    }
                })
                .error(function(err) {
                    System.alert(err.data);
                });
            },
            function(err) {
                console.err(err);
            });
        }
    }
}]); 