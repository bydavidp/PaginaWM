(function () {
  class ParticleSystem {
    constructor(canvasId) {
      this.canvas = document.getElementById(canvasId);
      if (!this.canvas) return;
      this.ctx = this.canvas.getContext('2d');
      this.particles = [];
      this.resize();
      window.addEventListener('resize', () => this.resize());
      this.init();
      this.animate();
    }

    resize() {
      this.canvas.width = this.canvas.offsetWidth;
      this.canvas.height = this.canvas.offsetHeight;
    }

    init() {
      for (let i = 0; i < 60; i++) {
        this.particles.push({
          x: Math.random() * this.canvas.width,
          y: Math.random() * this.canvas.height,
          size: Math.random() * 3 + 1,
          speedX: (Math.random() - 0.5) * 0.8,
          speedY: (Math.random() - 0.5) * 0.8,
          opacity: Math.random() * 0.6 + 0.1,
          life: Math.random() * 100,
          maxLife: 80 + Math.random() * 60,
          color: Math.random() > 0.5 ? '204,0,0' : '212,168,71',
        });
      }
    }

    animate() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.particles.forEach((p, i) => {
        p.life++;
        p.x += p.speedX;
        p.y += p.speedY;
        const fade =
          p.life > p.maxLife * 0.7
            ? 1 - (p.life - p.maxLife * 0.7) / (p.maxLife * 0.3)
            : p.life / (p.maxLife * 0.3);
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        this.ctx.fillStyle = `rgba(${p.color},${p.opacity * Math.max(0, fade)})`;
        this.ctx.fill();
        if (p.life >= p.maxLife) {
          this.particles[i] = {
            x: Math.random() * this.canvas.width,
            y: Math.random() * this.canvas.height,
            size: Math.random() * 3 + 1,
            speedX: (Math.random() - 0.5) * 0.8,
            speedY: (Math.random() - 0.5) * 0.8,
            opacity: Math.random() * 0.6 + 0.1,
            life: 0,
            maxLife: 80 + Math.random() * 60,
            color: Math.random() > 0.5 ? '204,0,0' : '212,168,71',
          };
        }
      });
      requestAnimationFrame(() => this.animate());
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    new ParticleSystem('hero-canvas');
  });
})();
