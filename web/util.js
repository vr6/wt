function getJson(url, fn){
    var request = new XMLHttpRequest();
    request.onreadystatechange = function() {
        if (request.readyState == XMLHttpRequest.DONE) {
            var data = JSON.parse(request.responseText);
            fn(data);
        }
    }
    // request.onload = function() {
    //   if (request.status >= 200 && request.status < 400) {
    //     var data = JSON.parse(request.responseText);
    //     fn(data);
    //   } else {
    //     console.log('We reached our target server, but it returned an error');
    //   }
    // };
    request.onerror = function() {
      console.log('There was a connection error of some sort');
    };
    request.open('GET', url, true);
    request.send();
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

function show (el, b) {
    if(b) {
        el.removeClass(hide);
        el.addClass(show);
    }
}
function hide (el, b) {
    if(b) {
        el.removeClass('show');
        el.addClass('hide');
    }
}

