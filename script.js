let position = 'main';

$('#nextDownArrow i').click(() => {
  goDownArrow();
});

document.querySelector('body').onwheel = function (event) {
  let move = event.deltaY;
  if (move > 0 && position == 'main') {
    goDownArrow();
  } else if (move < 0 && position == 'about') {
    goUpArrow();
  }
};

function goDownArrow() {
  position = 'about';
  $('#nextDownArrow').fadeOut();
  anime({
    targets: '.container-typing',
    translateY: '-100%',
    duration: 500,
    easing: 'easeInOutQuad',
    complete: function () {
      $('.container-typing').hide();
      $('#navBar').fadeIn();
      $('#navBar li').show();
      anime({
        targets: '#navBar li',
        scale: '1.3',
        duration: 200,
        direction: 'alternate',
        easing: 'easeInOutSine',
        complete: function () {
          $('#about').addClass('hover');
          $('body').css('overscroll-behavior', 'auto');
        },
      });
    },
  });
}

function goUpArrow() {
  position = 'main';
  $('#navBar').fadeOut();
  $('.container-typing').show();
  $('#nextDownArrow').fadeIn();
  $('#about').removeClass('hover');
  anime({
    targets: '.container-typing',
    translateY: '0%',
    duration: 1100,
  });
  $('body').css('overscroll-behavior', 'auto');
}
