let position = 'main';
let navBarExpanded = false;

$(window).resize(() => {
  let deviceWidth = window.innerWidth > 0 ? window.innerWidth : screen.width;
  if (deviceWidth <= 700) $('#navBar li').hide();
  else $('#navBar li').css('transform', 'scale(1)').fadeIn();
});

$('#nextDownArrow svg').click(() => {
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
  let deviceWidth = window.innerWidth > 0 ? window.innerWidth : screen.width;
  if (deviceWidth <= 700) $('#navBar li').hide();
  $('#nextDownArrow').fadeOut();
  anime({
    targets: '.container-typing',
    translateY: '-100%',
    duration: 200,
    easing: 'easeInOutQuad',
    complete: function () {
      $('.container-typing').hide();
      $('#navBar').fadeIn();
      if (deviceWidth > 700) $('#navBar li').show();
      anime({
        targets: '#navBar li',
        scale: '1.3',
        duration: 200,
        direction: 'alternate',
        easing: 'easeInOutSine',
        complete: function () {
          $('#about').addClass('hover');
          $('body').css('overscroll-behavior', 'none');
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

$('#navBar #menuButton svg').click(() => {
  if (!navBarExpanded) {
    $('#navBar').animate({ height: '20em' }, 200, () => {
      navBarExpanded = true;
      $('#navBar li').fadeIn();
    });
  } else {
    $('#navBar li').hide();
    $('#navBar').animate({ height: '4em' }, 200, () => {
      navBarExpanded = false;
    });
  }
});
