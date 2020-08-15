$('#nextDownArrow i').click(() => {
  $('#nextDownArrow').fadeOut(300);
  anime({
    targets: '.container-typing',
    translateY: '-100%',
    duration: 1000,
    easing: 'easeInOutQuad',
    complete: function (anim) {
      $('.container-typing').hide();
      $('#navBar').fadeIn();
      $('#navBar li').show();
      anime({
        targets: '#navBar li',
        scale: '1.3',
        duration: 300,
        direction: 'alternate',
        easing: 'easeInOutSine',
      });
    },
  });
});
