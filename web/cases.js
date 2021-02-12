
msloaded = true;
changes = {};
mseries=[];
mstats = {};
mstot={};
cfdtstat=[];
mpage = 1;
eacmstot = {}
wacmstot = {}
eacmstatstot = 0;
wacmstatstot = 0;
var eac2 = []; 
var wac2 = []; 
eaccfdtstat = [];
waccfdtstat = [];

sdetail = []
seriesrow = null;
vcaseid = null;

Chart.defaults.global.defaultFontColor= '#fff';

function init () {
//  $('html').addClass ( 'dom-loaded' );
  // $('<footer>Appended with Cash</footer>').appendTo ( document.body );
  // getTrends();
  // getStacks();
  loadmseries();
  // contribs();
};

  function getMsbg(sn) {
    var k = mseries.indexOf(sn);
    if (k == -1) {
      return '#fff';
    }
    var stat = mstats[k];
    if (stat.chguser.startsWith("*")) {
      return '#ccffff'; // inprog
    }
    if (stat.rec + stat.rfe + stat.app + stat.rrr == 0 ) {
      return '#e8e8e8'; // empty
    }    
    var days = getAgeDays(stat.chgdt);
    switch (days) {
      case 0: return '#bbf8bb'; // today
      case 1: return '#f6faaa'; // yday
      case 2: return '#ffddaa'; // 3-day
      case 3: return '#ffc8e0'; // 2-day
    }
    return '#dce4ff'; // 2-day
  }
  function getAgeDays (datestr) {
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
  }

