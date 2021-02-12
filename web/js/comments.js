angular.module('comments', []).directive('comments', function () {
  return {
    restrict: 'E',
    scope: {},
    templateUrl: 'comments.html',
    controller: function ($scope, $http, $attrs) {
            // $scope.Cat = {"CategoryName": $attrs.topic};
      $scope.sz = 100; //comments page size
      $scope.topic = $attrs.topic;
      $scope.loadcomments = function(p){
          $http.get('/api/data/comments?topic='+ $scope.topic +'&p=' + p + "&sz="+$scope.sz)
            .success(function(data, status, headers, config) {
              $scope.cset = data;
              $scope.page = p;
          });
      };
      $scope.addcomment = function(cmt){
          cmt.topic = $scope.topic;
          if (!$scope.empty(cmt.txt)) {
            $http.post('/api/data/comments', cmt).success(function(data, status, headers, config) {
                $scope.loadcomments(1);
            });
            $scope.cmt = null;
          }
      };
      $scope.empty = function (s) {
        return s == null ? true : s.trim() == "" ? true : false;
      };
      $scope.loadcomments(1);
    }
  };
});
angular.module('comments', []).directive('cmtvcase', function () {
  return {
    restrict: 'E',
    scope: {},
    templateUrl: 'cmtvcase.html',
    controller: function ($scope, $http, $attrs) {
            // $scope.Cat = {"CategoryName": $attrs.topic};
      $scope.sz = 100; //comments page size
      $scope.topic = $attrs.topic;
      $scope.fltrmode = false;
      $scope.fltrdata = false;
      $scope.statusopts = ["","RFE","RFE Response Sent","Received","Approved","Name Was Updated","Other"];
      $scope.loadcomments = function(p){
        if ($scope.fltrmode) {
          $http.post('/api/data/comments?action=filter&topic='+ $scope.topic +'&p=' + p + "&sz="+$scope.sz, $scope.fltr)
            .success(function(data, status, headers, config) {
              $scope.cset = data;
              $scope.page = p;
              $scope.fltrdata = true;
          });
        } else {
          $http.get('/api/data/comments?topic='+ $scope.topic +'&p=' + p + "&sz="+$scope.sz)
            .success(function(data, status, headers, config) {
              $scope.cset = data;
              $scope.page = p;
          });
        }
      };
      $scope.filtercomments = function(p){
        $scope.loadcomments(1);
      };
      $scope.showfltr = function(b){
        $scope.fltrmode = b;
      };
      $scope.clearfltr = function(){
          document.getElementById("form2").reset();
          $scope.fltrdata = false;
          $scope.fltrmode = false;
          $scope.loadcomments(1);
      };
      $scope.addcomment = function(cmt){
        cmt.topic = $scope.topic;
        if (!$scope.empty(cmt.txt)) {
          $http.post('/api/data/comments', cmt).success(function(data, status, headers, config) {
              $scope.loadcomments(1);
          });
          $scope.cmt = null;
        }
      };
      $scope.empty = function (s) {
        return s == null ? true : s.trim() == "" ? true : false;
      };
      $scope.loadcomments(1);
    }
  };
});
