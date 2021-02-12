window.chartColors = {
  rec:'#cc0', 
  rfe:'#f8d', 
  rrr:'#eca', 
  dnm:'#09f',
  oth:'#8ce',
  app:'#0b0',
  trf:'#b84',
  wtd:'#c64'
};
Chart.defaults.global.defaultFontColor= '#fff';

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

function getTrends() {
  getJson('/api/data/vcases18/test?a=trends', function(data) {
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
            ticks: { beginAtZero: true, max: 50000}
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
            ticks: { beginAtZero: true, max: 50000}
          }]
        }
      }
    });
  });
}

stacksloaded = false;
function getStacks() {
    getJson('/api/data/vcases18/stackedcols?pre=EAC', function(data) {
      stacksloaded = true;
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
    getJson('/api/data/vcases18/stackedcols?pre=WAC', function(data) {
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
}