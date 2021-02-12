window.getopts18 = function (data) {
  return {
    type: 'bar',
    data: data,
    options: {
      title:{ display:false},
      tooltips: { mode: 'index', intersect: false},
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        xAxes: [{
          barThickness: 4,
          ticks: { autoSkip:true, maxTicksLimit:22 },
          gridLines: { display:false},
          stacked: true
        }],
        yAxes: [{
          gridLines: { display: true, color: '#bbb'},
          ticks: { max: 1000, beginAtZero: true},
          stacked: true
        }]
      }
    }
  };
};
/*********************************************************/
angular.module('statsApp').controller('vcaselistCtrl18',
['$http', '$scope', '$rootScope', 'anchorSmoothScroll', '$location', '$uibModal', '$log', 
function($http, $scope, $rootScope, anchorSmoothScroll, $location, $uibModal, $log) {
  // $http.get('/api/data/vcases18/updatedt').success(function(data, status, headers, config) {
  //     $scope.update = data.updatedt;
  // });

  $scope.loadtrends = function(){
    $http.get('/api/data/vcases18/test?a=trends').success(function(data, status, headers, config) {
      var tdata = data;

      // console.log("trends eac --------------------");
      var ctx2 = document.getElementById("trends_eac").getContext("2d");
      var elabels = [];
      for (var i=0; i<tdata.length; i++) {
        elabels.push (tdata[i].dt.substring(5));
      }
      var erecs = [];
      for (var i=0; i<tdata.length; i++) {
        erecs.push (tdata[i].erec);
      }
      var eapps = [];
      for (var i=0; i<tdata.length; i++) {
        eapps.push (tdata[i].eapp);
      }
      var erfes = [];
      for (var i=0; i<tdata.length; i++) {
        erfes.push (tdata[i].erfe);
      }
      var errrs = [];
      for (var i=0; i<tdata.length; i++) {
        errrs.push (tdata[i].errr);
      }
      var ednms = [];
      for (var i=0; i<tdata.length; i++) {
        ednms.push (tdata[i].ednm);
      }
      var myChart = new Chart(ctx2, {
        type: 'line',
        data: {
          labels: elabels,
              datasets: [{
                  borderColor: window.chartColors.rec,
                  label: 'REC', data: erecs
              }, {
                  borderColor: window.chartColors.rfe,
                  label: 'RFE', data: erfes
              }, {
                  borderColor: window.chartColors.app,
                  label: 'APP', data: eapps
              }, {
                  borderColor: window.chartColors.rrr,
                  label: 'RESP', data: errrs
              }, {
                  borderColor: window.chartColors.dnm,
                  label: 'DNM', data: ednms
              }]
        },
        options: {
          title:{ display:false},
          tooltips: { mode: 'index', intersect: false},
          responsive: true,
          elements: {
              point:{
                  radius: 0
              }
          },
          maintainAspectRatio: false,
          scales: {
            xAxes: [{
              ticks: { autoSkip:true, maxTicksLimit:22 },
              gridLines: { display:false}
            }],
            yAxes: [{
              gridLines: { display: true, color: '#bbb'},
              ticks: { beginAtZero: true, max: 30000}
            }]
          }
        }
      });
      // console.log("trends wac --------------------");
      var ctx4 = document.getElementById("trends_wac").getContext("2d");
      var wrecs = [];
      for (var i=0; i<tdata.length; i++) {
        wrecs.push (tdata[i].wrec);
      }
      var wapps = [];
      for (var i=0; i<tdata.length; i++) {
        wapps.push (tdata[i].wapp);
      }
      var wrfes = [];
      for (var i=0; i<tdata.length; i++) {
        wrfes.push (tdata[i].wrfe);
      }
      var wrrrs = [];
      for (var i=0; i<tdata.length; i++) {
        wrrrs.push (tdata[i].wrrr);
      }
      var wdnms = [];
      for (var i=0; i<tdata.length; i++) {
        wdnms.push (tdata[i].wdnm);
      }
      var myChart2 = new Chart(ctx4, {
        type: 'line',
        data: {
          labels: elabels,
              datasets: [{
                  borderColor: window.chartColors.rec,
                  label: 'REC', data: wrecs
              }, {
                  borderColor: window.chartColors.rfe,
                  label: 'RFE', data: wrfes
              }, {
                  borderColor: window.chartColors.app,
                  label: 'APP', data: wapps
              }, {
                  borderColor: window.chartColors.rrr,
                  label: 'RESP', data: wrrrs
              }, {
                  borderColor: window.chartColors.dnm,
                  label: 'DNM', data: wdnms
              }]
        },
        options: {
          title:{ display:false},
          tooltips: { mode: 'index', intersect: false},
          responsive: true,
          elements: {
              point:{
                  radius: 0
              }
          },
          maintainAspectRatio: false,
          scales: {
            xAxes: [{
              ticks: { autoSkip:true, maxTicksLimit:22 },
              gridLines: { display:false}
            }],
            yAxes: [{
              gridLines: { display: true, color: '#bbb'},
              ticks: { beginAtZero: true, max: 30000}
            }]
          }
        }
      });




    });
  }  
  $scope.stacksloaded = false;
  $scope.loadvcases = function(){
    $http.get('/api/data/vcases18/stackedcols?pre=EAC').success(function(data, status, headers, config) {
      $scope.stacksloaded = true;
      var ec = data;
      // var labels = [], recs = [], rfes = [], resps = [], dnms = [], oths = [], wtds = [];
      var labels = [], recs = [], rfes = [], trfs = [], apps = [], resps = [], dnms = [];
      for (var i=0; i<ec.length; i++) {
        labels.push (ec[i].id.substring(5,8)+'-'+ec[i].id.substring(8,10));
        recs.push(ec[i].rec);
        rfes.push(ec[i].rfe);
        resps.push(ec[i].rrr);
        dnms.push(ec[i].dnm);
        trfs.push(ec[i].trf);
        apps.push(ec[i].app);
        // oths.push(ec[i].oth);
        // wtds.push(ec[i].wtd);
     }
      var barChartData = {
        labels: labels,
        backgroundColor: 'rgba(185, 214, 200, 0.75)',
        borderColor: 'rgba(255, 255, 255, 0.5)',
        datasets: [{
            backgroundColor: window.chartColors.rec,
            label: 'REC', data: recs
        }, {
            backgroundColor: window.chartColors.trf,
            label: 'TRF', data: trfs
        }, {
            backgroundColor: window.chartColors.rfe,
            label: 'RFE', data: rfes
        }, {
            backgroundColor: window.chartColors.rrr,
            label: 'RESP', data: resps
        }, {
            backgroundColor: window.chartColors.dnm,
            label: 'DNM', data: dnms
        // }, {
        //     backgroundColor: window.chartColors.wtd,
        //     label: 'WTD', data: wtds
        }, {
            backgroundColor: window.chartColors.app,
            label: 'APP', data: apps
        // }, {
        //     backgroundColor: window.chartColors.oth,
        //     label: 'OTH', data: oths
        }]
      };
      var ctx = document.getElementById("canvas_eac").getContext("2d");
      window.myBar = new Chart(ctx, window.getopts18(barChartData));
    });
    $http.get('/api/data/vcases18/stackedcols?pre=WAC').success(function(data, status, headers, config) {
      var ec = data;
      // var labels = [], recs = [], rfes = [], resps = [], dnms = [], oths = [], wtds = [];
      var labels = [], recs = [], rfes = [], apps = [], resps = [], dnms = [];
      for (var i=0; i<ec.length; i++) {
        labels.push (ec[i].id.substring(5,8)+'-'+ec[i].id.substring(8,10));
        recs.push(ec[i].rec);
        rfes.push(ec[i].rfe);
        resps.push(ec[i].rrr);
        dnms.push(ec[i].dnm);
        apps.push(ec[i].app);
        // oths.push(ec[i].oth);
        // wtds.push(ec[i].wtd);
     }
      var barChartData = {
        labels: labels,
        backgroundColor: 'rgba(185, 214, 200, 0.75)',
        borderColor: 'rgba(255, 255, 255, 0.5)',
        datasets: [{
            backgroundColor: window.chartColors.rec,
            label: 'REC', data: recs
        }, {
            backgroundColor: window.chartColors.rfe,
            label: 'RFE', data: rfes
        }, {
            backgroundColor: window.chartColors.rrr,
            label: 'RESP', data: resps
        }, {
            backgroundColor: window.chartColors.dnm,
            label: 'DNM', data: dnms
        // }, {
        //     backgroundColor: window.chartColors.wtd,
        //     label: 'WTD', data: wtds
        }, {
            backgroundColor: window.chartColors.app,
            label: 'APP', data: apps
        // }, {
        //     backgroundColor: window.chartColors.oth,
        //     label: 'OTH', data: oths
        }]
      };
      var ctx = document.getElementById("canvas_wac").getContext("2d");
      window.myBar = new Chart(ctx, window.getopts18(barChartData));
    });
  };
/*-------------------------------------------------------*/
  $scope.loadtrends();
  $scope.loadvcases();
  // $scope.eac = [2, 2, 1, 2, 2, 3, 2, 2, 1, 4, 5, 5, 5, 5, 2, 6, 6, 6, 6, 6, 2, 6, 7, 6, 6]; 
  // $scope.wac = [1, 1, 1, 1, 2, 3, 3, 1, 3, 5, 5, 5, 4, 2, 5, 4, 5, 5, 5, 2, 5, 5, 5, 3, 3];
     // $scope.eac = [0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]; 
     // $scope.wac = [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
     // $scope.eac2 = new Array(21).fill(0); 
     // $scope.wac2 = new Array(21).fill(0);

  $scope.eac2 = []; 
  for (var i=0;i<20;i++) {
     $scope.eac2[i] = new Array(6).fill(0);
  }
  $scope.wac2 = []; 
  for (var i=0;i<20;i++) {
     $scope.wac2[i] = new Array(6).fill(0);
  }

  $scope.msloaded = false;
  $scope.sortcol = 'dt';
  $scope.sortdir = 'desc';
  $scope.loadmseries = function (sort, dir) {
    $scope.msloaded = false;
    $scope.mpage = 1;
    $scope.changes = {};
    $scope.mseries=[];
    $scope.eacmstot = {'rec':0, 'wtd':0, 'rfe':0, 'rrr':0, 'app':0, 'dnm':0, 'chg':0};
    $scope.wacmstot = {'rec':0, 'wtd':0, 'rfe':0, 'rrr':0, 'app':0, 'dnm':0, 'chg':0};
    // $scope.mstot = {'rec':0, 'rfe':0, 'rrr':0, 'app':0, 'chg':0};
    $http.get('/api/data/vcases18/test?a=mseries&sortcol='+sort+"&sortdir="+dir)
      .success(function(data, status, headers, config) {
      $scope.mstats = data;
      var cdt = null;
      var cfdt = true;
      var eaccfdtstat = [0,0,0,0,0,0,0];
      var waccfdtstat = [0,0,0,0,0,0,0];
      $scope.eacmstatstot = 0;
      $scope.wacmstatstot = 0;
      for (var i=0; i<$scope.mstats.length; i++) {
        var ms = $scope.mstats[i];
        if (ms.id.startsWith('EAC'))
          $scope.eacmstatstot++;
        else
          $scope.wacmstatstot++;

        var cday = parseInt(ms.id.substring(5,8));
        var csub = parseInt(ms.id.substring(8,10));
        if (ms.id.charAt(0) == 'E') {
          $scope.eac2[cday-132][csub-50] = 1;
        } else {
          $scope.wac2[cday-132][csub-50] = 1;
        }
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

        var tot2 = ms.id.startsWith('EAC') ? $scope.eacmstot : $scope.wacmstot;
        tot2['rec'] += ms.rec;
        tot2['wtd'] += ms.wtd;
        tot2['rfe'] += ms.rfe;
        tot2['rrr'] += ms.rrr;
        tot2['app'] += ms.app;
        tot2['dnm'] += ms.dnm;
        tot2['chg'] += (ms.chgs == '' ? 0 : ms.chgs.split(',').length);

        ms.eactchgs = {'crfe':0, 'cresp':0, 'cdnm':0, 'app1':0, 'app2':0};
        ms.wactchgs = {'crfe':0, 'cresp':0, 'cdnm':0, 'app1':0, 'app2':0};
        // ms.tchgs = {'crfe':0, 'cresp':0, 'app1':0, 'app2':0};
        var tch = ms.id.startsWith('EAC') ? ms.eactchgs : ms.wactchgs;
        if (ms.chgst != null) {
          var vals = ms.chgst.split(',');
          for (var k=0; k<vals.length; k++) {
            if (vals[k].endsWith('7'))
              tch['cresp']++;
            else if (vals[k].endsWith('8'))
              tch['cdnm']++;
            else if (vals[k].endsWith('3'))
              tch['crfe']++;
            else if (vals[k] == "71")
              tch['app2']++;
            else if (vals[k].endsWith('1'))
              tch['app1']++;
          }
          ms.tchgs = tch;
          var fdt = ms.id.startsWith('EAC') ? eaccfdtstat : waccfdtstat;
          if (cfdt) {
            eaccfdtstat[0] += (ms.chgs == '' || ms.id.startsWith('WAC') ? 0 : ms.chgs.split(',').length);
            eaccfdtstat[1] += ms.eactchgs['crfe'];
            eaccfdtstat[2] += ms.eactchgs['cresp'];
            eaccfdtstat[3] += ms.eactchgs['cdnm'];
            eaccfdtstat[4] += ms.eactchgs['app1'];
            eaccfdtstat[5] += ms.eactchgs['app2'];

            waccfdtstat[0] += (ms.chgs == '' || ms.id.startsWith('EAC') ? 0 : ms.chgs.split(',').length);
            waccfdtstat[1] += ms.wactchgs['crfe'];
            waccfdtstat[2] += ms.wactchgs['cresp'];
            waccfdtstat[3] += ms.wactchgs['cdnm'];
            waccfdtstat[4] += ms.wactchgs['app1'];
            waccfdtstat[5] += ms.wactchgs['app2'];
          }
        }
      }
      $scope.msloaded = true;
      if (!$scope.vcaseid) {
        var r = Math.floor(Math.random() * $scope.mseries.length);
        $scope.vcaseid = $scope.mseries[r];
        $scope.getvcase($scope.vcaseid, "latest", null, false);
      }
      $scope.eaccfdtstat = eaccfdtstat;
      $scope.waccfdtstat = waccfdtstat;
    });
  };
  $scope.loadmseries($scope.sortcol, $scope.sortdir);
  $http.get('/api/data/vcases18/test?a=getadmins').success(function(data, status, headers, config) {
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
  $scope.getseriesrow = function (rowid) {
    // console.log("getseriesrow called");
    if (rowid == null) {
      return;
    }
    $http.get('/api/data/vcases18/test?a=seriesrow&rowid='+ rowid)
    .success(function(data, status, headers, config) {
        if (data == "empty") {
          return;
        }
        $scope.vcaseid = null;
        var stats = [0, 0, 0, 0, 0, 0, 0, 0, 0];
        for (var i=0; i<data.data.length; i++) {
          data.data[i].res = data.data[i].data.split(",");
          for (var k=0; k<data.data[i].res.length; k++) {
            switch (data.data[i].res[k].charAt(0)) {
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
        }
        $scope.rowdetail = stats;

        // anchorSmoothScroll.scrollTo('seriesrowgrid');
        $scope.seriesrow = data;
    });


  };
  $scope.getvcase = function (id, nav, dt, scrl) {
    // console.log("getvcase called");
    if (id == null) {
      return;
    }
    // console.log("getvcase api called");
    $scope.vcaseid = id;
    $http.get('/api/data/vcases18/vcaseform?vcase='+ $scope.vcaseid + (nav == undefined ? "" : "&nav="+nav +"&dt="+dt))
    .success(function(data, status, headers, config) {
        if (data == "empty") {
          return;
        }
        $scope.seriesrow = null;
        if (scrl) {
          anchorSmoothScroll.scrollTo('seriesgrid');
        }
 
        $scope.vcase = data;
        $scope.res = $scope.vcase.data.split(",");
        var stats = [0, 0, 0, 0, 0, 0, 0, 0, 0];
        for (var i=0; i<$scope.res.length; i++) {
          switch ($scope.res[i].charAt(0)) {
            case '0' : stats[0]++; break;
            case 'a' : stats[1]++; break;
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

    // console.log("linechart --------------------");
    var ctx2 = document.getElementById("schart").getContext("2d");
    var linelabels = [];
    for (var i=0; i<$scope.vcase.stats.length; i++) {
      linelabels.push ($scope.vcase.stats[i].dt.substring(5));
    }
    var linerecs = [];
    for (var i=0; i<$scope.vcase.stats.length; i++) {
      linerecs.push ($scope.vcase.stats[i].rec);
    }
    var lineapps = [];
    for (var i=0; i<$scope.vcase.stats.length; i++) {
      lineapps.push ($scope.vcase.stats[i].app);
    }
    var linerfes = [];
    for (var i=0; i<$scope.vcase.stats.length; i++) {
      linerfes.push ($scope.vcase.stats[i].rfe);
    }
    var lineresps = [];
    for (var i=0; i<$scope.vcase.stats.length; i++) {
      lineresps.push ($scope.vcase.stats[i].rrr);
    }
    var linednms = [];
    for (var i=0; i<$scope.vcase.stats.length; i++) {
      linednms.push ($scope.vcase.stats[i].dnm);
    }
    var myChart = new Chart(ctx2, {
      type: 'line',
      data: {
        labels: linelabels,
            datasets: [{
                borderColor: window.chartColors.rec,
                label: 'REC', data: linerecs
            }, {
                borderColor: window.chartColors.rfe,
                label: 'RFE', data: linerfes
            }, {
                borderColor: window.chartColors.rrr,
                label: 'RESP', data: lineresps
            }, {
                borderColor: window.chartColors.app,
                label: 'APP', data: lineapps
            }, {
                borderColor: window.chartColors.dnm,
                label: 'DNM', data: linednms
            }]
      },
      options: {
        title:{ display:false},
        tooltips: { mode: 'index', intersect: false},
        responsive: true,
        elements: {
            point:{
                radius: 0
            }
        },
        maintainAspectRatio: false,
        scales: {
          xAxes: [{
            ticks: { autoSkip:true, maxTicksLimit:22 },
            gridLines: { display:false}
          }],
          yAxes: [{
            gridLines: { display: true, color: '#bbb'},
            ticks: { beginAtZero: true}
          }]
        }
      }
    });



    });


  };
  // $scope.clr = ["#ee0", "#0c0", "#fa6", "#fbf", "#acf", "#fff", "#bb0", "#eb0", "#07e", "#a60"];
  $scope.clr = {0: "#ee0", 1: "#0c0", 2: "#fa6", 3: "#fbf", 4: "#ace", 
                5: "#fff", 6: "#bb0", 7: "#eb0", 8: "#07e", 9: "#a60",
                a: "#4f0"};

  // $scope.echg = ['Received','Approved','Rejected','RFE','Other','Not I-129','Transferred','RFE Resp','DNM'];
  $scope.echg = {0: 'Received', 1: 'Approved', 2: 'Rejected', 3: 'RFE', 4: 'Other', 
                 5: 'Not I-129', 6: 'Transferred', 7: 'RFE Resp', 8: 'DNM', 9: 'Withdrawn', 
                 a: 'RFE-Approved'};

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
      templateUrl: 'tracker18/casehistory.html',
      controller: 'caseHistoryCtrl18',
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

    // if ($scope.vcase != undefined) {
      // google.charts.setOnLoadCallback( function () {
      //   var data = new google.visualization.DataTable();
      //   data.addColumn('date', 'Date');
      //   data.addColumn('number', 'Received');
      //   data.addColumn('number', 'RFE Req');
      //   data.addColumn('number', 'rfe Response');
      //   data.addColumn('number', 'Decision', '#888');
      //   var rows = [];
      //   for (var i=0; i<$scope.vcase.stats.length; i++) {
      //     rows.push ([
      //       new Date($scope.vcase.stats[i].dt), 
      //       $scope.vcase.stats[i].rec, 
      //       $scope.vcase.stats[i].rfe, 
      //       $scope.vcase.stats[i].rrr, 
      //       $scope.vcase.stats[i].dnm
      //       ]);
      //   }
      //   data.addRows(rows);
      //   var options = {
      //     chart: {
      //       title: $scope.vcase.id
      //     },
      //     series: {
      //       displayExactValues: true
      //     },
      // legend: { position: 'top', alignment: 'start' },
      //     colors: ['#dd0', '#eae', '#d90', '#8ac']
      //   };
      //   var chart = new google.charts.Line(document.getElementById('schart'));
      //   chart.draw(data, options);
      // });



    // var linedata = {
    //     labels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    //     datasets: [
    //         {
    //             label: "Prime and Fibonacci",
    //             data: [2, 3, 5, 7, 11, 13, 17, 19, 23, 29]
    //         },
    //         {
    //             label: "My Second dataset",
    //             data: [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]
    //         }
    //     ]
    // };
    // }



}]);
/*********************************************************/
angular.module('statsApp').controller('caseHistoryCtrl18', 
  function ($scope, $http, $uibModalInstance, casenum) {
  $scope.casenum = casenum;
  $scope.chgloaded = false;
  $http.get('/api/data/vcases18/?a=history&casenum='+casenum).success(function(data, status, headers, config) {
    // $scope.casehist = data;
    $scope.chgloaded = true;
    $scope.imgdata = 'data:image/png;base64,' + data;
  });
  $scope.ok = function () {
    $uibModalInstance.close("ok");
  };
  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
  $scope.statnames = {0: "Received", 1: "Approved", 2: "Rejected", 3: "RFE Req",
   4: "Other", 5: "Not Form I-129", 6: "Transferred", 7: "RFE resp rec",
  8: "Decision Notice", 9: "Withdrawn", a: "RFE-Approved"};
  $scope.getStatus = function (n) {
    return $scope.statnames[n];
  };
});
/*********************************************************/
angular.module('statsApp').controller('indexCtrl18', 
function($http, $scope, $location, usersvc, $window)  {
  $scope.user = {
    name:   localStorage.getItem('wt_name'),
    id:     localStorage.getItem('wt_id')
  };
});
/*********************************************************/
angular.module('statsApp').controller('cmtCtrl18', 
function(countries, $window, $document, $scope, $http, anchorSmoothScroll, $attrs, $interval)  {

      $http.get('/api/user/test?a=checkadmin&id=' + localStorage.getItem('wt_id')).success(function(data, status, headers, config) {
          $scope.uadmin =  data.status == "success";
          // console.log("=================== admin= " + $scope.uadmin);
      });

  $(document).ready(function(){
      $('#emoji').click(function(event){
          event.stopPropagation();
           $("#epop").slideToggle("fast");
      });
      $("#epop span").on("click", function (event) {
        // var txt = document.querySelector("#txt2");
        // $("#txt2").val(' ' +event.target.innerText);
        var input = $( "#cmtbox" );
      input.val( input.val() + ' ' + event.target.innerText );
      angular.element(input).triggerHandler('input');
      // input.trigger('input'); // Use for Chrome/Firefox/Edge
      // input.trigger('change'); // Use for Chrome/Firefox/Edge + IE11
          event.stopPropagation();
      });
  });
  $(document).on("click", function () {
      $("#epop").hide();
  });

      $scope.countries = countries;
      $scope.sz = 50; //comments page size
      // $scope.topic = $attrs.topic;
      $scope.topic = "2";
      $scope.fltrmode = false;
      $scope.uinfoedit = false;
      $scope.cmtloaded = false;
      // $scope.uinfoedit = false;
      $scope.editmode = false;
      $scope.fltrdata = false;
      $scope.page = 1;
      $scope.fltr = {};
      $scope.qtxt = '';
      $scope.qname = '';
      $scope.qpk = 0;

      // localStorage.removeItem("wt_id");
      // localStorage.removeItem("wt_name");
      // localStorage.removeItem("wt_status");
      // localStorage.removeItem("wt_center");
      // localStorage.removeItem("wt_series");
      // localStorage.removeItem("wt_country");

      $scope.cmt = {
        name:   localStorage.getItem('wt_name')
      };
      $scope.blank = function(val) {
        return (val == null || val == undefined || val == 'undefined') ? "" : val;
      };
      $scope.uinfo = {};
      switch ($scope.topic) {
        case "2":
          $scope.uinfo.name = $scope.blank(localStorage.getItem('wt_name'));
          $scope.uinfo.status = $scope.blank(localStorage.getItem('wt_status'));
          $scope.uinfo.center = $scope.blank(localStorage.getItem('wt_center'));
          $scope.uinfo.series = $scope.blank(localStorage.getItem('wt_series'));
          $scope.uinfo.rfereason = $scope.blank(localStorage.getItem('wt_rfereason'));
          $scope.uinfo.degree = $scope.blank(localStorage.getItem('wt_degree'));
          $scope.uinfo.processing = $scope.blank(localStorage.getItem('wt_processing'));
          $scope.uinfo.skill = $scope.blank(localStorage.getItem('wt_skill'));
          $scope.uinfo.company = $scope.blank(localStorage.getItem('wt_company'));
          $scope.uinfo.empcity = $scope.blank(localStorage.getItem('wt_empcity'));
          $scope.uinfo.country = $scope.blank(localStorage.getItem('wt_country'));
          $scope.statusopts = ["","RFE","RFE Resp Sent","Received","Approved","Name Updated","Other"];
          break;
      }
      $scope.loadcomments = function(p){
        var user = localStorage.getItem('wt_id');
        if (user == null) {
          user = '';
        }
        if ($scope.fltrmode) {
          $http.post('/api/data/comments?action=filter&topic='+ $scope.topic +'&u=' + user +'&p=' + p + "&sz="+$scope.sz, $scope.fltr)
            .success(function(data, status, headers, config) {
              $scope.cset = data;
              $scope.page = p;
              $scope.fltrdata = true;
              $scope.cmtloaded = true;
          });
        } else {
          $scope.rendercomments(p, user);
        }
      };
      $scope.rendercomments = function(p, user){
        $scope.cmtloaded = false;
        $http.get('/api/data/comments?topic='+ $scope.topic +'&u=' + user +'&p=' + p + "&sz="+$scope.sz)
          .success(function(data, status, headers, config) {
            $scope.cset = data;
            $scope.page = p;
            $scope.cmtloaded = true;
        });
      };
      $scope.filtercomments = function(p){
        // localStorage.setItem('wt_name', $scope.cmt.name);
        $scope.loadcomments(1);
      };
      // $scope.upvote = function(c){
      //   var votes = JSON.parse (localStorage.getItem('wt_votes'));
      //   var cmts = JSON.parse (localStorage.getItem('wt_cmts'));
      //   if (votes == null ) {
      //     votes = [];
      //   }
      //   if (cmts == null ) {
      //     cmts = [];
      //   }
      //   if (votes.indexOf(c.pk) == -1 && cmts.indexOf(c.pk) == -1 ) {
      //     c.votes++;
      //     votes.push(c.pk);
      //     localStorage.setItem('wt_votes', JSON.stringify(votes));
      //     $http.post('/api/data/comments?action=upvote', c.pk).success(function(data, status, headers, config) {
      //     });
      //   }
      // };
      $scope.upvote = function(c){
        if (c.owner)
          return;
        var votes = JSON.parse (localStorage.getItem('wt_votes'));
        if (votes == null ) {
          votes = [];
        }
        if (votes.indexOf(c.pk) == -1) {
          c.votes++;
          votes.push(c.pk);
          localStorage.setItem('wt_votes', JSON.stringify(votes));
          $http.post('/api/data/comments?action=upvote', c.pk).success(function(data, status, headers, config) {
          });
        }
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
      $scope.canceluinfo = function(){
        $scope.uinfo.name = localStorage.getItem('wt_name');
        $scope.uinfo.status = localStorage.getItem('wt_status');
        $scope.uinfo.center = localStorage.getItem('wt_center');
        $scope.uinfo.series = localStorage.getItem('wt_series');
        $scope.uinfo.rfereason = localStorage.getItem('wt_rfereason');
        $scope.uinfo.degree = localStorage.getItem('wt_degree');
        $scope.uinfo.processing = localStorage.getItem('wt_processing');
        $scope.uinfo.skill = localStorage.getItem('wt_skill');
        $scope.uinfo.company = localStorage.getItem('wt_company');
        $scope.uinfo.empcity = localStorage.getItem('wt_empcity');
        $scope.uinfo.country = localStorage.getItem('wt_country');
        $scope.uinfoedit=false;
      };
      $scope.saveuinfo = function(){
        localStorage.setItem('wt_name', $scope.blank($scope.uinfo.name));
        localStorage.setItem('wt_status', $scope.blank($scope.uinfo.status));
        localStorage.setItem('wt_center', $scope.blank($scope.uinfo.center));
        localStorage.setItem('wt_series', $scope.blank($scope.uinfo.series));
        localStorage.setItem('wt_rfereason', $scope.blank($scope.uinfo.rfereason));
        localStorage.setItem('wt_degree', $scope.blank($scope.uinfo.degree));
        localStorage.setItem('wt_processing', $scope.blank($scope.uinfo.processing));
        localStorage.setItem('wt_skill', $scope.blank($scope.uinfo.skill));
        localStorage.setItem('wt_company', $scope.blank($scope.uinfo.company));
        localStorage.setItem('wt_empcity', $scope.blank($scope.uinfo.empcity));
        localStorage.setItem('wt_country',$scope.blank($scope.uinfo.country));
        $scope.uinfoedit=false;
        var val = localStorage.getItem('wt_id');
        if (val == null) {
          val = $scope.guid();
          localStorage.setItem('wt_id', val);
        }
        $scope.uinfo.id = val;
        $http.post('/api/data/comments?action=uinfo', $scope.uinfo).success(function(data, status, headers, config) {
        });
      };
      $scope.addcomment = function(){
        if ($scope.uinfo.name == null || $scope.uinfo.name == '' || $scope.uinfo.name == undefined) {
          alert ("Please provide your name and other info by clicking on 'edit' below and please save it before proceeding with comment");
          return;
        }
        // localStorage.setItem('wt_name', $scope.cmt.name);
        // $scope.cmt.name = $scope.uinfo.name;
        var val = localStorage.getItem('wt_id');
        if (val == null) {
          val = $scope.guid();
          localStorage.setItem('wt_id', val);
        }
        // cmt.user = val;
        // cmt.topic = $scope.topic;
        if (!$scope.empty($scope.cmt.txt)) {
          var cmt = {user: val, name: $scope.uinfo.name,topic: $scope.topic, txt: $scope.cmt.txt};
          $scope.cmt.txt = null;
          if ($scope.qtxt != '') {
            cmt.qtxt = $scope.qtxt .length < 300 ? $scope.qtxt : $scope.qtxt.substring(0, 297) + "..." ;
            cmt.qname = $scope.qname;
            cmt.qpk = $scope.qpk;
          }
          $http.post('/api/data/comments', cmt).success(function(data, status, headers, config) {
              // $scope.loadcomments(1);
              $scope.chatclient.sendMessage(data);
              var cmts = JSON.parse (localStorage.getItem('wt_cmts'));
              if (cmts == null ) {
                cmts = [];
              }
              $scope.qtxt = '';
              // cmts.push(parseInt(data.status));
              cmts.push(parseInt(data.pk));
              localStorage.setItem('wt_cmts', JSON.stringify(cmts));
          });
          $scope.ontyping();
        }
      };
      $scope.replycmt = function (c2) {
        $scope.qtxt = c2.txt;
        $scope.qname = c2.name;
        $scope.qpk = c2.pk;
        anchorSmoothScroll.scrollTo('cmtsection');
        // angular.element('#cmtbox').focus();
        $window.document.getElementById('cmtbox').focus();
      };
      $scope.editcmt = function (c2) {
        if (!$scope.empty(c2.txt)) {
          var val = localStorage.getItem('wt_id');
          if (val != null) {
            var q = {pk: c2.pk, user: val, txt: c2.txt};
            $http.post('/api/data/comments?action=edit', q).success(function(data, status, headers, config) {
                $scope.loadcomments($scope.page);
            });
          }
          $scope.editmode = false;
        }
      };
      $scope.rmcmt = function (c2) {
        if (!confirm('Are you sure to delete this comment?'))
          return;
        var val = localStorage.getItem('wt_id');
        if (val != null) {
          var q = {pk: c2.pk, user: val};
          $http.post('/api/data/comments?action=del', q).success(function(data, status, headers, config) {
              $scope.loadcomments($scope.page);
          });
        }
      };
      $scope.modcmt = function (c2) {
        if (!confirm("The comment text will be replaced by '[deleted]'. Are you sure to mod this comment?"))
          return;
        var val = localStorage.getItem('wt_id');
        if (val != null) {
          var q = {pk: c2.pk, user: val};
          $http.post('/api/data/comments?action=mod', q).success(function(data, status, headers, config) {
              $scope.loadcomments($scope.page);
          });
        }
      };
      $scope.guid = function () {
        return Math.random().toString(36).substring(2, 8) +
            Math.random().toString(36).substring(2, 8);
      };
      $scope.empty = function (s) {
        return s == null ? true : s.trim() == "" ? true : false;
      };
      $scope.links2html = function (text) {
        var exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
        return text.replace(exp,"<a href='$1' target=\"_blank\">$1</a>"); 
      };
      $scope.loadcomments(1);
      // var var_1 = $interval (function(){
      //   $scope.loadcomments(1);
      // },300000);      

      $scope.cmd = {
        connect: '/connect ',
        disconnect: '/disconnect ',
        broadcast: '/broadcast ',
      };
      $scope.userlen = '0';
      $scope.utyping = '';
      // var socket;
      $scope.chatclient = {
        socket: null,
        userlen: null,
        init: function(user){
          // socket = new WebSocket("wss://localhost:5454/");
          socket = new WebSocket("wss://worktheme.com/");
          socket.onopen = function(){
            socket.send($scope.cmd.connect + user);
          };
          // socket.onmessage = function (evt) { 
          //   $scope.chatclient.addMessage(evt.data);
          // };
          socket.onmessage = function (evt) { 
            var msg = evt.data;
            if (msg.startsWith("$$users:")) {
              var el = document.getElementById("userlen");
              // console.log("users="+msg.substring(8));
              el.innerText = "online: " + msg.substring(8);
              // $scope.userlen = msg.substring(8);
            } else if(msg.startsWith("$$ty:")){
              // console.log("ty="+msg.substring(5));
              var ut = JSON.parse(msg.substring(5));
              // $scope.utyping = ut.length > 0 ? "Typing: " + ut.join (', ') : "";
              var el = document.getElementById("utyping");
              if (msg.length > 7)
                el.innerText = "typing: " + ut.join(', ');
              else
                el.innerText = "";
           } else {
              // var el = document.getElementById("newmsg");
              // el.insertAdjacentHTML("beforeEnd", msg+"<br/>");
              // console.log("newmsg="+msg);
              // el.innerText = msg;
              var cuser = localStorage.getItem('wt_id');
              if (cuser == null) {
                cuser = '';
              }
              // $scope.cmtloaded = false;

              var cmt = JSON.parse(msg);
              var cmts = JSON.parse (localStorage.getItem('wt_cmts'));
              if (cmts == null ) {
                cmts = [];
              }
              for (var i=cmts.length-1; i >=0; i--) {
                if (cmts[i] == cmt.pk) {
                  cmt.owner = true;
                  break;
                }
              }
              $scope.cset.cmts.unshift(cmt);
              // $scope.newcomment() ;
              $scope.$apply() ;
              // $scope.cmtloaded = true;
            }
          };
          socket.onclose = function() {
          };
        },
        // addMessage: function(msg){
        //   console.log("msg="+msg);
        //   $scope.userlen = msg;
        //   this.userlen = msg;
        //   // socket.send($scope.cmd.broadcast + msg);
        // },
        // var cmt = {user: val, name: $scope.uinfo.name,topic: $scope.topic, txt: $scope.cmt.txt};
        sendMessage: function(cmt){
          // console.log("sendMessage="+cmt.txt);
          socket.send($scope.cmd.broadcast + JSON.stringify(cmt));
        },
        addTyping: function(){
          // console.log("typing-start="+$scope.uinfo.name);
          socket.send("/ty1 "  + $scope.uinfo.name);
        },
        removeTyping: function(){
          // console.log("typing-stop="+$scope.uinfo.name);
          socket.send("/ty2 "  + $scope.uinfo.name);
        },
        close: function(){
          socket.close();
        }
      };

      $scope.newcomment = function(){
        // $http.get('http://google.com').success(function(data, status, headers, config) {
        // });
      };
      $scope.typing = false;
      $scope.ontyping = function(){
        if ($scope.empty($scope.cmt.txt)) {
          if ($scope.typing) {
            $scope.chatclient.removeTyping();
            $scope.typing = false;
          }
        } else {
          if (!$scope.typing) {
            $scope.chatclient.addTyping();
            $scope.typing = true;
          }
        }
      };

      // $scope.rendercomments2 = function(p, user){
      //   $scope.cmtloaded = false;
      //   $http.get('/api/data/comments?topic='+ $scope.topic +'&u=' + user +'&p=' + p + "&sz="+$scope.sz)
      //     .success(function(data, status, headers, config) {
      //       $scope.cset = data;
      //       $scope.page = p;
      //       $scope.cmtloaded = true;
      //   });
      // };

      $scope.chatclient.init($scope.uinfo.name);
      function disconnect() {
        $scope.chatclient.close();
      }
      // $scope.sendmsg = function() {
      //   var el = document.getElementById("msgInput");
      //   console.log("msg="+el.value);
      //   $scope.chatclient.sendMessage(el.value);
      //   // addmsg(el.value);
      // }

});
/*********************************************************/


