angular.module('statsApp', ['ngRoute', 'ngAnimate', 'ui.bootstrap', 'comments', 'usermodule']);
angular.module('statsApp').config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/welcome', {templateUrl: 'welcome.html'});
  $routeProvider.when('/contrib', {templateUrl: 'contrib.html'});
  $routeProvider.when('/404', {templateUrl: '404.html'});
  // $routeProvider.when('/vcases/:vcaseid', {templateUrl: 'vcaseform.html', controller: 'vcaseformCtrl'});
  // default
  $routeProvider.otherwise({redirectTo: '/welcome'});
}]);
function getTemp(rep) {
    return "/api/temp/rep?a=" + rep;
}
angular.module('statsApp').run(
['$rootScope', '$templateCache',
function($rootScope, $templateCache) {
  $rootScope.$on('$routeChangeStart', function(event, next, current){
      $templateCache.removeAll();
  });
   $rootScope.$on('$viewContentLoaded', function() {
      $templateCache.removeAll();
   });
   // togglesb();
   google.charts.load("current", {packages:["corechart", "line"]});
      // google.charts.load('current', {'packages':['line']});

}]);

// interceptor
angular.module('statsApp').config(['$httpProvider', function($httpProvider) {
  $httpProvider.interceptors.push(function($q, $location) {
    return {
      request: function(req) {
            // var token = localStorage.getItem('api_token');
            // if (token != null) {
            //     req.headers['api_token'] = localStorage.getItem('api_token');
            // }

        console.log("req=" + req.url);
        return req;
      },
        responseError: function(rejection) {
        console.log("error:" + rejection);
            if(rejection.status === 404){
                $location.path('/404');                    
            }
            return $q.reject(rejection);
         },

        response: function(res) {
    		console.log("res-status="+res.status);
        switch (res.status) {
          case 200:
			     return res;
          // case 401:
          // case 403:
          //   $location.path('/login');
            break;
          case 404:
            $location.path('/404');
            break;
          default:
            $location.path('/error');
        }
	  }
    };
  })
}]);
// filters
angular.module('statsApp').filter('range', function() {
  return function(input, total) {
    total = parseInt(total);
    for (var i=0; i<total; i++) {
      input.push(i);
    }
    return input;
  };
});
angular.module('statsApp').filter('plus', function() {
    return function(value) {
        return value > 0 ? "+" + value : value;
    }
});
angular.module('statsApp').filter('rounded', function() {
    return function(value) {
        return parseInt(value, 10);
    }
});
angular.module('statsApp').filter('reverse', function() {
  return function(items) {
    return items.slice().reverse();
  };
});

