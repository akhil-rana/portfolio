class CursorEffect {
  constructor() {
    this.cursor = null;
    this.repulsionField = null;
    this.trails = [];
    this.lastTrailTime = 0;
    this.trailDelay = 20;
    this.isHovering = false;
    this.init();
  }

  init() {
    if (window.innerWidth <= 768) return;

    this.createCursor();
    this.createRepulsionField();
    this.bindEvents();
  }

  createCursor() {
    this.cursor = document.createElement('div');
    this.cursor.className = 'custom-cursor';
    document.body.appendChild(this.cursor);
  }

  createRepulsionField() {
    this.repulsionField = document.createElement('div');
    this.repulsionField.className = 'star-repulsion-field';
    document.body.appendChild(this.repulsionField);
  }

  createTrail(x, y) {
    const now = Date.now();
    if (now - this.lastTrailTime < this.trailDelay) return;
    
    const trail = document.createElement('div');
    trail.className = 'cursor-trail';
    trail.style.left = x + 'px';
    trail.style.top = y + 'px';
    
    document.body.appendChild(trail);
    this.trails.push(trail);
    
    setTimeout(() => {
      if (trail.parentNode) {
        trail.parentNode.removeChild(trail);
      }
      const index = this.trails.indexOf(trail);
      if (index > -1) {
        this.trails.splice(index, 1);
      }
    }, 1000);
    
    this.lastTrailTime = now;
  }
  bindEvents() {
    document.addEventListener('mousemove', (e) => {
      if (!this.cursor) return;

      const x = e.clientX;
      const y = e.clientY;

      if (this.cursor) {
        this.cursor.style.left = x + 'px';
        this.cursor.style.top = y + 'px';
      }
      if (this.repulsionField) {
        this.repulsionField.style.left = x + 'px';
        this.repulsionField.style.top = y + 'px';
        this.repulsionField.classList.add('active');
      }

      this.createTrail(x, y);
    });

    document.addEventListener('mouseleave', () => {
      if (this.repulsionField) {
        this.repulsionField.classList.remove('active');
      }
    });

    document.addEventListener('mouseenter', () => {
      if (this.repulsionField) {
        this.repulsionField.classList.add('active');
      }
    });

    const interactiveElements = 'a, button, input, textarea, select, [role="button"], .sendButton, #nextDownArrow, #navBar li span, #menuButton, #themeToggle, #nextProject, #previousProject, #nextExperience, #previousExperience, .social-btn';
      document.addEventListener('mouseover', (e) => {
      if (e.target.closest(interactiveElements)) {
        this.isHovering = true;
        if (this.cursor) {
          this.cursor.classList.add('hover');
        }
        if (this.repulsionField) {
          this.repulsionField.classList.add('hover');
        }
      }
    });

    document.addEventListener('mouseout', (e) => {
      if (!e.relatedTarget || !e.relatedTarget.closest(interactiveElements)) {
        this.isHovering = false;
        if (this.cursor) {
          this.cursor.classList.remove('hover');
        }
        if (this.repulsionField) {
          this.repulsionField.classList.remove('hover');
        }
      }
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth <= 768) {
        this.destroy();
      } else if (!this.cursor) {
        this.init();
      }
    });
  }

  destroy() {
    if (this.cursor) {
      this.cursor.remove();
      this.cursor = null;
    }
    if (this.repulsionField) {
      this.repulsionField.remove();
      this.repulsionField = null;
    }
    this.trails.forEach(trail => {
      if (trail.parentNode) {
        trail.parentNode.removeChild(trail);
      }
    });
    this.trails = [];
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new CursorEffect());
} else {
  new CursorEffect();
}
