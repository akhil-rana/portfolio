document.addEventListener('touchstart', handleTouchStart, false);
document.addEventListener('touchmove', handleTouchMove, false);

let xDown = null;
let yDown = null;

function getTouches(evt) {
  return (
    evt.touches || evt.originalEvent.touches // browser API
  ); // jQuery
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
    if (xDiff > 0) {
      /* left swipe */
      if (position == 'projects') $('#nextProject svg').click();
    } else {
      /* right swipe */
      if (position == 'projects') $('#previousProject svg').click();
    }
  } else {
    if (yDiff > 0) {
      /* up swipe */

      if (position == 'main') goDownArrow();
      if (position == 'about') goDownFromAbout();
    } else {
      /* down swipe */
      if (position == 'about') goUpArrow();
      if (position == 'projects') goUpFromProjects();
    }
  }
  /* reset values */
  xDown = null;
  yDown = null;
}
