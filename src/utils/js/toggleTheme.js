const duration = 0.4;
let isDay = true;
let isThemeToggling = false;

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
      scaleX: -scale,
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
switchToggle.addEventListener('click', (event) => {
  if (isThemeToggling) {
    event.preventDefault();
    event.stopPropagation();
    return false;
  }
});
switchToggle.addEventListener('change', () => {
  if (!isThemeToggling) {
    toggle();
  }
});

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

function applyThemeInstantly(theme) {
  gsap.set('#main', {
    '--color1':
      theme === 'light'
        ? 'var(--theme-light-color1)'
        : 'var(--theme-dark-color1)',
    '--color2':
      theme === 'light'
        ? 'var(--theme-light-color2)'
        : 'var(--theme-dark-color2)',
  });
  gsap.set('#toggle-theme-svg', {
    filter:
      theme === 'light'
        ? 'var(--theme-light-toggle-shadow)'
        : 'var(--theme-dark-toggle-shadow)',
  });
  gsap.set('#profileImage', {
    filter:
      theme === 'light'
        ? 'var(--theme-light-profile-shadow)'
        : 'var(--theme-dark-profile-shadow)',
  });
}

const savedTheme = localStorage.getItem('theme') || 'dark';
applyThemeInstantly(savedTheme);

if (savedTheme === 'light') {
  const inputElement = document.getElementById('input-theme-toggle');
  inputElement.addEventListener('click', (event) => {
    if (isThemeToggling) {
      event.preventDefault();
      event.stopPropagation();
      return false;
    }
  });
  inputElement.addEventListener('change', () => {
    if (!isThemeToggling) {
      if (localStorage.getItem('theme') === 'light') {
        setDarkTheme();
      } else {
        setLightTheme();
      }
    }
  });
} else {  localStorage.setItem('theme', 'dark');
  const inputThemeToggle = document.getElementById('input-theme-toggle');
  inputThemeToggle.click();
  inputThemeToggle.addEventListener('click', (event) => {
    if (isThemeToggling) {
      event.preventDefault();
      event.stopPropagation();
      return false;
    }
  });
  inputThemeToggle.addEventListener('change', () => {
    if (!isThemeToggling) {
      if (localStorage.getItem('theme') === 'light') {
        setDarkTheme();
      } else {
        setLightTheme();
      }
    }
  });
}

function setLightTheme() {
  isThemeToggling = true;
  localStorage.setItem('theme', 'light');
  
  const starCanvas = document.getElementById('starfield-canvas');
  if (starCanvas) {
    starCanvas.style.zIndex = '2';
  }
  
  setTimeout(() => createRippleEffect('light'), 400);
  gsap.to('#toggle-theme-svg', {
    duration: 1.5,
    ease: 'none',
    filter: 'var(--theme-light-toggle-shadow)',
  });
  gsap.to('#profileImage', {
    duration: 1.5,
    ease: 'none',
    filter: 'var(--theme-light-profile-shadow)',
  });
}

function setDarkTheme() {
  isThemeToggling = true;
  localStorage.setItem('theme', 'dark');
  
  const starCanvas = document.getElementById('starfield-canvas');
  if (starCanvas) {
    starCanvas.style.zIndex = '2';
  }
  
  setTimeout(() => createRippleEffect('dark'), 400);
  gsap.to('#toggle-theme-svg', {
    duration: 1.5,
    ease: 'none',
    filter: 'var(--theme-dark-toggle-shadow)',
  });
  gsap.to('#profileImage', {
    duration: 1.5,
    ease: 'none',
    filter: 'var(--theme-dark-profile-shadow)',
  });
}

