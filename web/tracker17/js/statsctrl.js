/*********************************************************/
angular.module('statsApp').controller('vcaselistCtrl17',
['$http', '$scope', '$rootScope', 'anchorSmoothScroll', '$location', '$uibModal', '$log', 
function($http, $scope, $rootScope, anchorSmoothScroll, $location, $uibModal, $log) {
  $http.get('/api/data/vcases17/updatedt').success(function(data, status, headers, config) {
      $scope.update = data;
  });
  
  // $scope.loadvcases = function(){
  //   $http.get('/api/data/vcases17/stackedcols?pre=EAC').success(function(data, status, headers, config) {
  //     var ec = data;
  //     var labels = [], recs = [], rfes = [], resps = [], dnms = [], oths = [], wtds = [];
  //     for (var i=0; i<ec.length; i++) {
  //       labels.push (ec[i].id.substring(5,8)+'-'+ec[i].id.substring(8,10));
  //       recs.push(ec[i].rec);
  //       rfes.push(ec[i].rfe);
  //       resps.push(ec[i].rrr);
  //       dnms.push(ec[i].dnm);
  //       oths.push(ec[i].oth);
  //       wtds.push(ec[i].wtd);
  //     }
  //     var barChartData = {
  //       labels: labels,
  //       backgroundColor: 'rgba(185, 214, 200, 0.75)',
  //       borderColor: 'rgba(255, 255, 255, 0.5)',
  //       datasets: [{
  //           backgroundColor: window.chartColors.rec,
  //           label: 'REC', data: recs
  //       }, {
  //           backgroundColor: window.chartColors.rfe,
  //           label: 'RFE', data: rfes
  //       }, {
  //           backgroundColor: window.chartColors.rrr,
  //           label: 'RESP', data: resps
  //       }, {
  //           backgroundColor: window.chartColors.dnm,
  //           label: 'DNM', data: dnms
  //       }, {
  //           backgroundColor: window.chartColors.wtd,
  //           label: 'WTD', data: wtds
  //       }, {
  //           backgroundColor: window.chartColors.oth,
  //           label: 'OTH', data: oths
  //       }]
  //     };
  //     var ctx = document.getElementById("canvas_eac").getContext("2d");
  //     window.myBar = new Chart(ctx, window.getopts(barChartData));
  //   });
  //   $http.get('/api/data/vcases17/stackedcols?pre=WAC').success(function(data, status, headers, config) {
  //     var ec = data;
  //     var labels = [], recs = [], rfes = [], resps = [], dnms = [], oths = [], wtds = [];
  //     for (var i=0; i<ec.length; i++) {
  //       labels.push (ec[i].id.substring(5,8)+'-'+ec[i].id.substring(8,10));
  //       recs.push(ec[i].rec);
  //       rfes.push(ec[i].rfe);
  //       resps.push(ec[i].rrr);
  //       dnms.push(ec[i].dnm);
  //       oths.push(ec[i].oth);
  //       wtds.push(ec[i].wtd);
  //    }
  //     var barChartData = {
  //       labels: labels,
  //       backgroundColor: 'rgba(185, 214, 200, 0.75)',
  //       borderColor: 'rgba(255, 255, 255, 0.5)',
  //       datasets: [{
  //           backgroundColor: window.chartColors.rec,
  //           label: 'REC', data: recs
  //       }, {
  //           backgroundColor: window.chartColors.rfe,
  //           label: 'RFE', data: rfes
  //       }, {
  //           backgroundColor: window.chartColors.rrr,
  //           label: 'RESP', data: resps
  //       }, {
  //           backgroundColor: window.chartColors.dnm,
  //           label: 'DNM', data: dnms
  //       }, {
  //           backgroundColor: window.chartColors.wtd,
  //           label: 'WTD', data: wtds
  //       }, {
  //           backgroundColor: window.chartColors.oth,
  //           label: 'OTH', data: oths
  //       }]
  //     };
  //     var ctx = document.getElementById("canvas_wac").getContext("2d");
  //     window.myBar = new Chart(ctx, window.getopts(barChartData));
  //   });
  // };
/*-------------------------------------------------------*/
  // $scope.loadvcases();
  // $scope.eac = [2, 2, 1, 2, 2, 3, 2, 2, 1, 4, 5, 5, 5, 5, 2, 6, 6, 6, 6, 6, 2, 6, 7, 6, 6]; 
  // $scope.wac = [1, 1, 1, 1, 2, 3, 3, 1, 3, 5, 5, 5, 4, 2, 5, 4, 5, 5, 5, 2, 5, 5, 5, 3, 3];
     $scope.eac = [0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]; 
     $scope.wac = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  $scope.msloaded = false;
  $scope.sortcol = 'dt';
  $scope.sortdir = 'desc';
  $scope.loadmseries = function (sort, dir) {
    $scope.msloaded = false;
    $scope.changes = {};
    $scope.mseries=[];
    $scope.mstot = {'rec':0, 'rfe':0, 'rrr':0, 'app':0, 'dnm':0, 'chg':0};
    $http.get('/api/data/vcases17/test?a=mseries&sortcol='+sort+"&sortdir="+dir)
      .success(function(data, status, headers, config) {
      $scope.mstats = data;
      var cdt = null;
      var cfdt = true;
      var cfdtstat = [0,0,0,0,0,0];
      for (var i=0; i<$scope.mstats.length; i++) {
        var ms = $scope.mstats[i];
        if (cdt == null)
            cdt = ms.chgdt.substring(0, 10);
        if (cdt == ms.chgdt.substring(0, 10)) {
          $scope.mstats[i]['cdt'] = false;
        } else {
          cfdt = false;
          $scope.mstats[i]['cdt'] = true;
          cdt = ms.chgdt.substring(0, 10);
        }
        $scope.changes[ms.id] = ms.chgs;
        $scope.mseries.push (ms.id);
        $scope.mstot['rec'] += ms.rec;
        $scope.mstot['rfe'] += ms.rfe;
        $scope.mstot['rrr'] += ms.rrr;
        $scope.mstot['app'] += ms.app;
        $scope.mstot['dnm'] += ms.dnm;
        $scope.mstot['chg'] += (ms.chgs == '' ? 0 : ms.chgs.split(',').length);
        ms.tchgs = {'crfe':0, 'cresp':0, 'cdnm':0, 'app1':0, 'app2':0};
        if (ms.chgst != null) {
          var vals = ms.chgst.split(',');
          for (var k=0; k<vals.length; k++) {
            if (vals[k].endsWith('7'))
              ms.tchgs['cresp']++;
            else if (vals[k].endsWith('8'))
              ms.tchgs['cdnm']++;
            else if (vals[k].endsWith('3'))
              ms.tchgs['crfe']++;
            else if (vals[k] == "01")
              ms.tchgs['app1']++;
            else if (vals[k] == "71")
              ms.tchgs['app2']++;
          }
          if (cfdt) {
            cfdtstat[0] += (ms.chgs == '' ? 0 : ms.chgs.split(',').length);
            cfdtstat[1] += ms.tchgs['crfe'];
            cfdtstat[2] += ms.tchgs['cresp'];
            cfdtstat[3] += ms.tchgs['cdnm'];
            cfdtstat[4] += ms.tchgs['app1'];
            cfdtstat[5] += ms.tchgs['app2'];
          }
        }
      }
      $scope.msloaded = true;
      if (!$scope.vcaseid) {
        var r = Math.floor(Math.random() * $scope.mseries.length);
        $scope.vcaseid = $scope.mseries[r];
        $scope.getvcase($scope.vcaseid, "latest", null, false);
      }
      $scope.cfdtstat = cfdtstat;
    });
  };
  $scope.loadmseries($scope.sortcol, $scope.sortdir);
  $http.get('/api/data/vcases17/test?a=getadmins').success(function(data, status, headers, config) {
      $scope.admins = data;
  });
  $scope.setsort = function (col) {
    if ($scope.sortcol == col) {
      $scope.sortdir = $scope.sortdir == '' ? 'desc' : '';
      $scope.sortcol = col;
    } else {
      $scope.sortdir = col == 'dt' ? 'desc' : '';
      $scope.sortcol = col;
    }
    $scope.loadmseries($scope.sortcol, $scope.sortdir);
  };
  $scope.sortclr = function (col) {
    return $scope.sortcol == col ? ($scope.sortdir == '' ? '#cdf' : '#fdc') : '';
  };
  $scope.vcaseform = function (vcaseid) {
      $location.path('/vcases/' + vcaseid);
  };
  $scope.getAgeDays = function (datestr) {
    var a = datestr.split(" ");
    var ad = a[0].split("-");
    // var at = a[1].split(":");
    var dt = new Date(
        parseInt(ad[0]), 
        parseInt(ad[1]) - 1, 
        parseInt(ad[2]), 0, 0, 0
        // parseInt(at[0]), 
        // parseInt(at[1]), 
        // parseInt(at[2])
        );
    dt.setTime( dt.getTime() - dt.getTimezoneOffset()*60*1000 );
    var seconds = Math.floor((new Date() - dt) / 1000);
    return Math.floor(seconds / 86400);
  };
  $scope.getMsbg = function (sn) {
    var k = $scope.mseries.indexOf(sn);
    if (k == -1) {
      return '#fff';
    }
    var stat = $scope.mstats[k];
    if (stat.chguser.startsWith("*")) {
      return '#ccffff'; // inprog
    }
    var days = $scope.getAgeDays(stat.chgdt);
    switch (days) {
      case 0: return '#bbf8bb'; // today
      case 1: return '#f6faaa'; // yday
      case 2: return '#ffddaa'; // 3-day
      case 3: return '#ffc8e0'; // 2-day
    }
    return '#dce4ff'; // 2-day
  };
  $scope.getvcase = function (id, nav, dt, scrl) {
    console.log("getvcase called");
    if (id == null) {
      return;
    }
    console.log("getvcase api called");
    $scope.vcaseid = id;
    $http.get('/api/data/vcases17/vcaseform?vcase='+ $scope.vcaseid + (nav == undefined ? "" : "&nav="+nav +"&dt="+dt))
    .success(function(data, status, headers, config) {
        if (data == "empty") {
          return;
        }
        if (scrl) {
          anchorSmoothScroll.scrollTo('seriesgrid');
        }
 
        $scope.vcase = data;
        $scope.res = $scope.vcase.data.split(",");
        var stats = [0, 0, 0, 0, 0, 0, 0, 0, 0];
        for (var i=0; i<$scope.res.length; i++) {
          switch ($scope.res[i].charAt(0)) {
            case '0' : stats[0]++; break;
            case '1' : stats[1]++; break;
            case '2' : stats[2]++; break;
            case '3' : stats[3]++; break;
            case '4' : stats[4]++; break;
            case '5' : stats[5]++; break;
            case '6' : stats[6]++; break;
            case '7' : stats[7]++; break;
            case '8' : stats[8]++; break;
          }
        }
        $scope.sdetail = stats;
    });
  };
  $scope.clr = ["#ee0", "#0c0", "#fa6", "#fbf", "#acf", "#fff", "#bb0", "#eb0", "#07e", "#a60"];
  $scope.echg = ['Received','Approved','Rejected','RFE','Other','Not I-129','Transferred','RFE Resp','DNM'];

  $scope.getColor = function (n) {
    return $scope.clr[n];
  };
  $scope.getDetail = function (csa) {
    if ( csa == undefined || csa == "5")
      return "";
    return $scope.echg[csa.charAt(0)] + ' ' + 
      parseInt(csa.charAt(1), 36) +"-"+parseInt(csa.charAt(2), 36) +"-"+parseInt(csa.charAt(3), 36);
  };
  $scope.getClz = function (n) {
    return "c"+n;
  };
  $scope.getBorder = function (series, num) {
    var chgs = "," + $scope.changes[series] + ",";
    if (chgs.indexOf("," + num + ",") != -1) {
      return '2px solid #008';
    }
    return '';
  };
  $scope.history = function (casenum) {
    var modalInstance = $uibModal.open({
      animation: true,
      templateUrl: 'casehistory.html',
      controller: 'caseHistoryCtrl17',
      size:'sm',
      resolve: {
        casenum: function () {
          return casenum;
        }
      }
    });
    modalInstance.result.then(function (status) {
    }, function () {
    });
  };
}]);
/*********************************************************/
angular.module('statsApp').controller('caseHistoryCtrl17', 
  function ($scope, $http, $uibModalInstance, casenum) {
  $scope.casenum = casenum;
  $scope.chgloaded = false;
  $http.get('/api/data/vcases17/?a=history&casenum='+casenum).success(function(data, status, headers, config) {
    $scope.casehist = data;
    $scope.chgloaded = true;
  });
  $scope.ok = function () {
    $uibModalInstance.close("ok");
  };
  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
  $scope.statnames = ["Received","Approved","Rejected","RFE Req",
  "Other","Not Form I-129","Transferred","RFE resp rec","Decision Notice","Withdrawn"];
  $scope.getStatus = function (n) {
    return $scope.statnames[n];
  };
});
/*********************************************************/
angular.module('statsApp').controller('indexCtrl17', 
function($http, $scope, $location, usersvc, $window)  {
  $scope.user = {
    name:   localStorage.getItem('wt_name'),
    id:     localStorage.getItem('wt_id')
  };
});
/*********************************************************/
