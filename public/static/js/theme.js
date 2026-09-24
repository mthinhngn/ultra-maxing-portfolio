(() => {
  const root = document.documentElement;
  const storageKey = 'portfolio-theme';
  const favicon = document.querySelector('#site-favicon');
  const updateFavicon = () => {
    if (!favicon) return;
    favicon.href = root.dataset.theme === 'dark' ? favicon.dataset.darkIcon : favicon.dataset.lightIcon;
  };
  try {
    root.dataset.theme = localStorage.getItem(storageKey) === 'dark' ? 'dark' : 'light';
  } catch {
    root.dataset.theme = 'light';
  }
  updateFavicon();

  document.addEventListener('DOMContentLoaded', () => {
    const button = document.querySelector('#theme-toggle');
    if (!button) return;
    const animation = button.querySelector('.theme-animation');
    const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
    const compactScreen = matchMedia('(max-width: 600px)');
    const stopAnimation = () => {
      if (!animation) return;
      animation.pause();
      animation.hidden = true;
      button.classList.remove('is-animating');
    };
    const playAnimation = (theme) => {
      if (!animation || compactScreen.matches) return;
      stopAnimation();
      animation.src = theme === 'dark' ? animation.dataset.toNight : animation.dataset.toDay;
      animation.playbackRate = reducedMotion.matches ? 2 : 1;
      animation.hidden = false;
      button.classList.add('is-animating');
      animation.play().catch(stopAnimation);
    };
    animation?.addEventListener('ended', stopAnimation);
    animation?.addEventListener('error', stopAnimation);
    const updateControl = () => {
      const light = root.dataset.theme === 'light';
      button.setAttribute('aria-checked', String(light));
      button.title = light ? 'Switch to dark theme' : 'Switch to light theme';
    };
    button.hidden = false;
    updateControl();
    button.addEventListener('click', () => {
      root.dataset.theme = root.dataset.theme === 'light' ? 'dark' : 'light';
      updateFavicon();
      try {
        localStorage.setItem(storageKey, root.dataset.theme);
      } catch {
        // Theme switching still works when browser storage is unavailable.
      }
      updateControl();
      playAnimation(root.dataset.theme);
    });
  });
})();
