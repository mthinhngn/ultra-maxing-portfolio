const desktopMedia = window.matchMedia('(min-width: 1000px)');
const video = document.querySelector('#terminal-scene');
const motionToggle = document.querySelector('#scene-toggle');

if (video && motionToggle) initializeBackground(video, motionToggle);

function initializeBackground(video, button) {
  let motionEnabled = true;
  let failed = false;

  const updateControl = () => {
    const running = !video.paused;
    document.documentElement.dataset.motion = running ? 'running' : 'paused';
    video.dataset.sceneStatus = failed ? 'unavailable' : running ? 'ready' : 'static';
    button.hidden = !desktopMedia.matches || failed;
    button.setAttribute('aria-pressed', String(running));
    button.textContent = running ? 'Motion: running / pause' : 'Motion: paused / play';
  };

  const synchronize = async () => {
    video.parentElement.hidden = !desktopMedia.matches || failed;
    if (!desktopMedia.matches || document.hidden || !motionEnabled || failed) {
      video.pause();
      updateControl();
      return;
    }

    if (!video.hasAttribute('src')) video.src = video.dataset.source;
    video.muted = true;
    try {
      await video.play();
    } catch (error) {
      // Autoplay may be blocked; keep a working manual play control.
      if (error.name !== 'AbortError' && error.name !== 'NotAllowedError') {
        console.warn('Portfolio background playback failed:', error);
      }
    }
    updateControl();
  };

  button.addEventListener('click', () => {
    motionEnabled = video.paused;
    synchronize();
  });
  desktopMedia.addEventListener('change', synchronize);
  document.addEventListener('visibilitychange', synchronize);
  window.addEventListener('pagehide', () => video.pause());
  window.addEventListener('pageshow', synchronize);
  video.addEventListener('play', updateControl);
  video.addEventListener('pause', updateControl);
  video.addEventListener('error', () => {
    failed = true;
    synchronize();
    console.warn('Portfolio background unavailable; using the static black background.');
  });
  synchronize();
}
