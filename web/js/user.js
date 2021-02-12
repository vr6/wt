angular.module('usermodule', ['ui.bootstrap']);
angular.module('usermodule').factory('usersvc',
['$http', '$rootScope', '$uibModal', function($http, $rootScope, $uibModal) {
  return {
    apps:function(fn){
      var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: '../app/apps.html',
        controller: 'appsCtrl',
        size: 'sm'
      });
      modalInstance.result.then(function (ret) {
        console.log("dlgret="+ret);
        fn(ret); 
      }, function () {
        console.log('Modal dismissed');
        fn("cancel");
      });
    },
    login:function(fn){
      var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: '../app/login.html',
        controller: 'logindlgCtrl',
        size: 'sm'
      });
      modalInstance.result.then(function (status) {
        console.log("loginst="+status);
        fn(status); 
      }, function () {
        console.log('Modal dismissed');
        fn("cancel");
      });
    },
    signup:function(fn){
      var modalInstance = $uibModal.open({
          animation: true,
          templateUrl: '../app/signup.html',
          controller: 'addAccountCtrl',
          size: 'sm'
      });
      modalInstance.result.then(function (status) {
        console.log("signupst="+status);
        fn(status); 
      }, function () {
        fn("cancel");
      });
    },
    logout:function(fn){
      $http.post('/api/user?a=logout').success(function(data, status, headers, config) {
        fn("success"); 
      });
    },
    setprof:function(profid, fn){
      $http.post('/api/user?a=setprof&profid=' + profid).success(function(data, status, headers, config) {
        console.log("profile=" + data);
        localStorage.setItem('wtprofile', JSON.stringify(data));
        fn("success"); 
      });
    },
    checklogin:function(fn){
      $http.get('/api/user?a=checklogin').success(function(data, status, headers, config) {
        fn(data); 
      });
    }
  }
}]);
angular.module('usermodule').controller('addAccountCtrl', 
  function ($scope, $http, $uibModalInstance) {
  $scope.error = "";

  $scope.ok = function () {
    var user = $scope.user;
    // if (user.type == undefined || user.type == null) {
    //     $scope.error = "Please specify if you are a work provider.";
    //     return;
    // }
    var email_regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i;
    if(!email_regex.test(user.email)) {
        $scope.error='Invalid email address';
        return;
    }
    if (user.userid == null || user.userid.trim().length < 4) {
        $scope.error='User id needs atleast 4 letters';
        return;
    }
    if (user.pass == null || user.pass.trim().length < 6) {
        $scope.error='Password needs atleast 6 letters';
        return;
    }
    if (user.pass != user.pass2) {
        $scope.error='Passwords do not match';
        return;
    }
    // if (!user.accept) {
    //     $scope.error='Please accept the terms of use.';
    //     return;
    // }
    $http.get('/api/user?a=checkuserid&id=' + user.userid).success(function(data, status, headers, config) {
      console.log(data.status);
        if (data.status == "success") {
          $http.post('/api/user?a=signup', user).success(function(data, status, headers, config) {
            $uibModalInstance.close("success");
          });
        } else if (data.status == "id_exists") {
          $scope.error='That user id is already taken. Please try a different one.';
          return;
        }
    });
  };
  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
});
angular.module('usermodule').controller('logindlgCtrl', 
  function ($scope, $http, $window, $uibModalInstance) {
  $scope.error = "";

  $scope.ok = function () {
    var user = $scope.user;
    if (user.userid == null || user.userid.trim().length < 4) {
        $scope.error='User id needs atleast 4 letters';
        return;
    }
    if (user.pass == null || user.pass.trim().length < 6) {
        $scope.error='Password needs atleast 6 letters';
        return;
    }
    var authdata = $window.btoa(user.userid + ":" + user.pass);
    console.log("authdata="+authdata);
    $http.defaults.headers.common['Authorization'] = 'Basic ' + authdata;
    $http.post('/api/user?a=login')
    .success(function(data, status, headers, config) {
        if(data == null) {
            $scope.error='Error while logging in. Please try again later.';
            return;
        }
       $uibModalInstance.close("success");
    })
    .error(function (error, status){
      if (status == 401) {
          $scope.error='Invalid input. Please try again.';
          return;
      }
    });
  };
  $scope.cancel = function () {
    $uibModalInstance.dismiss("cancel");
  };
});
angular.module('usermodule').controller('appsCtrl', 
  function ($scope, $uibModalInstance) {
  $scope.error = "";

  $scope.ok = function (app) {
    console.log("ok="+app);
    $uibModalInstance.close(app);
  };
  $scope.cancel = function () {
    $uibModalInstance.dismiss("cancel");
  };
});
