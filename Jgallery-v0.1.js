/**
 * Place your JS-code here.
 */
 $(document).ready(function(){
  'use strict';


  /* ===================== CREATE PLUGIN ===================== */

  jQuery.fn.fadeOutAndRemove = function(speed){
    $(this).fadeOut(speed,function(){
        $(this).remove();
    })
  }

  console.log("WHAT");

 // FOR BOX 6 - LIGHTROOM
 $('.lightbox, .selected').click(function() {
    var windowHeigth = window.innerHeight || $(window).height(), // make it work on ipad & android
        windowWidth  = window.innerWidth  || $(window).width();   

    // Display the overlay
    $('<div id="overlay"></div>').addClass('overlay').appendTo('body');
    
    // Create the lightbox container
    $('<div id="lightbox"></div>').appendTo('body');
    
    // Display the image on load
    $('<img>')
      .attr('src', $(this).attr('src'))
      .css({'max-height': windowHeigth,'max-width': windowWidth})

    .load(function() {
      $('#lightbox')
      .css({
        'top':  (windowHeigth - $('#lightbox').height()) / 2,
        'left': (windowWidth  - $('#lightbox').width())  / 2
      }).fadeIn();
    }).appendTo('#lightbox');

    // Remove it all on click
    $('#overlay, #lightbox').click(function() {
      $('#overlay, #lightbox').remove();
    });
  });

// GALLERY for box #7
$('.thumbnail').each(function() {
  $(this).click(function() {
    $('.selected').attr({
        src: $(this).attr('src'),
      });
    $('img').removeClass('visiting');
    $(this).addClass('visited visiting');
  });
});


$('body').keydown(function (e) {
  var keyCode = e.keyCode || e.which,
      arrow = {esc: 27, left: 37, up: 38, right: 39, down: 40, del : 46 };

  switch (keyCode) {
    case arrow.left:
      $('#prev').trigger('click');
      if($('#lightbox').length) {
        $('#lightbox').trigger('click');
        $('.selected').trigger('click');
      }
    break;
    case arrow.up:
      if(!$('#lightbox').length && $('.selected').attr('src').length && $('.visiting').length) {
        $('.selected').trigger('click');
      }
    break;
    case arrow.right:
      $('#next').trigger('click');
      if($('#lightbox').length) {
        $('#lightbox').trigger('click');
        $('.selected').trigger('click');
      }
    break;
    case arrow.down:
      $('#lightbox').trigger('click');
      break;

    case arrow.del:
      $('.visiting').trigger('contextmenu');
      break;

    case arrow.esc:
      if(!$('#lightbox').length) {
        removeVisiting();
      }
      $('#lightbox').trigger('click');
    break;
  }
});



$('.thumbnail').bind('contextmenu', function(e){
  e.preventDefault();

  if($(this).hasClass('visiting')) {
    ($(this).is(':last-child')) ? $('#prev').trigger('click') : $('#next').trigger('click'); 
  } 
  $(this).fadeOutAndRemove('slow');
});

function removeVisiting() {
  $('.thumbnail').removeClass('visiting');
}

$('img').dblclick(function() { $(this).trigger('contextmenu') });
$('#prev').click(function() { $('.visiting').prev().trigger('click'); });
$('#next').click(function() { $('.visiting').next().trigger('click'); });
});