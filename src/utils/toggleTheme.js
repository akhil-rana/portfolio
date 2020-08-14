const duration = 0.4;
let isDay = true;

const back = document.getElementById('back-theme-toggle');
const front = document.getElementById('front-theme-toggle');

const switchTime = () => {
  back.setAttribute('href', `#${isDay ? 'day' : 'night'}`);
  front.setAttribute('href', `#${isDay ? 'night' : 'day'}`);
};
const scale = 30;
const toNightAnimation = gsap.timeline();

toNightAnimation
  .to('#night-content-theme-toggle', {
    duration: duration * 0.5,
    opacity: 1,
    ease: 'power2.inOut',
    x: 0,
  })
  .to(
    '#circle',
    {
      duration,
      ease: 'power4.in',
      scaleX: scale,
      scaleY: scale,
      x: 1,
      transformOrigin: '100% 50%',
    },
    0
  )
  .set(
    '#circle',
    {
      // transformOrigin: '0% 50%',
      scaleX: -scale,
      // x: 8.5,
      onUpdate: () => switchTime(),
    },
    duration
  )
  .to(
    '#circle',
    {
      duration,
      ease: 'power4.out',
      scaleX: -1,
      scaleY: 1,
      x: 2,
    },
    duration
  )
  .to(
    '#day-content',
    { duration: duration * 0.5, opacity: 0.5 },
    duration * 1.5
  )
  .to('body', { duration: duration * 2 }, 0);

const stars = Array.from(document.getElementsByClassName('star'));
stars.map((star) =>
  gsap.to(star, {
    duration: 'random(0.4, 1.5)',
    repeat: -1,
    yoyo: true,
    opacity: 'random(0.2, 0.5)',
  })
);
gsap.to('.clouds-big', {
  duration: 15,
  repeat: -1,
  x: -74,
  ease: 'linear',
});
gsap.to('.clouds-medium', {
  duration: 20,
  repeat: -1,
  x: -65,
  ease: 'linear',
});
gsap.to('.clouds-small', {
  duration: 25,
  repeat: -1,
  x: -71,
  ease: 'linear',
});

const switchToggle = document.getElementById('input-theme-toggle');
switchToggle.addEventListener('change', () => toggle());

let toggle = () => {
  isDay = switchToggle.checked == true;
  if (isDay) {
    toNightAnimation.reverse();
  } else {
    toNightAnimation.play();
  }
};

toNightAnimation.reverse();
toNightAnimation.pause();

$(document).ready(() => {
  if (localStorage.getItem('theme') == 'light') {
    setLightTheme();
    $('#input-theme-toggle').change(() => {
      if (localStorage.getItem('theme') == 'light') {
        setDarkTheme();
      } else {
        setLightTheme();
      }
    });
  } else {
    localStorage.setItem('theme', 'dark');
    $('#input-theme-toggle').click().change(() => {
      if (localStorage.getItem('theme') == 'light') {
        setDarkTheme();
      } else {
        setLightTheme();
      }
    });
  }
});

function setLightTheme() {
  localStorage.setItem('theme', 'light');
  $('#themeCSS').attr('href', './utils/background-light.css');
  $('#toggle-theme-svg').css('filter', 'drop-shadow(0px 3px 3px rgba(0, 0, 0, 0.4))');
  $('#toggle-theme-svg').css('-webkit-filter', 'drop-shadow(0px 3px 3px rgba(0, 0, 0, 0.4))');
}

function setDarkTheme() {
  localStorage.setItem('theme', 'dark');
  $('#themeCSS').attr('href', './utils/background.css');
  $('#toggle-theme-svg').css('filter', 'drop-shadow(0px 3px 3px rgba(255, 255, 255, 0.048))');
  $('#toggle-theme-svg').css('-webkit-filter', 'drop-shadow(0px 3px 3px rgba(255, 255, 255, 0.048))');
}