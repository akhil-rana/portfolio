document.addEventListener('touchstart', handleTouchStart, false);        
document.addEventListener('touchmove', handleTouchMove, false);

let xDown = null;                                                        
let yDown = null;

function getTouches(evt) {
  return evt.touches ||             // browser API
         evt.originalEvent.touches; // jQuery
}                                                     

function handleTouchStart(evt) {
  const firstTouch = getTouches(evt)[0];                                      
  xDown = firstTouch.clientX;                                      
  yDown = firstTouch.clientY;                                      
}                                                

function handleTouchMove(evt) {
  if ( ! xDown || ! yDown ) {
    return;
  }

  let xUp = evt.touches[0].clientX;                                    
  let yUp = evt.touches[0].clientY;

  let xDiff = xDown - xUp;
  let yDiff = yDown - yUp;

  if ( Math.abs( xDiff ) > Math.abs( yDiff ) ) {/*most significant*/
    if ( xDiff > 0 ) {
      /* left swipe */ 
    } else {
      /* right swipe */
    }                       
  } else {
    if ( yDiff > 0 ) {
      /* up swipe */ 
      if (position == 'main') {
        goDownArrow();
      }
    } else { 
      /* down swipe */
      if (position == 'about') {
        goUpArrow();
      }
    }                                                                 
  }
  /* reset values */
  xDown = null;
  yDown = null;                                             
}