var eacstart=150;
var wacstart=150;
var seriesrange=50;

  function loadmseries () {
    if (!msloaded)
      return;
    eacmstot = {'rec':0, 'wtd':0, 'rfe':0, 'rrr':0, 'app':0, 'dnm':0, 'chg':0};
    wacmstot = {'rec':0, 'wtd':0, 'rfe':0, 'rrr':0, 'app':0, 'dnm':0, 'chg':0};
    // mstot = {'rec':0, 'rfe':0, 'rrr':0, 'app':0, 'chg':0};
	  for (var i=0;i<seriesrange;i++) {
	     eac2[i] = new Array(6).fill(0);
	  }
	  for (var i=0;i<seriesrange;i++) {
	     wac2[i] = new Array(6).fill(0);
	  }
    msloaded = false;
    // var img = document.getElementById("msloadedimg");
    // img.src = "tracker/img/refresh.gif";
      // $("infoToggler").find('img').toggle();
      $("#infoToggler").attr("src", "tracker/img/refresh.gif");

    $.getJSON('/api/data/vcases18/test?a=mseries', 
    	function(data) {
      mstats = data;
      var cdt = null;
      var cfdt = true;
      eaccfdtstat = [0,0,0,0,0,0,0];
      waccfdtstat = [0,0,0,0,0,0,0];
      eacmstatstot = 0;
      wacmstatstot = 0;
      for (var i=0; i<mstats.length; i++) {
        var ms = mstats[i];
        if (ms.id.startsWith('EAC'))
          eacmstatstot++;
        else
          wacmstatstot++;

        var cday = parseInt(ms.id.substring(5,8));
        var csub = parseInt(ms.id.substring(8,10));
        if (ms.id.charAt(0) == 'E') {
          eac2[cday-eacstart][csub-50] = 1;
        } else {
          wac2[cday-wacstart][csub-50] = 1;
        }
        if (cdt == null)
            cdt = ms.chgdt.substring(0, 10);
        if (cdt == ms.chgdt.substring(0, 10)) {
          mstats[i]['cdt'] = false;
        } else {
          cfdt = false;
          mstats[i]['cdt'] = true;
          cdt = ms.chgdt.substring(0, 10);
        }
        changes[ms.id] = ms.chgs;
        mseries.push (ms.id);

        var tot2 = ms.id.startsWith('EAC') ? eacmstot : wacmstot;
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
      msloaded = true;
      // var img = document.getElementById("msloadedimg");
      // img.src = "tracker/img/refresh.png";  
//      $("infoToggler").find('img').toggle();
      $("#infoToggler").attr("src", "tracker/img/refresh.png");
      caselist();

      if (!vcaseid) {
        var r = Math.floor(Math.random() * mseries.length);
        vcaseid = mseries[r];
        getvcase(vcaseid, "latest", null, false);
      }
      // eaccfdtstat = eaccfdtstat;
      // waccfdtstat = waccfdtstat;
    });

  }

function caselist() {
  stbl = document.getElementById("seriestbl");
  var tableRows = stbl.getElementsByTagName('tr');
  var rowCount = stbl.rows.length;
  // console.log("rowCount=" + rowCount);
  for (var x=1; x<rowCount; x++) {
    // console.log("x=" + x);
    // if(tableRows[x])
     stbl.deleteRow(-1);
  }

  for (var n=0; n< seriesrange; n++) {
    var st = mstats[n];
    var tr = stbl.insertRow();
    tr.innerHTML = '<td class="cd">' +(eacstart + n) +'</td>';
    var td = tr.insertCell();
    for (k=0; k<6; k++) {
      var div = document.createElement('DIV');
      div.classList.add( 's');
      div.style.backgroundColor = getMsbg( 'EAC19'+(eacstart+n) + (50+k) );
      div.id = 'EAC19'+(eacstart+n) + (50+k);
      if (mseries.indexOf(div.id) != -1) {
        div.onclick = function(){ 
          getvcase(this.id, null, null, true) 
        };
      } else {
        div.style.color = '#ccc';
      }
      div.innerHTML = '<span>' + (50 + k) + '</span>';
      td.appendChild(div);
    }
    tr.insertAdjacentHTML('beforeend', '<td class="cd">' +(wacstart + n) +'</td>');
    var td = tr.insertCell();
    for (k=0; k<6; k++) {
      var div = document.createElement('DIV');
      div.classList.add( 's');
      div.style.backgroundColor = getMsbg( 'WAC19'+(wacstart+n) + (50+k) );
      div.id = 'WAC19'+(wacstart+n) + (50+k);
      if (mseries.indexOf(div.id) != -1) {
        div.onclick = function(){ 
          getvcase(this.id, null, null, true) 
        };
      } else {
        div.style.color = '#ccc';
      }
      div.innerHTML = '<span>' + (50 + k) + '</span>';
      td.appendChild(div);
    }
  }
}

function casegrid() {
  var div = document.getElementById("casegrid");
  // div.innerHTML = '';
  // $(div).empty();
  var div2 = document.getElementById("caseheader");
  div2.innerHTML = 

  '<span style="background-color: ' + getMsbg( vcase.id ) + ';border:1px solid #888; border-radius:50%"> ' +
  '&nbsp;&nbsp;&nbsp;&nbsp;</span>&nbsp;&nbsp; ' +
  '<span style="font-size:20px;">' +vcase.id + '</b>&nbsp;&nbsp;</span>' +vcase.dt+ ' ' +
  '&nbsp;&nbsp;' +
  '<span style="font-size:14px;" ng-hide="changes[vcase.id] == null">' +
  'Update : ' + timeago(vcase.chgdt) + ' ago by <span style="color:#00a;">' +vcase.chguser+ '</span></span> ' ;

  var ctbl = document.getElementById("tbl");
  var rowCount = ctbl.rows.length; 
  while(rowCount--) ctbl.deleteRow(rowCount);
  var tr = ctbl.insertRow()
  tr.insertCell();
  for (var n=0; n<100; n++) {
    var td = tr.insertCell();
    td.innerText = n%10 == 0? ''+n/10 : n%5 == 0? '*' : '';
  }
  for (var n=0; n<10; n++) {
    tr = ctbl.insertRow();
    var td = tr.insertCell();
    td.innerText = '' + n;
    for (var k=0; k<100; k++) {
      td = tr.insertCell();
      td.id = vcase.id + n + (k < 10 ? '0' + k : k);
      td.onclick = function () {history(this.id); };
      td.title = td.id + ' ' + getDetail(n*100 + k);
      td.style.backgroundColor = getColor(n*100 + k);
      td.style.border = getBorder(vcase.id, (n*100 + k));
    }
  }
  div.appendChild(ctbl);

  tr = document.getElementById("gridtotals");
  tr.innerHTML = 'Received: <span style="color: blue">' + sdetail[0]+ '</span>&nbsp;&nbsp;&nbsp;'+
                'RFE Req Mailed: <span style="color: blue">' + sdetail[3]+ '</span>&nbsp;&nbsp;&nbsp;'+
                'RFE Resp Recv.: <span style="color: blue">' + sdetail[7]+ '</span>&nbsp;&nbsp;&nbsp;'+
                'Transferred: <span style="color: blue">' + sdetail[6]+ '</span>&nbsp;&nbsp;&nbsp;'+
                'Decision Notice: <span style="color: blue">' + sdetail[8]+ '</span>&nbsp;&nbsp;&nbsp;'+
                'Approved: <span style="color: blue">' + sdetail[1]+ '</span>&nbsp;&nbsp;&nbsp;';
  };

clr = {0: "#ee0", 1: "#0c0", 2: "#fa6", 3: "#fbf", 4: "#ace", 
              5: "#fff", 6: "#bb0", 7: "#eb0", 8: "#07e", 9: "#a60",
              a: "#4f0"};

// $scope.echg = ['Received','Approved','Rejected','RFE','Other','Not I-129','Transferred','RFE Resp','DNM'];
echg = {0: 'Received', 1: 'Approved', 2: 'Rejected', 3: 'RFE', 4: 'Other', 
               5: 'Not I-129', 6: 'Transferred', 7: 'RFE Resp', 8: 'DNM', 9: 'Withdrawn', 
               a: 'RFE-Approved'};

function getColor (n) {
    c = res.length > n ? res[n].charAt(0) : '5'
    return clr[c];
  }
function getDetail (n) {
    csa = res.length > n ? res[n] : '5'
    if ( csa == undefined || csa == "5")
      return "";
    return echg[csa.charAt(0)] + ' ' + 
      parseInt(csa.charAt(1), 36) +"-"+parseInt(csa.charAt(2), 36) +"-"+parseInt(csa.charAt(3), 36);
  }
function getClz (n) {
    return "c"+n;
  }
function getBorder (series, num) {
    var chgs = "," + changes[series] + ",";
    if (chgs.indexOf("," + num + ",") != -1) {
      return '2px solid #008';
    }
    return '';
  }

// ============================ //
  var chgloaded = false;
  var imagedata = null;
  var statnames = {0: "Received", 1: "Approved", 2: "Rejected", 3: "RFE Req",
    4: "Other", 5: "Not Form I-129", 6: "Transferred", 7: "RFE resp rec",
    8: "Decision Notice", 9: "Withdrawn", a: "RFE-Approved"};

  function history (casenum) {
    var htitle = document.getElementById("historytitle");
    htitle.innerText = "Case History - " + casenum;
    getHttp('/api/data/vcases18/?a=history&casenum='+casenum, function(data) {
      chgloaded = true;
      imgdata = 'data:image/png;base64,' + data;
      var himg = document.getElementById("historyimg");
      himg.src = imgdata;
      var htbl = document.getElementById("historytbl");
      htbl.style.display = '';
      // <td colspan=2><IMG ng-if="chgloaded" ng-src="{{imgdata}}"></td>

    });
  }
  function getStatus(n) {
    return statnames[n];
  }



// ============================ //
var res = [];

  function getvcase (id, nav, dt, scrl) {
    // console.log("getvcase called");
    if (id == null) {
      return;
    }
    // console.log("getvcase api called");
    vcaseid = id;
    $.getJSON('/api/data/vcases18/vcaseform?vcase='+ vcaseid + (nav == undefined ? "" : "&nav="+nav +"&dt="+dt), 
    	function(data) {
        // console.log('data=' + JSON.stringify(data));
        if (data == "empty") {
          return;
        }
        seriesrow = null;
        // if (scrl) {
        //   anchorSmoothScroll.scrollTo('seriesgrid');
        // }
        if (scrl) {
          $('html, body').animate({
              scrollTop: $("#seriesgrid").offset().top
          }, 1000);
        }

        vcase = data;
        res = vcase.data.split(",");
        var stats = [0, 0, 0, 0, 0, 0, 0, 0, 0];
        for (var i=0; i<res.length; i++) {
          switch (res[i].charAt(0)) {
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
        sdetail = stats;
    console.log('res=' + res.length);
    casegrid();
    document.getElementById("progtitle").innerHTML = 'Series Progress - ' + vcase.id;

    // console.log("linechart --------------------");
    var ctx2 = document.getElementById("schart").getContext("2d");
    var linelabels = [];
    for (var i=0; i<vcase.stats.length; i++) {
      linelabels.push (vcase.stats[i].dt.substring(5));
    }
    var linerecs = [];
    for (var i=0; i<vcase.stats.length; i++) {
      linerecs.push (vcase.stats[i].rec);
    }
    var lineapps = [];
    for (var i=0; i<vcase.stats.length; i++) {
      lineapps.push (vcase.stats[i].app);
    }
    var linerfes = [];
    for (var i=0; i<vcase.stats.length; i++) {
      linerfes.push (vcase.stats[i].rfe);
    }
    var lineresps = [];
    for (var i=0; i<vcase.stats.length; i++) {
      lineresps.push (vcase.stats[i].rrr);
    }
    var linednms = [];
    for (var i=0; i<vcase.stats.length; i++) {
      linednms.push (vcase.stats[i].dnm);
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
  }

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
function timeago(datestr) {
    if (datestr == undefined)
      return '';
    var a = datestr.split(" ");
    var ad = a[0].split("-");
    var at = a[1].split(":");
    var dt = new Date(
        parseInt(ad[0]), 
        parseInt(ad[1]) - 1, 
        parseInt(ad[2]), 
        parseInt(at[0]), 
        parseInt(at[1]), 
        parseInt(at[2])
        );
    dt.setTime( dt.getTime() - dt.getTimezoneOffset()*60*1000 );
    var seconds = Math.floor((new Date() - dt) / 1000);

    if (seconds >= 31536000) {
        var interval = Math.floor(seconds / 31536000);
        return interval + (interval > 1 ? " years" : "year");
    }
    if (seconds >= 2592000) {
        var interval = Math.floor(seconds / 2592000);
        return interval + (interval > 1 ? " months" : " month");
    }
    if (seconds >= 86400) {
        var interval = Math.floor(seconds / 86400);
        return interval + (interval > 1 ? " days" : " day");
    }
    if (seconds >= 3600) {
        var interval = Math.floor(seconds / 3600);
        return interval + (interval > 1 ? " hrs" : " hr");
    }
    if (seconds >= 60) {
        var interval = Math.floor(seconds / 60);
        return interval + " min";
    }
    return seconds + " sec";
  }
function getHttp(url, fn){
    var request = new XMLHttpRequest();
    request.onreadystatechange = function() {
        if (request.readyState == XMLHttpRequest.DONE) {
            fn(request.responseText);
        }
    }
    request.onerror = function() {
      console.log('There was a connection error of some sort');
    };
    request.open('GET', url, true);
    request.send();
}

