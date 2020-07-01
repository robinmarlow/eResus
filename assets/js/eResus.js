var crumbs=["index"];
var link2title_map = new Map();

$(document).ready(function(){

$.getJSON( "assets/data/eResus.json", function( data ) {
  
   const frag = document.createDocumentFragment();

   var box_titles = Object.keys(data);
   console.log("found ", box_titles.length, " different sub_pages");

   for(var i = 0; i < box_titles.length; i++) {
     let pack = document.createElement("div");
     pack.className="packOfCards";
     pack.id=box_titles[i];

     if(box_titles[i]!="index")
     {pack.setAttribute("style", "display:none");}


     let card_data = data[box_titles[i]];

       for(var j = 0; j < card_data.length; j++) {
        var obj = card_data[j];
        link2title_map.set( obj.link, obj.title);
        //console.log(obj.title);
        //add("guidelineBox", obj.title, obj.link, obj.summary, obj.category);

        /* <div class="card" style="width: 12em;">
        <img class="card-img-top" src="assets/img/medical.png" alt="Medical">
        <div class="card-body">
          <h5 class="card-title text-center">Medical</h5>
        </div>
        </div> */

        var new_card = document.createElement("div");
        new_card.className="card";
        new_card.setAttribute("style" , "width: 12em;");
        new_card.setAttribute("page"    , obj.page);
        new_card.setAttribute("title"    , obj.title);
        new_card.setAttribute("link"     , obj.link);
        new_card.setAttribute("action"    , obj.action);

        if (box_titles[i]=="index"){
        var card_img = document.createElement("img");
        card_img.className="card-img-top";
        card_img.alt = obj.title;
        card_img.src = "./assets/img/".concat(obj.image);
        card_img.setAttribute("style" , "width: 180px; height: 180px;");
        new_card.appendChild(card_img);
        }

        if (box_titles[i]!="index"){
          new_card.setAttribute("style" , "height: 6rem;");
          }


        var card_content = document.createElement("h5");
        card_content.className = "card-title text-center ";
        card_content.innerHTML=obj.title;

        var card_body = document.createElement("div");
        card_body.className = "card-body align-middle";
        card_body.appendChild(card_content);

       
        new_card.appendChild(card_body);
        
        pack.appendChild(new_card);
    }
    frag.appendChild(pack);
  }
  document.getElementById('cards').appendChild(frag);
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
      location.hash = $( this ).attr('link')
      //location.hash = location.hash.concat($( this ).attr('link'));
      //add title to breadcrumb
      addCrumb( $( this ).attr('link') );

        // code block
        console.log("navigate....");
        //$( ".contentBox" ).hide();
        //$( ".packOfCards" ).hide();
        //console.log( "#".concat($( this ).attr('link')) );
        //$( "#".concat($( this ).attr('link')) ).show();
        //location.hash = $( this ).attr('link');
        break;

      case "page":
      // code block
      location.hash = "display?".concat( $( this ).attr('link') );
      //location.hash = location.hash.concat($( this ).attr('link') );
      //location.hash = $( this ).attr('link')
      //add title to breadcrumb
      addCrumb( $( this ).attr('link') );
        //location.hash = $( this ).attr('did');
      break;
 
      case "external":
          // code block
          console.log("open window to....");
          var myWindow = window.open("http://youtube.com", "_self");
          break;

      default:
        console.log("this action isn't defined!");
        // code block
    }



    //openNav($( this ).attr('did'));
    //location.hash = $( this ).attr('did');
    //$.get( "https://script.google.com/macros/s/AKfycbxRjFBnNxcaqtXVshuiC2NaxRx9ZlCSIKE4ekn3tO0NExX4Jg/exec",
    //      { Title : $( this ).attr('title'),
    //        URL   : $( this ).attr('link')} );
    
});






$( "#breadcrumbs" ).on( "click", "li", function( event ) {
console.log("clicked on: ",$( this ).attr('link') );

console.log( "current crumbtrail: ", crumbs );

let crumbNo = crumbs.indexOf($( this ).attr('link')) + 1;
console.log("crumbs length:",crumbs.length);
console.log("clicked at level: ",crumbNo);

if ( (crumbs.length > 1) & (crumbNo < crumbs.length) ){
  console.log( "new crumbtrail: ", crumbs.slice(0,crumbNo));
  crumbs = crumbs.slice(0,crumbNo);
  drawCrumbs();
  location.hash = $( this ).attr('link');
} else { 
  console.log("clicked on last element so not doing anything");  
}

});

function addCrumb(link){
  var new_breadcrumb = document.createElement("li");
  new_breadcrumb.className = "breadcrumb-item";
  new_breadcrumb.innerHTML = link2title_map.get(link);
  new_breadcrumb.setAttribute("link"    ,link);
  $("#breadcrumbs > ol").append(new_breadcrumb);
  crumbs.push(link);
}

function drawCrumbs(){

  console.log("draw crumbs",crumbs);
  var elements = document.getElementsByClassName("breadcrumb-item");
  while(elements.length > 0){
      console.log("removing element");
      elements[0].parentNode.removeChild(elements[0]);
  }
  
crumbs.forEach(element => {
  console.log("add ",element);
  var new_breadcrumb = document.createElement("li");
  new_breadcrumb.className = "breadcrumb-item";
  new_breadcrumb.innerHTML = link2title_map.get(element);
  new_breadcrumb.setAttribute("link",element);
  $("#breadcrumbs > ol").append(new_breadcrumb);
});

}



function displayPage(MDfile) {
  console.log("showing page....",MDfile);
  $( ".packOfCards" ).hide();

  var body_location = './assets/markdown_text/'.concat(MDfile);
    
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
  
  $( ".contentBox" ).show();
  //document.getElementById("myNav").style.display = "block";
}



function hashHandler() {
  let hash=location.hash.replace('#','');
  document.body.scrollTop = document.documentElement.scrollTop = 0;
  
  console.log('The hash has changed to:', hash);
  if (hash === '') {
    console.log("resetting to home");
    location.hash = "home";

  //} else if( hash.startsWith("display") ) {
  } else if( /\.md$/.test(hash) ) {
    console.log ("trying to display a page");
    //link=hash.substring(8); //removes display?
    link=hash;
    console.log ("link: ",link);
    //title=link2title_map.get(link);
    //console.log ("title: ",title);    
    //addCrumb(link);
    displayPage(link);
    $( "#contentBox" ).show();
    
  } else {
    console.log ("navigating to section ",hash)
    $( "#contentBox" ).hide();
    $( ".packOfCards" ).hide();
    console.log( "#".concat(hash) );
    $( "#".concat(hash)).show();

  }
  
}

window.addEventListener('hashchange', hashHandler, false);



});