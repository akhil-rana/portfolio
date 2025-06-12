document.addEventListener('touchstart', handleTouchStart, false);
document.addEventListener('touchmove', handleTouchMove, false);

let xDown = null;
let yDown = null;

function getTouches(evt) {
  return (
    evt.touches || evt.originalEvent.touches // browser API
  );
}

function handleTouchStart(evt) {
  const firstTouch = getTouches(evt)[0];
  xDown = firstTouch.clientX;
  yDown = firstTouch.clientY;
}

function handleTouchMove(evt) {
  if (!xDown || !yDown) {
    return;
  }

  let xUp = evt.touches[0].clientX;
  let yUp = evt.touches[0].clientY;

  let xDiff = xDown - xUp;
  let yDiff = yDown - yUp;
  if (Math.abs(xDiff) > Math.abs(yDiff)) {
    /*most significant*/
    if (xDiff > 0) {      /* left swipe */
      if (position == 'projects') {
        const nextProjectSvg = document.querySelector('#nextProject svg');
        if (nextProjectSvg) {
          nextProjectSvg.dispatchEvent(new Event('click', { bubbles: true }));
        }
      }
      if (position == 'experience') {
        const nextExperienceSvg = document.querySelector('#nextExperience svg');
        if (nextExperienceSvg) {
          nextExperienceSvg.dispatchEvent(new Event('click', { bubbles: true }));
        }
      }
    } else {
      /* right swipe */
      if (position == 'projects') {
        const previousProjectSvg = document.querySelector('#previousProject svg');
        if (previousProjectSvg) {
          previousProjectSvg.dispatchEvent(new Event('click', { bubbles: true }));
        }
      }
      if (position == 'experience') {
        const previousExperienceSvg = document.querySelector('#previousExperience svg');
        if (previousExperienceSvg) {
          previousExperienceSvg.dispatchEvent(new Event('click', { bubbles: true }));
        }
      }
      if (position == 'contact' && socialShown) {
        const goToMessageElement = document.getElementById('goToMessage');
        if (goToMessageElement) {
          goToMessageElement.click();
        }
      }
    }
  } else {
    if (yDiff > 0) {
      /* up swipe */
      if (position == 'main') goDownArrow();
      if (position == 'about') goDownFromAbout();
      if (position == 'projects') goDownFromProjects();
      if (position == 'experience') goDownFromExperience();
    } else {
      /* down swipe */
      if (position == 'about') goUpArrow();
      if (position == 'projects') goUpFromProjects();
      if (position == 'experience') goUpFromExperience();
      if (position == 'contact') goUpFromContact();
    }
  }
  /* reset values */
  xDown = null;
  yDown = null;
}
