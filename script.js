let position = 'main';
let navBarExpanded = false;

$(document).ready(() => {
  $('#profileImage img').addClass('hover');
});

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
  if (deviceWidth > 700) $('#navBar li').show();
  $('#nextDownArrow').fadeOut();
  $('.about').css('display', 'flex');
  anime({
    targets: '.container-typing',
    translateY: '-100%',
    duration: 400,
    easing: 'easeInOutQuad',
    complete: function () {
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
          $('#profileImage img').removeClass('hover');
          $('#navBar').fadeIn();
        },
      });
    },
  });
  anime({
    targets: '.about',
    translateY: '-100%',
    duration: 1000,
    easing: 'easeOutElastic(1, 0.6)',
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
      $('#profileImage img').addClass('hover');
    },
  });
  anime({
    targets: '.container-typing',
    translateY: '0%',
    duration: 1100,
  });
  $('body').css('overscroll-behavior', 'auto');
}

$('#navBar #menuButton #menuIconSpan').click(() => {
  if (!navBarExpanded) {
    $('#navBar').animate({ height: '20em' }, 300, () => {
      navBarExpanded = true;
      $('#navBar li').fadeIn();
    });
    $('#navBar').css('backdrop-filter', 'blur(8px)');
    $('#navBar').css('-webkit-backdrop-filter', 'blur(8px)');
    $('#menuButton svg.feather.feather-menu').replaceWith(
      feather.icons.x.toSvg()
    );
    anime({
      targets: '#menuButton #menuIconSpan svg',
      rotate: '90deg',
      duration: 700,
    });
  } else {
    $('#navBar li').hide();
    $('#navBar').animate({ height: '4em' }, 300, () => {
      navBarExpanded = false;
      $('#navBar').css('backdrop-filter', 'blur(3px)');
      $('#navBar').css('-webkit-backdrop-filter', 'blur(3px)');
    });
    $('#menuButton svg.feather.feather-x').replaceWith(
      feather.icons.menu.toSvg()
    );
    $('#menuButton #menuIconSpan svg').css('transform', 'rotate(90deg)');
    anime({
      targets: '#menuButton #menuIconSpan svg',
      rotate: '0deg',
      duration: 700,
    });
  }
});
