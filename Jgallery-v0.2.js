/**
 * Place your JS-code here.
 */

 $(document).ready(function(){
  'use strict';
  var imageID = 1,  img_prefix = "#image-",
  loaded = parseInt(location.hash.replace(img_prefix, ""));

 document.getElementById('v').innerHTML           = "0.2";
 document.getElementById('v-name').innerHTML      = "Beta RC 2";
 document.getElementById('build').innerHTML       = "145";
 document.getElementById('build-date').innerHTML  = "15-12-2012";

  /* ===================== [ CREATE PLUGIN ] ===================== */
  jQuery.fn.fadeOutAndRemove = function(speed){
    $(this).addClass('removing');
    $(this).fadeOut( speed, function(){
      removed = $(this).remove();
    })
  }

 // ======================= [ LIGHTBOX VIEWER ] ======================= // 
 $('.selected').click(function() {
    var windowHeigth = window.innerHeight || $(window).height(),          // make it work on ipad & android
    windowWidth  = window.innerWidth  || $(window).width();   

    $('<div id="overlay"></div>').addClass('overlay').appendTo('body');   // Display the overlay
    $('<div id="lightbox"></div>').appendTo('body');                      // Create the lightbox container
    
    $('<img>').attr('src', $(this).attr('src'))                           // Display the image on load
    .css({'max-height': windowHeigth,'max-width': windowWidth})
    .load(function() {
      $('#lightbox').css({
        'top':  (windowHeigth - $('#lightbox').height()) / 2,
        'left': (windowWidth  - $('#lightbox').width())  / 2
      });
    }).appendTo('#lightbox');

    $('#overlay, #lightbox').click(function() {                           // Remove it all on click
      $('#overlay, #lightbox').remove();
    });
  });

// ======================= [ Keyboard HANDLERS ] ======================= // 
$('body').keydown(function (e) {
  var keyCode = e.which || e.keyCode,
  key = {left: 37, right: 39, down: 40, del: 46, enter: 13, esc: 27},
  keycodeString = String.fromCharCode(keyCode);

  if(keycodeString >= 1 && keycodeString <= 9) {
    $('.thumbnail').eq(keycodeString-1).trigger('click');
  } else {

   switch (keyCode) {
     case key.del:
     $('.visiting').trigger('dblclick');
     break;

     case key.left:  case key.right:
     moveFocus( $('.visiting'), keyCode );
     selectImage();
     break;

     case key.enter:
     if(!$('.visiting').length) {
      $('.thumbnail :eq(0)').trigger('click');
    } else if (! $('#lightbox').length ) {
      $('.selected').trigger('click');
    } else if($('#lightbox').length) {
      $('#lightbox').trigger('click');
    }
    break;
    case key.esc:
    removeVisiting();
    $('#lightbox').trigger('click');
    break;
  }
}
});

// =======================[ REMOVE AMD MOVE SELECTED IMAGE ] ======================= // 
$('.thumbnail').bind('dblclick', function(e){
  $(this).fadeOutAndRemove(500);
  moveFocus(this);
  selectImage();
}); 

// ================= [ CLICK ON THUMBNAIL ] ==========================================
$('.thumbnail').each(function() {
  $(this).click(function() {
    if (false) { //  if(false) "Fade in" ELSE "Instant"

      $(".selected").fadeOut(function() { 
        $(this).load(function() { $(this).fadeIn(); }); 
        $(this).attr("src", $(this).attr('src') ); 
      }); 

    } else {
        $('.selected').attr('src', $(this).attr('src'));
    }
      location.hash = $(this).attr('id');
      removeVisiting();
      $(this).addClass('visited visiting');
  });
});

  function selectImage() {
    if($('#lightbox').length) {
      $('#lightbox').trigger('click');
      $('.selected').trigger('click');
    }
  }

  $('#prev').click(function() { moveFocus( $('.visiting'),  37 ) });
  $('#next').click(function() { moveFocus( $('.visiting'),  39 ) });

  function moveFocus(element,key) {
    if(key === 37  || ( $(element).is(':last-child') && $(element).hasClass('removing') ) || $(element).next().hasClass('removing') ) { 
      $('.visiting').prev().trigger('click');
    } else { 
      $('.visiting').next().trigger('click'); 
    }
  }

  function removeVisiting() {
    if(!$('#lightbox').length) {  $('.thumbnail').removeClass('visiting'); }
  }

  /* ===================== [ ADD ID FOR IMAGES ] ===================== */
  $(".thumbnail").each(function() {
    $(this).attr('id', img_prefix + imageID++ );
  });

// ================ [ LOAD LINKED IMAGE ] ===========================================
if(typeof loaded === 'number' && $('.thumbnail').eq(loaded-1).length ) {
 $('.thumbnail').eq(loaded-1).trigger('click');
} else {
  $('.thumbnail').first().trigger('click');
}

});
