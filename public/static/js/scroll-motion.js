const scrollTrace = document.querySelector('.scroll-trace');
const scrollTraceValue = scrollTrace?.querySelector('.scroll-trace-value');
const scrollTraceProgress = scrollTrace?.querySelector('.scroll-trace-progress');
const desktopScrollMedia = window.matchMedia('(min-width: 1000px)');
const SCROLL_TRACE_LENGTH = 128;

if (scrollTrace && scrollTraceValue && scrollTraceProgress) {
  let frameRequested = false;

  const updateScrollTrace = () => {
    const scrollableDistance = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollableDistance > 0
      ? Math.min(Math.max(window.scrollY / scrollableDistance, 0), 1)
      : 1;

    scrollTrace.hidden = !desktopScrollMedia.matches || scrollableDistance < 24;
    scrollTraceProgress.style.strokeDasharray = `${(progress * SCROLL_TRACE_LENGTH).toFixed(2)} ${SCROLL_TRACE_LENGTH}`;
    scrollTrace.dataset.atEnd = String(progress > 0.995);
    scrollTraceValue.textContent = `${Math.round(progress * 100).toString().padStart(2, '0')}%`;
    frameRequested = false;
  };

  const requestScrollTraceUpdate = () => {
    if (frameRequested) return;
    frameRequested = true;
    window.requestAnimationFrame(updateScrollTrace);
  };

  window.addEventListener('scroll', requestScrollTraceUpdate, { passive: true });
  window.addEventListener('resize', requestScrollTraceUpdate, { passive: true });
  window.addEventListener('load', requestScrollTraceUpdate, { once: true });
  window.addEventListener('pageshow', requestScrollTraceUpdate);
  desktopScrollMedia.addEventListener('change', requestScrollTraceUpdate);
  updateScrollTrace();
}
