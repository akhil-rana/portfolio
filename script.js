let position = 'main';
let navBarExpanded = false;

$(window).resize(() => {
  let deviceWidth = window.innerWidth > 0 ? window.innerWidth : screen.width;
  if (deviceWidth <= 700) {
    $('#navBar li').hide();
  } else {
    $('#navBar li').css('transform', 'scale(1)').fadeIn();
  }
  if (navBarExpanded) {
    $('#navBar li').hide();
    $('#navBar').animate({ height: '4em' }, 300, () => {
      navBarExpanded = false;
    });
  }
});

$('#nextDownArrow svg').click(() => {
  goDownArrow();
});

document.querySelector('body').onwheel = function (event) {
  let move = event.deltaY;
  if (move > 0) {
    if (position == 'main') goDownArrow();
  } else if (move < 0) {
    if (position == 'about') goUpArrow();
  }
};

function goDownArrow() {
  position = 'processing';
  let deviceWidth = window.innerWidth > 0 ? window.innerWidth : screen.width;
  if (deviceWidth <= 700) $('#navBar li').hide();
  $('#nextDownArrow').fadeOut();
  $('.about').css('display', 'flex');

  anime({
    targets: '.container-typing',
    translateY: '-100%',
    duration: 400,
    easing: 'easeInOutQuad',
    complete: function () {
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
          // $('.container-typing').hide();
          position = 'about';
        },
      });
    },
  });
  anime({
    targets: '.about',
    translateY: '-100%',
    duration: 1300,
    // easing: 'easeInOutSine',
    complete: function () {},
  });
}

function goUpArrow() {
  position = 'processing';
  $('#navBar').fadeOut();
  $('.container-typing').show();
  $('#about').removeClass('hover');
  anime({
    targets: '.about',
    translateY: '100%',
    duration: 1100,
    // easing: 'easeInOutSine',
    complete: function () {
      $('#nextDownArrow').fadeIn();
      position = 'main';
    },
  });
  anime({
    targets: '.container-typing',
    translateY: '0%',
    duration: 1100,
  });
  $('body').css('overscroll-behavior', 'auto');
}

$('#navBar #menuButton svg').click(() => {
  if (!navBarExpanded) {
    $('#navBar').animate({ height: '20em' }, 300, () => {
      navBarExpanded = true;
      $('#navBar li').fadeIn();
    });
  } else {
    $('#navBar li').hide();
    $('#navBar').animate({ height: '4em' }, 300, () => {
      navBarExpanded = false;
    });
  }
});
