
msloaded = false;
changes = {};
mseries=[];
mstats = {};
mstot={};
vcaseid = null;
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

vacase = null;
// res = []
sdetail = []
seriesrow = null;


  function getMsbg(sn) {
    var k = mseries.indexOf(sn);
    if (k == -1) {
      return '#fff';
    }
    var stat = mstats[k];
    if (stat.chguser.startsWith("*")) {
      return '#ccffff'; // inprog
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


// =================================
  function contribs () {
    getJson('/api/data/vcases18/test?a=getadmins', function(data) {
        var cd = document.getElementById("contribtd");
		for (var i = 0; i < data.length; i++) {
			var a = data[i];
			cd.insertAdjacentHTML('beforeend',
				'<div class="cbadge">' + a.name + ' <span style="color: blue"> ' + a.count + '</span></div>');
		}
    });
  }
// =================================

  function getcomments () {
	getJson('/api/user/test?a=checkadmin&id=' + localStorage.getItem('wt_id'), function(data) {
	  uadmin =  data.status == "success";
	  // console.log("=================== admin= " + $scope.uadmin);
	});


    getJson('/api/data/vcases18/test?a=getadmins', function(data) {
        var cd = document.getElementById("contribtd");
		for (var i = 0; i < data.length; i++) {
			var a = data[i];
			cd.insertAdjacentHTML('beforeend',
				'<div class="cbadge">' + a.name + ' <span style="color: blue"> ' + a.count + '</span></div>');
		}
    });
  }






// =================================


function init () {
//	$('html').addClass ( 'dom-loaded' );
	// $('<footer>Appended with Cash</footer>').appendTo ( document.body );
  getTrends();
  getStacks();
  loadmseries();
  contribs();
};
