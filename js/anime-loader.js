(() => {
  'use strict';

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    window.animeLoadState = 'skipped';
    return;
  }

  window.animeLoadState = 'pending';

  function loadAnime() {
    const script = document.createElement('script');
    script.src = 'js/vendor/anime.min.js?v=8';
    script.async = true;
    script.onload = () => {
      window.animeLoadState = 'loaded';
      window.dispatchEvent(new Event('animejsready'));
    };
    script.onerror = () => {
      window.animeLoadState = 'failed';
      window.dispatchEvent(new Event('animejsfailed'));
    };
    document.head.appendChild(script);
  }

  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(loadAnime, { timeout: 2000 });
  } else {
    window.setTimeout(loadAnime, 300);
  }
})();
