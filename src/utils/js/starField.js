class StarField {
  constructor() {
    this.canvasStarField = new StarFieldCanvas();
  }

  init() {
    this.canvasStarField.init();
  }

  generateStars() {
    this.canvasStarField.generateStars();
  }

  destroy() {
    this.canvasStarField.destroy();
  }
}

class StarFieldCanvas {
  constructor() {
    this.starDensity = {
      small: 4,
      medium: 2.5,
      large: 3,
    };
    this.initialized = false;
    this.resizeTimeout = null;
    this.mouse = { x: -1000, y: -1000 };
    this.cursorRadius = 120;
    this.stars = [];
    this.animationId = null;
    this.startTime = Date.now();
    this.canvas = null;
    this.ctx = null;
    this.worker = null;
    this.renderData = [];
  }
  calculateStarCounts() {
    const screenArea = window.innerWidth * window.innerHeight;
    const baseUnit = 10000;

    let smallCount = Math.round(
      (screenArea / baseUnit) * this.starDensity.small
    );
    let mediumCount = Math.round(
      (screenArea / baseUnit) * this.starDensity.medium
    );
    let largeCount = Math.round(
      (screenArea / baseUnit) * this.starDensity.large
    );

    smallCount = Math.max(smallCount, 100);
    mediumCount = Math.max(mediumCount, 60);
    largeCount = Math.max(largeCount, 40);

    return [
      { count: smallCount, size: 1, speed: 50, opacity: 0.6 },
      { count: mediumCount, size: 2, speed: 100, opacity: 0.7 },
      { count: largeCount, size: 3, speed: 150, opacity: 0.8 },
    ];
  }
  generateStars() {
    const starLayers = this.calculateStarCounts();
    this.stars = [];
    this.startTime = Date.now();
    starLayers.forEach((layer) => {
      for (let i = 0; i < layer.count; i++) {
        const star = {
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight * 2,
          originalX: 0,
          originalY: 0,
          velocityX: 0,
          velocityY: 0,
          size: layer.size,
          speed: layer.speed,
          opacity: layer.opacity + Math.random() * 0.3,
          mass: 0.5 + Math.random() * 0.5,
        };
        star.originalX = star.x;
        star.originalY = star.y;
        this.stars.push(star);
      }
    });

    if (this.worker) {
      this.worker.postMessage({
        type: 'init',
        data: {
          stars: this.stars,
          windowWidth: window.innerWidth,
          windowHeight: window.innerHeight,
        },
      });
    }
  }  setupCanvas() {
    this.canvas = document.createElement('canvas');
    this.canvas.id = 'starfield-canvas';
    this.canvas.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 0;
    `;

    const firstStarElement = document.getElementById('stars');
    if (firstStarElement && firstStarElement.parentNode) {
      firstStarElement.parentNode.insertBefore(this.canvas, firstStarElement);
    } else {
      document.body.appendChild(this.canvas);
    }

    this.ctx = this.canvas.getContext('2d');
    this.resizeCanvas();

    ['stars', 'stars2', 'stars3'].forEach((id) => {
      const element = document.getElementById(id);
      if (element) {
        element.style.display = 'none';
      }
    });

    this.setupWorker();
  }
  resizeCanvas() {
    if (!this.canvas) return;

    const rect = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    const dpr = window.devicePixelRatio || 1;

    this.canvas.width = rect.width * dpr;
    this.canvas.height = rect.height * dpr;

    this.canvas.style.width = rect.width + 'px';
    this.canvas.style.height = rect.height + 'px';

    this.ctx.scale(dpr, dpr);
  }
  setupWorker() {
    try {
      this.worker = new Worker('./utils/js/starFieldWorker.js');
      this.worker.onmessage = (e) => {
        if (e.data.type === 'frameResult') {
          this.renderData = e.data.data;
        }
      };
    } catch (error) {
      console.warn('Web Worker not supported, falling back to main thread');
      this.worker = null;
    }
  }

  updateStarPhysics() {
    if (!this.ctx) return;
    if (this.worker && this.stars.length > 0) {
      this.worker.postMessage({
        type: 'calculateFrame',
        data: { currentTime: Date.now() },
      });
    } else {
      this.updateStarPhysicsMainThread();
    }

    this.render();
    this.animationId = requestAnimationFrame(() => this.updateStarPhysics());
  }

  updateStarPhysicsMainThread() {
    const currentTime = Date.now();
    this.renderData = this.stars.map((star) => {
      const animationHeight = Math.max(window.innerHeight * 2, 2000);
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
  }

  render() {
    this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    this.renderData.forEach((star) => {
      this.ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
      this.ctx.fillRect(
        star.x - star.size / 2,
        star.y - star.size / 2,
        star.size,
        star.size
      );
    });
  }
  drawStar(x, y, size, opacity) {
    this.ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
    this.ctx.fillRect(x - size / 2, y - size / 2, size, size);
  }
  handleResize() {
    if (this.resizeTimeout) {
      clearTimeout(this.resizeTimeout);
    }

    this.resizeTimeout = setTimeout(() => {
      this.resizeCanvas();
      this.generateStars();

      if (this.worker) {
        this.worker.postMessage({
          type: 'resize',
          data: {
            windowWidth: window.innerWidth,
            windowHeight: window.innerHeight,
          },
        });
      }
    }, 250);
  }

  init() {
    if (this.initialized) return;

    this.setupCanvas();
    this.generateStars();

    window.addEventListener('resize', () => this.handleResize());
    document.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;

      if (this.worker) {
        this.worker.postMessage({
          type: 'updateMouse',
          data: { x: e.clientX, y: e.clientY },
        });
      }
    });

    document.addEventListener('mouseleave', () => {
      this.mouse.x = -1000;
      this.mouse.y = -1000;

      if (this.worker) {
        this.worker.postMessage({
          type: 'updateMouse',
          data: { x: -1000, y: -1000 },
        });
      }
    });

    this.updateStarPhysics();
    this.initialized = true;
  }
  destroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    if (this.worker) {
      this.worker.terminate();
    }
    if (this.canvas && this.canvas.parentNode) {
      this.canvas.parentNode.removeChild(this.canvas);
    }

    ['stars', 'stars2', 'stars3'].forEach((id) => {
      const element = document.getElementById(id);
      if (element) {
        element.style.display = '';
      }
    });
  }
}

const starField = new StarField();

window.addEventListener('load', () => {
  setTimeout(() => {
    starField.generateStars();
  }, 100);
});

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => starField.init());
} else {
  starField.init();
}
