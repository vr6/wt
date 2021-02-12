angular.module('statsApp').controller('progressCtrl', function ($http, $scope) {
  $http.get('/api/data/vcases/progress').success(function(data, status, headers, config) {
    $scope.prog = data;
    $scope.progshow = 0;
    $scope.pdata = [null,null,null,null];
    $scope.progswitch = function (idx) {
      $scope.progshow = idx;
      var chart = new google.charts.Line(document.getElementById('progdiv'));
      chart.draw($scope.pdata[idx].data, $scope.pdata[idx].options);
    };
    google.charts.setOnLoadCallback( function () {
      var data = new google.visualization.DataTable();
      data.addColumn('date', 'Date');
      data.addColumn('number', 'EAC');
      data.addColumn('number', 'WAC');
      var rows = [];
      for (var i=0; i<$scope.prog.length; i++) {
        rows.push ([new Date($scope.prog[i].dt), $scope.prog[i].erec, $scope.prog[i].wrec]);
      }
      data.addRows(rows);
      var options = {
        chart: {
          title: 'Received Status',
          subtitle: 'Blue is EAC and Red is WAC'
        },
        series: {
          displayExactValues: true
        },
        legend: {position: 'none'}
      };
      $scope.pdata[1] = {data:data, options:options};
      var chart = new google.charts.Line(document.getElementById('rec'));
      chart.draw(data, options);
    });
    google.charts.setOnLoadCallback( function () {
      var data = new google.visualization.DataTable();
      data.addColumn('date', 'Date');
      data.addColumn('number', 'EAC');
      data.addColumn('number', 'WAC');
      var rows = [];
      for (var i=0; i<$scope.prog.length; i++) {
        rows.push ([new Date($scope.prog[i].dt), $scope.prog[i].eapp, $scope.prog[i].wapp]);
      }
      data.addRows(rows);
      var options = {
        chart: {
          title: 'Approved Status',
          subtitle: 'Blue is EAC and Red is WAC'
        },
        legend: {position: 'none'}
      };
      $scope.pdata[0] = {data:data, options:options};
      // var chart = new google.charts.Line(document.getElementById('progdiv'));
      var chart = new google.charts.Line(document.getElementById('app'));
      chart.draw(data, options);
    });
    google.charts.setOnLoadCallback( function () {
      var data = new google.visualization.DataTable();
      data.addColumn('date', 'Date');
      data.addColumn('number', 'EAC');
      data.addColumn('number', 'WAC');
      var rows = [];
      for (var i=0; i<$scope.prog.length; i++) {
        rows.push ([new Date($scope.prog[i].dt), $scope.prog[i].erfe, $scope.prog[i].wrfe]);
      }
      data.addRows(rows);
      var options = {
        chart: {
          title: 'RFE Status',
          subtitle: 'Blue is EAC and Red is WAC'
        },
        legend: {position: 'none'}
      };
      $scope.pdata[2] = {data:data, options:options};
      var chart = new google.charts.Line(document.getElementById('rfe'));
      chart.draw(data, options);
    });
    google.charts.setOnLoadCallback( function () {
      var data = new google.visualization.DataTable();
      data.addColumn('date', 'Date');
      data.addColumn('number', 'EAC');
      data.addColumn('number', 'WAC');
      var rows = [];
      for (var i=0; i<$scope.prog.length; i++) {
        rows.push ([new Date($scope.prog[i].dt), $scope.prog[i].eoth, $scope.prog[i].woth]);
      }
      data.addRows(rows);
      var options = {
        chart: {
          title: 'Other Status',
          subtitle: 'Blue is EAC and Red is WAC'
        },
        legend: {position: 'none'}
      };
      $scope.pdata[3] = {data:data, options:options};
      var chart = new google.charts.Line(document.getElementById('oth'));
      chart.draw(data, options);
    });
  });
});
angular.module('statsApp').controller('historyCtrl', function ($http, $scope) {
  $http.get('/tracker/charts?t=0').success(function(data, status, headers, config) {
      $scope.charts = data.slice().reverse();
  });
});
angular.module('statsApp').controller('indexCtrl', 
function($http, $scope, $location, usersvc, $window)  {
    $http.get('/api/data/vcases/updatedt').success(function(data, status, headers, config) {
        $scope.update = data;
    });
    console.log("indexCtrl called");
  $scope.apps = function (tgt) {
    if (tgt != null){
      var s = $location.protocol() + "://" 
            + $location.host() + ":" 
            + $location.port() + tgt;
      $window.location = s;
      return;
    }
    usersvc.apps(function (ret) {
      // var baselen = $location.absUrl().length - $location.url().length;
      var s = $location.protocol() + "://" 
            + $location.host() + ":" 
            + $location.port() + ret;
      $window.location = s;
    });
  };
});
angular.module('statsApp').controller('vcaselistCtrl',
['$http', '$scope', '$location', '$uibModal', '$log', 
function($http, $scope, $location, $uibModal, $log) {
    console.log("vcaselistCtrl called");
    $scope.loadvcases = function(){
    console.log("loadvcases called");
        $http.get('/api/data/vcases/stackedcols?pre=EAC').success(function(data, status, headers, config) {
            var ec = data;
            google.charts.setOnLoadCallback( function () {
                var rec=0, app=0, rfe=0, oth=0, trf = 0;
                for (var i=0; i<ec.length; i++) {
                    rec += ec[i].rec;
                    app += ec[i].app;
                    rfe += ec[i].rfe;
                    oth += ec[i].oth;
                    trf += ec[i].trf;
                }
                var data2 = [
                  ['Status', 'Transferred '+trf,'Received '+rec,  
                    'RFE '+rfe, 'Other '+oth, 'Approved '+app,
                    { role: 'annotation' } ]
                ];
                for (var i=0; i<ec.length; i++) {
                  data2.push ([ec[i].id +"***", ec[i].trf, ec[i].rec, ec[i].rfe, ec[i].oth, ec[i].app, '']);
                }
                var data = google.visualization.arrayToDataTable(data2);
                var options = {
                  title: "EAC Status (100 series)",
                  width: 1000,
                  height: 200,
                  legend: { position: 'top', maxLines: 3 },
                  bar: { groupWidth: '50%' },
                  isStacked: true,
                  colors:['#aa0','#cc0', '#eae', '#8ce', '#0b0'],
                  chartArea:{left:35},
                  backgroundColor: '#555',
                  legendTextStyle: { color: '#FFF' },
                  titleTextStyle: { color: '#FFF' },
                  hAxis: {textPosition: 'none'},
                  vAxis : { 
                      textStyle : {
                          fontSize: 12,
                          color: '#fff'
                      }
                  },
                  annotations : { 
                      textStyle : {
                          fontSize: 12,
                          bold: true
                      }
                  }
                };
              var view = new google.visualization.DataView(data);
              var chart = new google.visualization.ColumnChart(document.getElementById("columnchart_eac"));
    console.log("loadchart.draw called");
              chart.draw(view, options);
          });
        });
        $http.get('/api/data/vcases/stackedcols?pre=WAC').success(function(data, status, headers, config) {
            var ec = data;
            google.charts.setOnLoadCallback( function () {
                var rec=0, app=0, rfe=0, oth=0, trf = 0;
                for (var i=0; i<ec.length; i++) {
                    rec += ec[i].rec;
                    app += ec[i].app;
                    rfe += ec[i].rfe;
                    oth += ec[i].oth;
                    trf += ec[i].trf;
                }
                var data2 = [
                  ['Status', 'Transferred '+trf,'Received '+rec,  
                    'RFE '+rfe, 'Other '+oth, 'Approved '+app,
                    { role: 'annotation' } ]
                ];
                for (var i=0; i<ec.length; i++) {
                  data2.push ([ec[i].id +"***", ec[i].trf, ec[i].rec, ec[i].rfe, ec[i].oth, ec[i].app, '']);
                  // data2.push ([ec[i].id +"***", ec[i].rec, ec[i].app, ec[i].rfe, ec[i].oth, ec[i].trf, '']);
                }
                var data = google.visualization.arrayToDataTable(data2);
                var options = {
                  title: "WAC Status (84 series)",
                  width: 840,
                  height: 200,
                  legend: { position: 'top', maxLines: 3 },
                  bar: { groupWidth: '50%' },
                  isStacked: true,
                  colors:['#aa0','#cc0', '#eae', '#8ce', '#0b0'],
                  chartArea:{left:35},
                  backgroundColor: '#555',
                  legendTextStyle: { color: '#FFF', fontSize:12},
                  titleTextStyle: { color: '#FFF' },
                  hAxis: {textPosition: 'none'},
                  vAxis : { 
                      textStyle : {
                          fontSize: 12,
                          color: '#fff'
                      }
                  },
                  annotations : { 
                      textStyle : {
                          fontSize: 12,
                          bold: true
                      }
                  }
                };
              var view = new google.visualization.DataView(data);
              var chart = new google.visualization.ColumnChart(document.getElementById("columnchart_wac"));
              chart.draw(view, options);
          });
        });
    };

    $scope.loadvcases();
    $scope.eac = [2, 2, 1, 2, 2, 3, 2, 2, 1, 4, 5, 5, 5, 5, 2, 6, 6, 6, 6, 6, 2, 6, 7, 6, 6]; 
    $scope.wac = [1, 1, 1, 1, 2, 3, 3, 1, 3, 5, 5, 5, 4, 2, 5, 4, 5, 5, 5, 2, 5, 5, 5, 3, 3];
    $scope.vcaseform = function (vcaseid) {
        $location.path('/vcases/' + vcaseid);
    };
    $scope.getvcase = function (id, nav) {
    console.log("getvcase called");
      if (id == null) {
        return;
      }
    console.log("getvcase api called");
      $scope.vcaseid = id;
      $http.get('/api/data/vcases/vcaseform?vcase='+ $scope.vcaseid + (nav == undefined ? "" : "&nav="+nav))
      .success(function(data, status, headers, config) {
          $scope.vcase = data;
          $scope.res = $scope.vcase.data.split(",");

          var stats = [0, 0, 0, 0, 0];
          for (var i=0; i<$scope.res.length; i++) {
            switch ($scope.res[i]) {
              case '0' : stats[0]++; break;
              case '1' : stats[1]++; break;
              case '2' : stats[1]++; break;
              case '3' : stats[2]++; break;
              case '4' : stats[3]++; break;
              case '6' : stats[4]++; break;
            }
          }
        google.charts.setOnLoadCallback( function () {
          var data = google.visualization.arrayToDataTable([
            ["Status", "", { role: "style" } ],
            ["Received", stats[0], "#ee0"],
            ["Approved", stats[1], "#0c0"],
            ["RFE", stats[2], "#fbf"],
            ["Other", stats[3], "color: #acf"],
            ["Transferred", stats[4], "color: #bb0"]
          ]);

          var view = new google.visualization.DataView(data);
          view.setColumns([0, 1,
                           { calc: "stringify",
                             sourceColumn: 1,
                             type: "string",
                             role: "annotation" },
                           2]);

          var options = {
            title: "Case status stats",
            width: 500,
            height: 150,
            bar: {groupWidth: "40%"},
            legend: { position: "none" },
            vAxis : { 
                textStyle : {
                    fontSize: 12
                }
            },
            annotations : { 
                textStyle : {
                    fontSize: 12,
                    bold: true
                }
            }
          };
          var chart = new google.visualization.BarChart(document.getElementById("barchart_values"));
    console.log("vcase chart.draw called");
          chart.draw(view, options);
        });
      });
    };
  var r = Math.floor((Math.random() * 2) + 0);
  var center = r == 0 ? "EAC16" : "WAC16";
  r = Math.floor((Math.random() * 25) + 125);
  var series = r;

  $scope.vcaseid = center + r + "50";
  $scope.getvcase($scope.vcaseid, "latest");
  // $scope.c = [0,0,0,0,0,0,0];
  $scope.clr = ["#ee0", "#0c0", "#0c0", "#fbf", "#acf", "#fff", "#bb0"];
  $scope.getColor = function (n) {
      // $scope.c[n]++; 
      return $scope.clr[n];
  };
}]);

