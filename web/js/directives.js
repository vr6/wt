angular.module('comments', []).directive('comments', function () {
  return {
    restrict: 'E',
    scope: {},
    templateUrl: '../comments.html',
    controller: function ($scope, $http, $attrs) {
            // $scope.Cat = {"CategoryName": $attrs.topic};
      $scope.sz = 50; //comments page size
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
