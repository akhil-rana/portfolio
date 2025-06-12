// Web Worker for star field physics calculations
class StarFieldWorker {
  constructor() {
    this.stars = [];
    this.mouse = { x: -1000, y: -1000 };
    this.cursorRadius = 120;
    this.startTime = Date.now();
    this.windowWidth = 0;
    this.windowHeight = 0;
  }

  initStars(starsData, windowWidth, windowHeight) {
    this.stars = starsData;
    this.windowWidth = windowWidth;
    this.windowHeight = windowHeight;
    this.startTime = Date.now();
  }

  updateMouse(mouseX, mouseY) {
    this.mouse.x = mouseX;
    this.mouse.y = mouseY;
  }

  calculateFrame(currentTime) {
    if (this.stars.length === 0) return [];

    const updatedStars = this.stars.map((star) => {
      // Calculate scrolling animation
      const animationHeight = Math.max(this.windowHeight * 2, 2000);
      const animationDuration = star.speed * 1000;
      const elapsed = (currentTime - this.startTime) % animationDuration;
      const animationProgress = elapsed / animationDuration;
      const animationOffset = -animationProgress * animationHeight;

      const visualX = star.x;
      const visualY = star.y + animationOffset;

      let finalY = visualY;
      if (visualY < -100) {
        finalY = visualY + animationHeight;
      }

      // Physics interaction
      const dx = this.mouse.x - visualX;
      const dy = this.mouse.y - finalY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < this.cursorRadius && distance > 0) {
        const force = (this.cursorRadius - distance) / this.cursorRadius;
        const angle = Math.atan2(dy, dx);

        const repelForce = force * force * 15;
        star.velocityX -= Math.cos(angle) * repelForce;
        star.velocityY -= Math.sin(angle) * repelForce;
      }

      const returnForceX = (star.originalX - star.x) * 0.02;
      const returnForceY = (star.originalY - star.y) * 0.02;

      star.velocityX += returnForceX;
      star.velocityY += returnForceY;

      star.velocityX *= 0.88;
      star.velocityY *= 0.88;

      star.x += star.velocityX;
      star.y += star.velocityY;

      return {
        x: star.x,
        y: finalY,
        size: star.size,
        opacity: star.opacity,
      };
    });

    return updatedStars;
  }

  resize(windowWidth, windowHeight) {
    this.windowWidth = windowWidth;
    this.windowHeight = windowHeight;
  }
}

// Worker message handling
const worker = new StarFieldWorker();

self.onmessage = function (e) {
  const { type, data } = e.data;

  switch (type) {
    case 'init':
      worker.initStars(data.stars, data.windowWidth, data.windowHeight);
      break;

    case 'updateMouse':
      worker.updateMouse(data.x, data.y);
      break;

    case 'calculateFrame':
      const result = worker.calculateFrame(data.currentTime);
      self.postMessage({ type: 'frameResult', data: result });
      break;

    case 'resize':
      worker.resize(data.windowWidth, data.windowHeight);
      break;
  }
};
