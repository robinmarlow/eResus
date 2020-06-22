
$(document).ready(function(){

$.getJSON( "assets/data/eResus.json", function( data ) {
  
   const frag = document.createDocumentFragment();
     
       for(var i = 0; i < data.length; i++) {
        var obj = data[i];
        //jsonmap.set( did, obj);
        console.log(obj.title);
        //add("guidelineBox", obj.title, obj.link, obj.summary, obj.category);

        /* <div class="card" style="width: 12em;">
        <img class="card-img-top" src="assets/img/medical.png" alt="Medical">
        <div class="card-body">
          <h5 class="card-title text-center">Medical</h5>
        </div>
        </div> */

        var new_card = document.createElement("div");
        new_card.className="card";
        new_card.setAttribute("style" , "width: 12em");
        new_card.setAttribute("page"    , obj.page);
        new_card.setAttribute("title"    , obj.title);
        new_card.setAttribute("link"     , obj.link);
        new_card.setAttribute("action"    , obj.action);

        var card_img = document.createElement("img");
        card_img.className="card-img-top";
        card_img.alt = obj.title;
        card_img.src = "./assets/img/".concat(obj.image);


        var card_content = document.createElement("h5");
        card_content.className = "card-title text-center";
        card_content.innerHTML=obj.title;

        var card_body = document.createElement("div");
        card_body.className = "card-body";
        card_body.appendChild(card_content);

        new_card.appendChild(card_img);
        new_card.appendChild(card_body);

        if(obj.page!="index")
        {
          new_card.setAttribute("style", "display:none");
        }
        
        frag.appendChild(new_card);
    }
    document.getElementById('cards').appendChild(frag);

});


$( "#cards" ).on( "click", "div", function( event ) {
    //event.preventDefault();
    console.log("--------------------------------------");
    console.log("nice event listener found a click.....");
    console.log( $( this ).attr('title') );
    //console.log( jsonmap.get($( this ).attr('did')) );
    //console.log( $( this ).attr('link') );
    console.log("--------------------------------------");
    
    //jsonmap.get($( this ).attr('did')).link / title / etc
    
    switch($( this ).attr('action')) {

      case "navigate":
        // code block
        console.log("navigate....");
        location.hash = $( this ).attr('did');
        break;

      case "page":
        // code block
        console.log("show page....");
        location.hash = $( this ).attr('did');
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

  var body_location = './assets/markdown_text/Anaphylaxis.md';
          
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

  // convert markdown to html
  //var output = markdown.toHTML( markdown_source );
  //document.write(output);

  converter = new showdown.Converter(),
  html = converter.makeHtml(markdown_source);
  //document.getElementById('contentBox').innerHTML = html;
  //target.innerHTML = html;
  //document.write(html);

});