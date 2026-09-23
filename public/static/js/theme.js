(() => {
  const root = document.documentElement;
  const storageKey = 'portfolio-theme';
  try {
    root.dataset.theme = localStorage.getItem(storageKey) === 'light' ? 'light' : 'dark';
  } catch {
    root.dataset.theme = 'dark';
  }

  document.addEventListener('DOMContentLoaded', () => {
    const button = document.querySelector('#theme-toggle');
    if (!button) return;
    const updateControl = () => {
      const light = root.dataset.theme === 'light';
      button.setAttribute('aria-checked', String(light));
      button.title = light ? 'Switch to dark theme' : 'Switch to light theme';
    };
    button.hidden = false;
    updateControl();
    button.addEventListener('click', () => {
      root.dataset.theme = root.dataset.theme === 'light' ? 'dark' : 'light';
      try {
        localStorage.setItem(storageKey, root.dataset.theme);
      } catch {
        // Theme switching still works when browser storage is unavailable.
      }
      updateControl();
    });
  });
})();
