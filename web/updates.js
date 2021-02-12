

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

function init () {
  // getTrends();
  // getStacks();
  loadmseries();
  contribs();
};

// =================================
  function contribs () {
    $.getJSON('/api/data/vcases18/test?a=getadmins', function(data) {
        var cd = document.getElementById("contribtd");
    for (var i = 0; i < data.length; i++) {
      var a = data[i];
      cd.insertAdjacentHTML('beforeend',
        '<div class="cbadge">' + a.name + ' <span style="color: blue"> ' + a.count + '</span></div>');
    }
    });
  }

// =================================
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
      $("#infoToggler").attr("src", "tracker/img/refresh.png");
      // caselist();

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

      updatesfeed(0);
    });
  }
function updatesfeed(inc) {
        mpage += inc;
        if (mpage > 1)
          $("#uPrev").show();
        else
          $("#uPrev").hide();
        if (mpage < 6)
          $("#uNext").show();
        else
          $("#uNext").hide();

        $("#pagenum").text("Page " + mpage);

        mtbl = document.getElementById("mtbl");
        var tableRows = mtbl.getElementsByTagName('tr');
        var rowCount = mtbl.rows.length;
        for (var x=3; x<rowCount; x++) {
          mtbl.deleteRow(-1);
        }

        for (var i=(mpage-1) * 30; i< (mstats.length > mpage*30 ? mpage*30: mstats.length); i++) {
          var st = mstats[i];
          var tr = mtbl.insertRow();
          tr.style.backgroundColor = st.chguser.startsWith('*') ? '#aff' : '';
          tr.style.borderTop = st.cdt ? '3px solid #e84': '';
          tr.innerHTML = 
                        '<td> ' + st.chguser + '</td> ' +
                        // '<td><span onclick="getvcase(\'' + st.id + '\', null, null, true);" style="color: #66c;cursor: pointer;"> ' + st.id + '</span></td> ' +
                        '<td><span style="color: #66c;"> ' + st.id + '</span></td> ' +
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

}
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
};