function createRippleEffect(targetTheme) {
  const isSafari =
    /^((?!chrome|android).)*safari/i.test(navigator.userAgent) ||
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.vendor && navigator.vendor.indexOf('Apple') > -1);

  const toggleButton = document.getElementById('themeToggle');
  if (!toggleButton) return;
  const rect = toggleButton.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  const maxDistance =
    Math.sqrt(
      Math.pow(window.innerWidth, 2) + Math.pow(window.innerHeight, 2)
    ) + 200;

  document.getElementById('theme-ripple')?.remove();
  const ripple = document.createElement('div');
  ripple.id = 'theme-ripple';
  ripple.style.background =
    targetTheme === 'light' ? 'var(--gradient-light)' : 'var(--gradient-dark)';

  if (isSafari) {
    ripple.style.willChange = 'mask, -webkit-mask, transform';
    ripple.style.backfaceVisibility = 'hidden';
    ripple.style.webkitBackfaceVisibility = 'hidden';
    ripple.style.transform = 'translateZ(0)';
    ripple.style.webkitTransform = 'translateZ(0)';
  }
  const container =
    document.querySelector('.background') || document.getElementById('main');
  container.appendChild(ripple);

  if (isSafari) {
    const currentMain = document.getElementById('main');
    const currentStyles = window.getComputedStyle(currentMain);
    currentMain.style.background = currentStyles.background;

    requestAnimationFrame(() => {
      currentMain.style.background = '';
    });
  }
  const featherSize = 360;
  const initialRadius = featherSize;
  const finalRadius = maxDistance;
  const initialSolidRadius = 0;
  const createMask = (radius, solidRadius) => {
    const stops = [`black 0px`, `black ${solidRadius}px`];
    const numStops = 40;

    for (let i = 1; i <= numStops; i++) {
      const progress = i / numStops;
      const opacity = Math.pow(1 - progress, 2.5);
      const position = solidRadius + featherSize * progress;
      stops.push(`rgba(0,0,0,${opacity.toFixed(4)}) ${position}px`);
    }

    stops.push(`transparent ${radius}px`);
    return `radial-gradient(circle at ${centerX}px ${centerY}px, ${stops.join(
      ', '
    )})`;
  };

  const initialMask = createMask(initialRadius, initialSolidRadius);
  ripple.style.mask = ripple.style.webkitMask = initialMask;
  gsap.to(ripple, {
    duration: 1.2,
    ease: 'power2.out',
    onUpdate: function () {
      const progress = this.progress();
      const currentRadius =
        initialRadius + (finalRadius - initialRadius) * progress;
      const solidRadius = Math.max(0, currentRadius - featherSize);
      const maskValue = createMask(currentRadius, solidRadius);
      ripple.style.mask = ripple.style.webkitMask = maskValue;
    },    onComplete: () => {
      const starCanvas = document.getElementById('starfield-canvas');
      if (starCanvas) {
        starCanvas.style.zIndex = '0';
      }
      
      if (isSafari) {
        const tempDiv = document.createElement('div');
        tempDiv.style.position = 'absolute';
        tempDiv.style.top = '-1px';
        tempDiv.style.left = '-1px';
        tempDiv.style.width = '1px';
        tempDiv.style.height = '1px';
        tempDiv.style.opacity = '0';
        document.body.appendChild(tempDiv);

        tempDiv.offsetHeight;

        document.body.removeChild(tempDiv);

        ripple.style.willChange = 'auto';
        ripple.style.transform = 'translateZ(0)';

        gsap.set('#main', {
          '--color1':
            targetTheme === 'light'
              ? 'var(--theme-light-color1)'
              : 'var(--theme-dark-color1)',
          '--color2':
            targetTheme === 'light'
              ? 'var(--theme-light-color2)'
              : 'var(--theme-dark-color2)',
        });

        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            ripple.remove();
            isThemeToggling = false;
          });
        });
      } else {
        gsap.set('#main', {
          '--color1':
            targetTheme === 'light'
              ? 'var(--theme-light-color1)'
              : 'var(--theme-dark-color1)',
          '--color2':
            targetTheme === 'light'
              ? 'var(--theme-light-color2)'
              : 'var(--theme-dark-color2)',
        });
        ripple.remove();
        isThemeToggling = false;
      }
    },
  });
}
