//deh el fn el btfta7 el url el 3ayzo fe same exact page bas fe div mo3yan

function loadPage(url, targetDivId) {

  //fetch badeeel el XMLHttpRequest()  used 3shan a request data el html yanee  without having to do a full page refresh.
fetch(url)
    .then(function(response) {
        return response.text();
    })
    .then(function(html) {
        document.getElementById(targetDivId).innerHTML = html;
    })
   }

    /*function loadPage(url, targetDiv) {
    var x = new XMLHttpRequest();
   x.onreadystatechange = function() {
        document.getElementById(targetDiv).innerHTML = this.responseText;
    };
    x.open("GET", url, true);
    x.send();
  }*/