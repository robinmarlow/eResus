var link2title_map = new Map();
link2title_map.set( "home", "Home");

$(document).ready(function(){

$.getJSON( "assets/data/eResus.json", function( data ) {
  
   const frag = document.createDocumentFragment();

   var box_titles = Object.keys(data);
   console.log("found ", box_titles.length, " different sub_pages");

   for(var i = 0; i < box_titles.length; i++) {
     let pack = document.createElement("div");
     pack.className="packOfCards row";
     pack.id=box_titles[i];

     if(box_titles[i]!="home")
     {pack.setAttribute("style", "display:none");}

     let card_data = data[box_titles[i]];

       for(var j = 0; j < card_data.length; j++) {
        var obj = card_data[j];
        link2title_map.set( obj.link, obj.title);

        /* <div class="card" style="width: 12em;">
        <img class="card-img-top" src="assets/img/medical.png" alt="Medical">
        <div class="card-body">
          <h5 class="card-title text-center">Medical</h5>
        </div>
        </div> */

        var col = document.createElement("div");
        col.className="col col-lg-3";

        var new_card = document.createElement("div");
        new_card.className="card";
        new_card.setAttribute("style" , "width: 12em;");
        new_card.setAttribute("page"    , obj.page);
        new_card.setAttribute("title"    , obj.title);
        new_card.setAttribute("link"     , obj.link);
        new_card.setAttribute("action"    , obj.action);

        if (box_titles[i]=="home"){
        var card_img = document.createElement("img");
        card_img.className="card-img-top";
        card_img.alt = obj.title;
        card_img.src = "./assets/img/".concat(obj.image);
        card_img.setAttribute("style" , "width: 180px; height: 180px;");
        new_card.appendChild(card_img);
        }

        if (box_titles[i]!="home"){
          new_card.setAttribute("style" , "height: 6rem;");
          }

        var card_content = document.createElement("h5");
        card_content.className = "card-title text-center ";
        card_content.innerHTML=obj.title;

        var card_body = document.createElement("div");
        card_body.className = "card-body align-middle";
        card_body.appendChild(card_content);
       
        new_card.appendChild(card_body);
        col.appendChild(new_card)        
        pack.appendChild(col);

        //new_card.appendChild(card_body);        
        //pack.appendChild(new_card);
    }
    frag.appendChild(pack);
  }
  document.getElementById('cards').appendChild(frag);
  hashHandler();
});


$( "#cards" ).on( "click", "div", function( event ) {
    event.preventDefault();
    //console.log("--------------------------------------");
    console.log("card event listener found a click of ", $( this ).attr('title') );
    //console.log( jsonmap.get($( this ).attr('did')) );
    //console.log( $( this ).attr('link') );
    //console.log("--------------------------------------");
    
    //jsonmap.get($( this ).attr('did')).link / title / etc

    switch($( this ).attr('action')) {

      case "navigate":
        location.hash = location.hash.concat("&",$( this ).attr('link'));
        break;

      case "page":
        location.hash = location.hash.concat("&",$( this ).attr('link') );
        break;
 
      case "external":
        console.log("open window to....");
        var myWindow = window.open( $( this ).attr('link'), "_self");
        break;

      default:
        console.log("Oh dear! No action defined!");
    }

// Google tracking code!
    //$.get( "https://script.google.com/macros/s/AKfycbxRjFBnNxcaqtXVshuiC2NaxRx9ZlCSIKE4ekn3tO0NExX4Jg/exec",
    //      { Title : $( this ).attr('title'),
    //        URL   : $( this ).attr('link')} );
    
});





$( "#breadcrumbs" ).on( "click", "li", function( event ) {

//
// Reads the '#home&trauma' and trims it to where was clicked then sets the hash to that.
//

  console.log("clicked on: ",$( this ).attr('link') );
  
  let hashlink = $( this ).attr('link') ;
  let hash=location.hash.replace('#&','').replace('#','');
  let endpoint = (hash.indexOf(hashlink)+hashlink.length);
  
  console.log(hash.substring(0, endpoint));
  location.hash=hash.substring(0, endpoint);
});


function drawCrumbs(crumbs){
//
// erases all the crumb elements then redraws from the crumbs array it was passed.
//
  console.log("draw crumbs",crumbs);
  var elements = document.getElementsByClassName("breadcrumb-item");
  while(elements.length > 0){
      //console.log("removing element");
      elements[0].parentNode.removeChild(elements[0]);
  }
  
crumbs.forEach( function (element) {
  //console.log("add ",element);
  var new_breadcrumb = document.createElement("li");
  new_breadcrumb.className = "breadcrumb-item";
  new_breadcrumb.innerHTML = link2title_map.get(element);
  new_breadcrumb.setAttribute("link",element);
  $("#breadcrumbs > ol").append(new_breadcrumb);
});

}



function displayPage(MDfile) {

  console.log("showing page....",MDfile);

  var body_location = './guidelines.md/'.concat(MDfile);
    
  function getText(myUrl){
      var result = null;
      $.ajax( { url: myUrl, 
                type: 'get', 
                dataType: 'html',
                async: false,
                success: function(data) { result = data; } 
              }
      );
      FileReady = true;
      return result;
  }

  var markdown_source = getText(body_location);      
  converter = new showdown.Converter(),
  html = converter.makeHtml(markdown_source);
  document.getElementById('contentBox').innerHTML = html;
  
}



function hashHandler() {
  document.body.scrollTop = document.documentElement.scrollTop = 0;

  let urlhash=location.hash.replace('#&','').replace('#','');
  console.log('full hash:', urlhash);
  crumbs = urlhash.split("&");
  console.log('component links:', crumbs);
  
  drawCrumbs(crumbs);

  active_crumb=crumbs[crumbs.length-1];
  
  console.log('The active page has changed to:', active_crumb);
  if (active_crumb === '') {
    console.log("resetting to home");
    location.hash = "home";

  } else if( /\.md$/.test(active_crumb) ) {
    console.log ("creating html page");
    displayPage(active_crumb);
    $( ".packOfCards" ).hide();
    $( "#contentBox" ).show();
     //document.getElementById("contentBox").style.display = "block";

  } else {
    console.log ("navigating to section")
    $( "#contentBox" ).hide();
    $( ".packOfCards" ).hide();
    //console.log( "#".concat(active_crumb) );
    $( "#".concat(active_crumb)).show();
  }  
}

window.addEventListener('hashchange', hashHandler, false);


});