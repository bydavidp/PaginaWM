/* ═══════════════════════════════════════════════════════════
   particles.js — Niebla de fumigación del hero
   Optimizado: pausa fuera de pantalla, densidad según ancho,
   respeta prefers-reduced-motion y ahorra batería en móvil.
   ═══════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  const PALETTE = ['225,29,46', '0,184,132', '255,255,255'];

  class ParticleSystem {
    constructor(canvasId) {
      this.canvas = document.getElementById(canvasId);
      if (!this.canvas) return;

      this.ctx = this.canvas.getContext('2d', { alpha: true });
      this.particles = [];
      this.running = false;
      this.visible = true;
      this.rafId = null;

      this.resize();
      this.init();

      this._onResize = this.debounce(() => { this.resize(); this.init(); }, 200);
      window.addEventListener('resize', this._onResize, { passive: true });

      // Pausar cuando el hero sale de pantalla
      if ('IntersectionObserver' in window) {
        new IntersectionObserver((entries) => {
          this.visible = entries[0].isIntersecting;
          this.visible ? this.start() : this.stop();
        }, { threshold: 0 }).observe(this.canvas);
      }

      // Pausar cuando la pestaña está en segundo plano
      document.addEventListener('visibilitychange', () => {
        document.hidden ? this.stop() : (this.visible && this.start());
      });

      this.start();
    }

    debounce(fn, ms) {
      let t;
      return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); };
    }

    // Menos partículas en pantallas pequeñas
    get count() {
      const w = window.innerWidth;
      if (w < 640) return 22;
      if (w < 1024) return 38;
      return 55;
    }

    resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      this.w = this.canvas.offsetWidth;
      this.h = this.canvas.offsetHeight;
      this.canvas.width = this.w * dpr;
      this.canvas.height = this.h * dpr;
      this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    spawn() {
      return {
        x: Math.random() * this.w,
        y: Math.random() * this.h,
        size: Math.random() * 2.6 + 0.8,
        speedX: (Math.random() - 0.5) * 0.55,
        speedY: (Math.random() - 0.5) * 0.55,
        opacity: Math.random() * 0.45 + 0.08,
        life: 0,
        maxLife: 90 + Math.random() * 70,
        color: PALETTE[Math.floor(Math.random() * PALETTE.length)],
      };
    }

    init() {
      this.particles = Array.from({ length: this.count }, () => {
        const p = this.spawn();
        p.life = Math.random() * p.maxLife;
        return p;
      });
    }

    start() {
      if (this.running || document.hidden) return;
      this.running = true;
      this.loop();
    }

    stop() {
      this.running = false;
      if (this.rafId) cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }

    loop() {
      if (!this.running) return;
      const { ctx } = this;
      ctx.clearRect(0, 0, this.w, this.h);

      for (let i = 0; i < this.particles.length; i++) {
        const p = this.particles[i];
        p.life++;
        p.x += p.speedX;
        p.y += p.speedY;

        // Reaparecer por los bordes
        if (p.x < -10) p.x = this.w + 10;
        if (p.x > this.w + 10) p.x = -10;

        const fadeIn = Math.min(1, p.life / (p.maxLife * 0.3));
        const fadeOut = p.life > p.maxLife * 0.7
          ? 1 - (p.life - p.maxLife * 0.7) / (p.maxLife * 0.3)
          : 1;
        const alpha = p.opacity * Math.max(0, Math.min(fadeIn, fadeOut));

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color},${alpha})`;
        ctx.fill();

        if (p.life >= p.maxLife) this.particles[i] = this.spawn();
      }

      this.rafId = requestAnimationFrame(() => this.loop());
    }
  }

  function boot() {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const canvas = document.getElementById('hero-canvas');
    if (reduced) { if (canvas) canvas.style.display = 'none'; return; }
    new ParticleSystem('hero-canvas');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
