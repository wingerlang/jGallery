$(document).ready(function(){
  'use strict';
  var imageID = 1,
  img_prefix  = "#image-",
  loaded      = (location.hash.indexOf(img_prefix) != -1) ? parseInt(location.hash.replace(img_prefix, ""),10):0;

// ====== [ Inserts the jgallery.css if it's not founded in the site ] ====== //
  if ( !$('link[href*="jgallery.css"]').length ){
    $('head').append('<link rel="stylesheet" href="jgallery.css" />');
  }
// ======================= [ INSERT GALLERY-HTML ] ======================= //
  $('.gallery').prepend('<div class="gallery-view ">');
  $('.gallery-view').append('<div id="imageContainer"></div>');
  $('#imageContainer').append('<img id="selected" />');
  $('#imageContainer').append('<div class="imageinfo"></div>');
  $('.gallery-view').append('<div id="prev" class="arr arr-l"></div>');
  $('.gallery-view').append('<div id="next" class="arr arr-r"></div>');
  $('.gallery-view').append('<div id="slideshow" class="arr pause"></div>');
  $('.gallery-view').append('<div id="fullscreen" class="arr fullscreen"></div>');
  $('.thumbnail').wrapAll('<div class="gallery-all">');
/* ===================== [ CREATE PLUGIN ] ===================== */
  jQuery.fn.fadeOutAndRemove = function (speed){
    $(this).addClass('removing').fadeOut( speed, function(){ $(this).remove(); });
  };

 // ======================= [ LIGHTBOX VIEWER ] ======================= //
 $('#selected').click(function(){
    var windowHeigth = window.innerHeight || $(window).height(),       // make it work on ipad & android
        windowWidth  = window.innerWidth  || $(window).width();

    $('<div id="overlay"></div>').addClass('overlay').appendTo('body');   // Display the overlay
    $('<div id="lightbox"></div>').appendTo('body');               // Create the lightbox container
    
    $('<img>').attr('src', $(this).attr('src'))                    // Display the image on load
    .css({'max-height': windowHeigth,'max-width': windowWidth})
    .load(function(){
      $('#lightbox').css({
        'top':  (windowHeigth - $('#lightbox').height()) / 2,
        'left': (windowWidth  - $('#lightbox').width())  / 2,
      });
    }).appendTo('#lightbox'); 

  $('#lightbox').append( $('.imageinfo').clone() );

  $('#lightbox').hover(function(){
    $('#selected').trigger('mouseenter');
  }, function(){
    $('#selected').trigger('mouseleave');
  });

  $('#overlay, #lightbox').click(function(){
    $('#overlay, #lightbox').remove();
  });
});

// ======================= [ Keyboard HANDLERS ] ======================= //
$('body').keydown(function (e){
  var keyCode   = e.which || e.keyCode,
  keycodeString = String.fromCharCode(keyCode),
  visiting = $('.visiting');

  if( keycodeString >= 1 && keycodeString <= 9 ){
    $('.thumbnail').eq(keycodeString-1).trigger('click');
  } else {
    switch (keyCode){
      case 46: // delete
       visiting.trigger('dblclick');
      break;

      case 37: case 39: // left, right
        moveFocus( visiting, keyCode );
        selectImage();
      break;

      case 13: // enter
        if(!visiting.length){
          $('.thumbnail :eq(0)').trigger('click');
        } else if (! $('#lightbox').length ){
          $('#selected').trigger('click');
        } else if($('#lightbox').length){
          $('#lightbox').trigger('click');
        }
      break;
      case 27: // ESC
        if(visiting.length){ removeVisiting(); }
        $('#lightbox').trigger('click');
      break;
    }
  }
});

// =======================[ REMOVE AMD MOVE SELECTED IMAGE ] ======================= //
$('.thumbnail').bind('dblclick', function(){
  $(this).fadeOutAndRemove(500);
  moveFocus(this);
  selectImage();
});

// ================= [ CLICK ON THUMBNAIL ] ==========================================
$('.thumbnail').each(function(){
  $(this).click(function(){
    $('#selected').attr('src', $(this).attr('src'));
    location.hash = $(this).attr('id');
    $('.thumbnail').removeClass('visiting');
    $(this).addClass('visited visiting');
    updateImageInfo();
  });
});

// ================= [ START/ STOP A SLIDESHOW ] ==========================================
$('#slideshow').click(function(){
  $(this).toggleClass('start').toggleClass('pause');

  if( $(this).hasClass('start') ){
    var interval = setInterval(function(){
      if( $('#slideshow').hasClass('pause') ){
        clearInterval(interval);

      } else if( $('.visiting').is(':last-child') ){
          $('#slideshow').toggleClass('pause').toggleClass('start').removeClass('shine');
          clearInterval(interval);

      } else {
        moveFocus( $('.visiting') );
        selectImage();
      }
    }, 2500);
  }
});

function twinkle(element){
  $(element).addClass('shine');
  if( !$(element).hasClass('start') ){
    setTimeout(function(){ $(element).removeClass('shine');  },300);
  }
}
// ================= [ CLICK ON FULLSCREEN BUTTON ] ==========================================
$('#fullscreen').click(function(){
  $('#selected').trigger('click');
});

// Add onClick for left and right buttons
$('#prev').click(function(){ moveFocus( $('.visiting'),  37 ); });
$('#next').click(function(){ moveFocus( $('.visiting'),  39 ); });

$('#next').dblclick(function(){
  if( $('.visiting').is(':last-child') ){
    $('.thumbnail').first().trigger('click');
  }
});
$('#prev').dblclick(function(){
  if( $('.visiting').is(':first-child') ){
    $('.thumbnail').last().trigger('click');
  }
});

$('.arr').click(function(){
  twinkle(this);
});

function moveFocus(element,key){
  if(key === 37  || ( $(element).is(':last-child') && $(element).hasClass('removing') ) || $(element).next().hasClass('removing') ){
    if( !$(element).is(':first-child') ){
      $('.visiting').prev().trigger('click');
      twinkle( $('#prev') );
    }
  } else if ( !$(element).is(':last-child') ){
    $('.visiting').next().trigger('click');
    twinkle( $('#next') );
  }
}

function removeVisiting(){
  if(!$('#lightbox').length){
    $('.thumbnail').removeClass('visiting');
  }
}

function selectImage(){
  if( $('#lightbox').length ){
    $('#lightbox').trigger('click');
    $('#selected').trigger('click');
    quickShow();
  }
}
function updateImageInfo(){
  var image = $('.visiting'),
      title = image.attr('title') ? image.attr('title') : "",
      imgNr = (image.index()+1) + " of " + $('.thumbnail:not(.removing)').length;
  $('.imageinfo').text( title + " " + imgNr );
  quickShow();
}

function quickShow(){
  if( !$('.imageinfo:visible') || $('.imageinfo').css('display') == 'none' ) {
    $(prefix('#lightbox') + '.imageinfo').fadeIn().delay(1000).fadeOut();
  }
}
$('#selected').mouseenter(function(){
  $(prefix('#lightbox') + '.imageinfo').fadeIn();
});
$('#selected').mouseleave(function(){
  $('.imageinfo').fadeOut();
});
// ================ [ If the prefixed elemnt exists, include it as parent selector ] ================
function prefix(prefix){
  return ($(prefix).length) ? (prefix + ' ') : '';
}
// ===================== [ ADD ID FOR IMAGES ] =====================
  $(".thumbnail").each(function(){
    $(this).attr('id', img_prefix + imageID++ );
  });
// ================ [ LOAD LINKED IMAGE  ] ================
  if(loaded && typeof loaded === 'number' && $('.thumbnail').eq(loaded-1).length ){
    $('.thumbnail').eq(loaded-1).trigger('click');
    window.scrollTo = '#gallery';
  }
});