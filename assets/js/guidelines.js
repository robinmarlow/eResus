
var jsonmap = new Map();

/* Open */
function openNav(did) {

  //location.hash = did;
  let PDFToDisplay = jsonmap.get(did).link;
  console.log("trying to open ", PDFToDisplay);

  var pdfembed = document.createElement("embed")
  pdfembed.setAttribute("id" ,   "embeddedpdf");
  pdfembed.setAttribute("src" ,   PDFToDisplay);
  pdfembed.setAttribute("type" ,  "application/pdf");
  pdfembed.setAttribute("width" , "100%");
  pdfembed.setAttribute("height", "100%");

  document.getElementById('pdfgoeshere').appendChild(pdfembed);
  
  document.getElementById('originalpdflink').setAttribute("href", "http://nww.avon.nhs.uk/dms/Download.aspx?did=".concat(did));
  
  
  
  //$("#pdfFrame").attr('src',PDFToDisplay);
  document.getElementById("myNav").style.display = "block";
}

/* Close */
function closeNav() {
  //$("#pdfFrame").attr('src',"#");
  //document.getElementById("embeddedpdf").remove();
  var elem = document.querySelector('#embeddedpdf');
  elem.parentNode.removeChild(elem);
  
  document.getElementById("myNav").style.display = "none";
  location.hash = "";
}


$("#searchBox").on("keyup", function() {
//console.log("searching....");
      var value = $(this).val().toLowerCase();
    $("#guidelineBox > div").filter(function() {
      //$(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)      //$(this).toggle($(this).find("img").attr("alt").toLowerCase().indexOf(value) > -1)
    $(this).toggle($(this).attr("keywords").toLowerCase().indexOf(value) > -1)
    });
  });

function add(parent_id, ObjTitle, ObjLink, ObjSummary, ObjCategory) {
  //Create a link type dynamically.
  //var link = document.createElement("a");
  //link.href = "./pdf.js/web/viewer.html?file=".concat(ObjLink);
  //link.href = ObjLink;
  //link.target = "_blank";
  
  //var img = document.createElement("img");
  //img.alt = ObjTitle.concat(ObjSummary);
  //img.src = "./assets/img/FFFFFF-1.png";
  

  //adding columns not li
  var col = document.createElement("div");
  col.innerHTML = ObjTitle;
  col.className = "col-8";
  col.setAttribute("category" , ObjCategory);
  col.setAttribute("title"    , ObjTitle);
  col.setAttribute("keywords" , ObjTitle.concat(ObjSummary));
  col.setAttribute("link"     , ObjLink);
  //col.setAttribute("onclick",
  //                 "logAccess('"
  //                 .concat(ObjTitle)
  //                 .concat("','")
  //                 .concat(ObjLink)
  //                 .concat("');"));
    
  //var newContent = document.createTextNode(ObjTitle);
  //link.appendChild(newContent);
  //link.appendChild(img);
  //col.appendChild(link);
  
  //element.onclick = function() { myfunc(this)  };
  var foo = document.getElementById(parent_id);
  //Append the element in page (in span).
  foo.appendChild(col);
}




