

  function loadmseries () {
    eacmstot = {'rec':0, 'wtd':0, 'rfe':0, 'rrr':0, 'app':0, 'dnm':0, 'chg':0};
    wacmstot = {'rec':0, 'wtd':0, 'rfe':0, 'rrr':0, 'app':0, 'dnm':0, 'chg':0};
    // mstot = {'rec':0, 'rfe':0, 'rrr':0, 'app':0, 'chg':0};
	  for (var i=0;i<45;i++) {
	     eac2[i] = new Array(6).fill(0);
	  }
	  for (var i=0;i<45;i++) {
	     wac2[i] = new Array(6).fill(0);
	  }

    getJson('/api/data/vcases18/test?a=mseries', 
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
          eac2[cday-130][csub-50] = 1;
        } else {
          wac2[cday-130][csub-50] = 1;
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
      caselist();

      var tr = document.getElementById("eactotals");
      tr.innerHTML = ' <td rowspan=2>Totals</td> ' + 
                        '<td>EAC ' + eacmstatstot + '</td> ' + 
                        '<td>' + eacmstot.rec + '</td> ' + 
                        '<td>' + eacmstot.wtd + '</td> ' + 
                        '<td>' + eacmstot.rfe + '</td> ' + 
                        '<td>' + eacmstot.rrr + '</td> ' + 
                        '<td>' + eacmstot.app + '</td> ' + 
                        '<td style="border-right: 1px solid #aaa;">' + eacmstot.dnm + '</td> ' + 
                        '<td rowspan=2 align="center">&gt;&gt;</td> ' +  
                        '<td style="background-color: #fe8">' +eaccfdtstat[0]+ '</td> ' + 
                        '<td style="background-color: #fe8">' +eaccfdtstat[1]+ '</td> ' + 
                        '<td style="background-color: #fe8">' +eaccfdtstat[2]+ '</td> ' + 
                        '<td style="background-color: #fe8">' +eaccfdtstat[3]+ '</td> ' + 
                        '<td style="background-color: #fe8">' +eaccfdtstat[4]+ '</td> ' + 
                        '<td style="background-color: #fe8">' +eaccfdtstat[5]+ '</td> ' +  
                        '<td>&nbsp;</td> ';


      tr = document.getElementById("wactotals");
      tr.innerHTML = ' <td>WAC' + wacmstatstot + '</td> ' + 
                        '<td>' + wacmstot.rec + '</td> ' + 
                        '<td>' + wacmstot.wtd + '</td> ' + 
                        '<td>' + wacmstot.rfe + '</td> ' + 
                        '<td>' + wacmstot.rrr + '</td> ' + 
                        '<td>' + wacmstot.app + '</td> ' + 
                        '<td style="border-right: 1px solid #aaa;">' + wacmstot.dnm + '</td> ' + 
                        '<td style="background-color: #fe8">' +waccfdtstat[0]+ '</td> ' + 
                        '<td style="background-color: #fe8">' +waccfdtstat[1]+ '</td> ' + 
                        '<td style="background-color: #fe8">' +waccfdtstat[2]+ '</td> ' + 
                        '<td style="background-color: #fe8">' +waccfdtstat[3]+ '</td> ' + 
                        '<td style="background-color: #fe8">' +waccfdtstat[4]+ '</td> ' + 
                        '<td style="background-color: #fe8">' +waccfdtstat[5]+ '</td> ' + 
                        '<td>&nbsp;</td> ' ;

        mtbl = document.getElementById("mtbl");
        for (var i=(mpage-1) * 30; i< (mstats.length > mpage*30 ? mpage*30: mstats.length); i++) {
        	var st = mstats[i];
        	var tr = mtbl.insertRow();
        	tr.style.backgroundColor = st.chguser.startsWith('*') ? '#aff' : '';
        	tr.style.borderTop = st.cdt ? '3px solid #e84': '';
			tr.innerHTML = 
                        '<td> ' + st.chguser + '</td> ' +
                        '<td><span onclick="getvcase(\'' + st.id + '\', null, null, true);" style="color: #66c;cursor: pointer;"> ' + st.id + '</span></td> ' +
                        '<td style="color: #880"> ' + st.rec + '</td> ' +
                        '<td style="color: #880"> ' + st.wtd + '</td> ' +
                        '<td style="color: #606"> ' + st.rfe + '</td> ' +
                        '<td style="color: #840"> ' + st.rrr + '</td> ' +
                        '<td style="color: #080"> ' + st.app + '</td> ' +
                        '<td style="border-right: 1px solid #aaa;"> ' + st.dnm + '</td> ' +
                        '<td> ' + Math.round(st.nhours/24) + '</td> ' + 
                        '<td style="color: #00f"> ' + (!st.chgs ? 0 : st.chgs.split(',').length) + '</td> ' +
                        '<td style="color: #00f"> ' + (!st.tchgs ? 0 : st.tchgs.crfe) + '</td> ' +
                        '<td style="color: #00f"> ' + (!st.tchgs ? 0 : st.tchgs.cresp) + '</td> ' +
                        '<td style="color: #00f"> ' + (!st.tchgs ? 0 : st.tchgs.cdnm) + '</td> ' +
                        '<td style="color: #00f"> ' + (!st.tchgs ? 0 : st.tchgs.app1) + '</td> ' +
                        '<td style="color: #00f"> ' + (!st.tchgs ? 0 : st.tchgs.app2) + '</td> ' +
                        '<td title =" ' + st.chgdt + ' GMT"> ' + timeago(st.chgdt) + '</td> ';
        }

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
  for (var n=0; n< 45; n++) {
    var st = mstats[n];
    var tr = stbl.insertRow();
    tr.innerHTML = '<td class="cd">' +(130 + n) +'</td>';
    var td = tr.insertCell();
    for (k=0; k<6; k++) {
      var div = document.createElement('DIV');
      div.classList.add( 's');
      div.style.backgroundColor = getMsbg( 'EAC18'+(130+n) + (50+k) );
      div.id = 'EAC18'+(130+n) + (50+k);
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
    tr.insertAdjacentHTML('beforeend', '<td class="cd">' +(130 + n) +'</td>');
    var td = tr.insertCell();
    for (k=0; k<6; k++) {
      var div = document.createElement('DIV');
      div.classList.add( 's');
      div.style.backgroundColor = getMsbg( 'WAC18'+(130+n) + (50+k) );
      div.id = 'WAC18'+(130+n) + (50+k);
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
  var tr = ctbl.insertRow();
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
}

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
    getJson('/api/data/vcases18/vcaseform?vcase='+ vcaseid + (nav == undefined ? "" : "&nav="+nav +"&dt="+dt), 
    	function(data) {
        // console.log('data=' + JSON.stringify(data));
        if (data == "empty") {
          return;
        }
        seriesrow = null;
        // if (scrl) {
        //   anchorSmoothScroll.scrollTo('seriesgrid');
        // }
 
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