$(document).ready(function(){

$.getJSON( "assets/data/guidelines.json", function( data ) {
  
   const frag = document.createDocumentFragment();
  
//new Promise(function(resolve, reject) {
     
       for(var i = 0; i < data.length; i++) {
        var obj = data[i];
        let did = obj.link.match(/did=(\d*)\&/)[1];
        jsonmap.set( did, obj);
        //console.log(obj.id);
        //add("guidelineBox", obj.title, obj.link, obj.summary, obj.category);
        
        var col = document.createElement("div");
        col.innerHTML = obj.title;
        col.className = "col-8";
        col.setAttribute("category" , obj.category);
        col.setAttribute("title"    , obj.title);
        col.setAttribute("keywords" , obj.title.concat(obj.summary));
        col.setAttribute("link"     , obj.link);
        col.setAttribute("did"     , did);
        if(obj.category!="emergency")
        {
          col.setAttribute("style", "display:none");
        }
        
        frag.appendChild(col);
    }
//  resolve(frag);
//}).then(function(successMessage) {
/*      console.log(successMessage);
      var foo = document.getElementById('guidelineBox');
      foo.appendChild(successMessage);
      //success handler function is invoked
      
    }, function(errorMessage) {
        console.log(errorMessage);
    })
*/
    document.getElementById('guidelineBox').appendChild(frag);
    
    //slight fudge but seem to need to run this here to make emergency intially visible.
    //$("#guidelineBox > div").filter(function() {
    //$(this).toggle($(this).attr("category").toLowerCase().indexOf("emergency") > -1)});
    
});


$('#sectionTabs > li').click(function (e) {
    e.preventDefault();
    
    $('#sectionTabs > li.active').toggleClass("active");
    $(this).toggleClass("active");
    
    //console.log("ActiveTab ".concat( $(this).attr("title")) );
    activeTab=$(this).attr("title");
//    $(".list-group-item").filter(function() {
    $("#guidelineBox > div").filter(function() {
        $(this).toggle($(this).attr("category").toLowerCase().indexOf(activeTab) > -1)
    //showLetters($(this).attr("title"));
    });
    
    //$("#guidelineBox > div:visible:nth-child(even)").css('background', '#EBEFF4');
    //$("#guidelineBox > div:visible:even").css('background', '#FFFFFF');
    
});


$( "#guidelineBox" ).on( "click", "div", function( event ) {
    //event.preventDefault();
    //console.log("--------------------------------------");
    //console.log("nice event listener found a click.....");
    //console.log( $( this ).attr('did') );
    //console.log( jsonmap.get($( this ).attr('did')) );
    //console.log( $( this ).attr('link') );
    //console.log("--------------------------------------");
    
    //jsonmap.get($( this ).attr('did')).link / title / etc
    
    //openNav($( this ).attr('did'));
    location.hash = $( this ).attr('did');
    $.get( "https://script.google.com/macros/s/AKfycbxRjFBnNxcaqtXVshuiC2NaxRx9ZlCSIKE4ekn3tO0NExX4Jg/exec",
          { Title : $( this ).attr('title'),
            URL   : $( this ).attr('link')} );
    
});


function hashHandler() {
  let hash=location.hash.replace('#','');
  
  console.log('The hash has changed to:', hash);
  
  if (hash === '') {
    console.log("pressed back so closing nav");
    closeNav();
  } else if (jsonmap.has(hash)) {
    openNav(hash)
  } else {
    console.log ("can't find that page")
  }
  
}

window.addEventListener('hashchange', hashHandler, false);

document.getElementById("searchBox").focus();

if (navigator.vendor === "Google Inc."){
  console.log("using chrome.....");
  $( '<div>' ).load( "chrome-extension://oemmndcbldboiebfnladdacbdfmadadm/content/web/viewer.html", function( response, status, xhr ){
    if ( status == "success" ) {
      console.log("with pdfextension loaded");
      
      //$( "#error" ).html( msg + xhr.status + " " + xhr.statusText );
  }else if (status == "error"){
    console.log("can't find the extension....");
    $('#chromePluginAlert').show();
  }
    
  });
  
}






});


/*

function detectExtension() {
  var img;
  img = new Image();
  img.src = "chrome-extension://oemmndcbldboiebfnladdacbdfmadadm/content/web/viewer.html";
  img.onload = function() {
    callback(true);
  };
  img.onerror = function() {
    callback(false);
  };
}


// navigator.vendor =="Google Inc."
//chrome-extension://oemmndcbldboiebfnladdacbdfmadadm/icon19.png

  $("#div1").load("chrome-extension://oemmndcbldboiebfnladdacbdfmadadm/content/web/viewer.html", function(responseTxt, statusTxt, xhr){
    if(statusTxt == "success")
      alert("External content loaded successfully!");
    if(statusTxt == "error")
      alert("Error: " + xhr.status + ": " + xhr.statusText);
  });
  
*/