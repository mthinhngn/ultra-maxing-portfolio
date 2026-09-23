const portfolioPrompt = document.querySelector('#portfolio-prompt');
if (portfolioPrompt) initializePortfolio(portfolioPrompt);

const portfolioTerminal = document.querySelector('.portfolio-terminal');
if (portfolioTerminal) initializeTerminalResize(portfolioTerminal);

const UNKNOWN_REPLY = 'I couldn’t match that request. Try /projects, /experience, /about, or /contact.';
const WORD_REVEAL_TRANSITION_MS = 380;

function commandDistance(left, right) {
  let row = Array.from({ length: right.length + 1 }, (_, index) => index);
  for (let i = 1; i <= left.length; i += 1) {
    const next = [i];
    for (let j = 1; j <= right.length; j += 1) {
      next[j] = Math.min(next[j - 1] + 1, row[j] + 1, row[j - 1] + (left[i - 1] !== right[j - 1]));
    }
    row = next;
  }
  return row[right.length];
}

function normalizeQuery(value) {
  return value.normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function initializePortfolio(form) {
  const input = form.querySelector('input');
  const menu = document.querySelector('#command-options');
  const options = [...menu.querySelectorAll('[role="option"]')];
  const transcript = document.querySelector('#terminal-log');
  const output = document.querySelector('#session-output');
  output.addEventListener('pointermove', (event) => {
    if (event.pointerType !== 'mouse') return;
    if (output.scrollHeight <= output.clientHeight + 1) {
      output.classList.remove('is-scrollbar-hovered');
      return;
    }
    const distanceFromRightEdge = output.getBoundingClientRect().right - event.clientX;
    const hoverZone = output.classList.contains('is-scrollbar-hovered') ? 42 : 8;
    output.classList.toggle('is-scrollbar-hovered', distanceFromRightEdge >= 0 && distanceFromRightEdge <= hoverZone);
  });
  output.addEventListener('pointerleave', () => output.classList.remove('is-scrollbar-hovered'));
  const welcome = document.querySelector('#welcome-screen');
  const session = document.querySelector('#portfolio-session');
  const projectTemplate = document.querySelector('#reply-projects');
  const projectArticles = [...projectTemplate.content.querySelectorAll('[data-project-title]')];
  const announcement = document.querySelector('#terminal-announcement');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const previousResponses = new Map();
  const topicNames = {
    experience: 'Experience',
    projects: 'Projects',
    about: 'About me',
    contact: 'Contact',
  };
  const topicAliases = new Map([
    ['experience', 'experience'],
    ['work experience', 'experience'],
    ['project', 'projects'],
    ['projects', 'projects'],
    ['selected projects', 'projects'],
    ['my projects', 'projects'],
    ['about', 'about'],
    ['about me', 'about'],
    ['contact', 'contact'],
    ['get in touch', 'contact'],
  ]);
  const topicCommands = Object.keys(topicNames);
  let selected = 0;
  let activeTyping = null;
  let keyboardSelection = false;

  function highlight(index) {
    selected = (index + options.length) % options.length;
    options.forEach((option, optionIndex) => {
      option.setAttribute('aria-selected', String(optionIndex === selected));
    });
    input.setAttribute('aria-activedescendant', options[selected].id);
  }

  function setMenu(open) {
    menu.hidden = !open;
    input.setAttribute('aria-expanded', String(open));
    if (open) highlight(selected);
    else input.removeAttribute('aria-activedescendant');
  }

  function startSession() {
    if (welcome.hidden) return;
    welcome.hidden = true;
    session.hidden = false;
    input.focus();
  }

  function topicResolution(topic) {
    return {
      type: 'topic',
      key: 'topic:' + topic,
      label: topicNames[topic],
      topic,
    };
  }

  function resolveRequest(value) {
    const query = normalizeQuery(value.replace(/^\s*\/+/, ''));
    if (query === 'clear') return { type: 'clear' };

    const exactTopic = topicAliases.get(query);
    if (exactTopic) return topicResolution(exactTopic);

    if (/(^| )(show|list|all|my|selected|portfolio) projects?($| )/.test(query)) {
      return topicResolution('projects');
    }

    const matchingProject = projectArticles.find(article => {
      const title = normalizeQuery(article.dataset.projectTitle);
      return title && query.includes(title);
    });
    if (matchingProject) {
      const title = matchingProject.dataset.projectTitle;
      return {
        type: 'project',
        key: 'project:' + normalizeQuery(title),
        label: title,
        article: matchingProject,
      };
    }

    if (query.includes('experience')) return topicResolution('experience');
    if (query.includes('about me') || query === 'about thinh') return topicResolution('about');
    if (query.includes('contact') || query.includes('get in touch')) return topicResolution('contact');

    if (/^[a-z]{4,12}$/.test(query)) {
      const candidates = topicCommands
        .map(topic => ({ topic, distance: commandDistance(query, topic) }))
        .sort((left, right) => left.distance - right.distance);
      if (candidates[0].distance <= 2 && candidates[0].distance < candidates[1].distance) {
        return topicResolution(candidates[0].topic);
      }
    }

    return {
      type: 'unknown',
      key: 'unknown:' + query,
      label: 'that request',
    };
  }

  function finishActiveTyping() {
    activeTyping?.finish();
  }

  function revealReply(reply) {
    const replyContent = reply.querySelector('.conversation-reply-content');
    const walker = document.createTreeWalker(replyContent, NodeFilter.SHOW_TEXT);
    const textNodes = [];
    while (walker.nextNode()) {
      if (walker.currentNode.textContent.trim()) textNodes.push(walker.currentNode);
    }
    if (!textNodes.length) return;

    const generatedWords = [];
    textNodes.forEach(node => {
      const fragment = document.createDocumentFragment();
      node.textContent.split(/(\s+)/).forEach(part => {
        if (/\s+/.test(part) || !part) {
          fragment.append(document.createTextNode(part));
          return;
        }
        const word = document.createElement('span');
        word.className = 'generated-word';
        word.textContent = part;
        fragment.append(word);
        generatedWords.push(word);
      });
      node.replaceWith(fragment);
    });

    if (!generatedWords.length) return;
    reply.setAttribute('aria-busy', 'true');
    const targetRevealDuration = reducedMotion.matches
      ? Math.min(1300, Math.max(700, generatedWords.length * 24))
      : Math.min(2600, Math.max(800, generatedWords.length * 48));
    const revealDelay = targetRevealDuration / generatedWords.length;
    const revealTimers = [];
    const typing = {
      finish() {
        revealTimers.forEach(timer => window.clearTimeout(timer));
        generatedWords.forEach(word => word.classList.add('is-visible'));
        reply.removeAttribute('aria-busy');
        if (activeTyping === typing) activeTyping = null;
      },
    };
    generatedWords.forEach((word, index) => {
      const timer = window.setTimeout(() => word.classList.add('is-visible'), (index + 1) * revealDelay);
      revealTimers.push(timer);
    });
    const finishTimer = window.setTimeout(
      typing.finish,
      targetRevealDuration + (reducedMotion.matches ? 0 : WORD_REVEAL_TRANSITION_MS),
    );
    revealTimers.push(finishTimer);
    activeTyping = typing;
  }

  function scrollToEntry(entry) {
    const entryTop = entry.getBoundingClientRect().top;
    const outputTop = output.getBoundingClientRect().top;
    output.scrollTo({
      top: Math.max(0, output.scrollTop + entryTop - outputTop - 12),
      behavior: reducedMotion.matches ? 'auto' : 'smooth',
    });
    entry.classList.remove('is-returned');
    void entry.offsetWidth;
    entry.classList.add('is-returned');
  }

  function createReply(resolution) {
    const reply = document.createElement('div');
    reply.className = 'conversation-reply';
    const marker = document.createElement('span');
    marker.className = 'conversation-reply-marker';
    marker.setAttribute('aria-hidden', 'true');
    marker.textContent = '•';
    const content = document.createElement('div');
    content.className = 'conversation-reply-content';

    if (resolution.type === 'unknown') {
      reply.classList.add('conversation-reply-error');
      content.classList.add('conversation-error');
      content.textContent = UNKNOWN_REPLY;
    } else if (resolution.type === 'project') {
      content.append(resolution.article.cloneNode(true));
    } else {
      const template = document.querySelector('#reply-' + resolution.topic);
      content.append(template.content.cloneNode(true));
    }

    reply.append(marker, content);
    return reply;
  }

  function resetConversation() {
    finishActiveTyping();
    transcript.replaceChildren();
    previousResponses.clear();
    input.value = '';
    selected = 0;
    keyboardSelection = false;
    setMenu(true);
    input.focus();
    announcement.textContent = 'Conversation cleared.';
  }

  function send(value) {
    const query = value.trim();
    if (!query) return;

    finishActiveTyping();
    const resolution = resolveRequest(query);
    input.value = '';
    setMenu(false);
    keyboardSelection = false;
    selected = 0;

    if (resolution.type === 'clear') {
      resetConversation();
      return;
    }

    const previousEntry = previousResponses.get(resolution.key);
    if (previousEntry) {
      scrollToEntry(previousEntry);
      input.focus();
      announcement.textContent = 'Showing the earlier ' + resolution.label + ' response.';
      return;
    }

    const entry = document.createElement('section');
    entry.className = 'conversation-entry';
    entry.dataset.responseKey = resolution.key;

    const request = document.createElement('p');
    request.className = 'conversation-command';
    const promptLabel = document.createElement('span');
    promptLabel.className = 'conversation-prefix';
    promptLabel.textContent = 'thinh@portfolio:~$ ';
    const promptText = document.createElement('span');
    promptText.className = 'conversation-question';
    promptText.textContent = query;
    request.append(promptLabel, promptText);

    const reply = createReply(resolution);
    entry.append(request, reply);
    transcript.append(entry);
    previousResponses.set(resolution.key, entry);
    scrollToEntry(entry);
    input.focus();
    revealReply(reply);
    announcement.textContent = 'Added a response for ' + resolution.label + '.';
  }

  document.querySelector('#continue-button').addEventListener('click', startSession);
  document.addEventListener('keydown', event => {
    if (event.key === 'Enter' && !welcome.hidden && (event.target === document.body || welcome.contains(event.target))) {
      event.preventDefault();
      startSession();
    }
  });

  input.addEventListener('focus', () => setMenu(true));
  input.addEventListener('click', () => setMenu(true));
  input.addEventListener('input', () => {
    keyboardSelection = false;
    selected = 0;
    setMenu(true);
  });
  input.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      setMenu(false);
      keyboardSelection = false;
    }
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      const wasClosed = menu.hidden;
      setMenu(true);
      highlight(wasClosed ? 0 : selected + (event.key === 'ArrowDown' ? 1 : -1));
      keyboardSelection = true;
    }
  });

  options.forEach(option => {
    option.addEventListener('mousedown', event => event.preventDefault());
    option.addEventListener('click', () => send('/' + option.dataset.command));
  });
  document.addEventListener('pointerdown', event => {
    if (!event.target.closest('.command-dock')) setMenu(false);
  });
  form.addEventListener('focusout', event => {
    if (!form.contains(event.relatedTarget)) setMenu(false);
  });
  form.addEventListener('submit', event => {
    event.preventDefault();
    const value = input.value.trim();
    if (!menu.hidden && (!value || keyboardSelection)) {
      send('/' + options[selected].dataset.command);
    } else if (value) {
      send(value);
    } else {
      setMenu(true);
    }
  });

  reducedMotion.addEventListener('change', () => {
    if (reducedMotion.matches) finishActiveTyping();
  });
}

function initializeTerminalResize(terminal) {
  const resizeControl = terminal.querySelector('#terminal-resize');
  const maximizeControl = terminal.querySelector('#terminal-maximize');
  const layout = document.querySelector('#main-content');
  const pointerResize = matchMedia('(min-width: 601px) and (pointer: fine)');
  const minimumSize = { width: 480, height: 380 };
  const maximumSize = { width: 1280, height: 1000 };
  let activeResize = null;

  function setMaximized(maximized) {
    if (maximized) {
      const bounds = terminal.getBoundingClientRect();
      const zoom = Math.max(1, Math.min(1.6, window.innerWidth / bounds.width, window.innerHeight / bounds.height));
      terminal.style.setProperty('--terminal-content-zoom', zoom.toFixed(3));
      terminal.style.setProperty('--terminal-content-width', window.innerWidth / zoom + 'px');
      terminal.style.setProperty('--terminal-content-height', window.innerHeight / zoom + 'px');
    } else {
      terminal.style.removeProperty('--terminal-content-zoom');
      terminal.style.removeProperty('--terminal-content-width');
      terminal.style.removeProperty('--terminal-content-height');
    }
    terminal.classList.toggle('is-maximized', maximized);
    maximizeControl.setAttribute('aria-pressed', String(maximized));
    maximizeControl.setAttribute('aria-label', maximized ? 'Restore terminal size' : 'Maximize terminal');
    maximizeControl.title = maximized ? 'Restore terminal size' : 'Maximize terminal';
    maximizeControl.querySelector('[data-maximize-icon]').hidden = maximized;
    maximizeControl.querySelector('[data-restore-icon]').hidden = !maximized;
  }

  function availableBounds() {
    const layoutStyle = getComputedStyle(layout);
    const bounds = layout.getBoundingClientRect();
    return {
      left: bounds.left + parseFloat(layoutStyle.paddingLeft),
      right: bounds.right - parseFloat(layoutStyle.paddingRight),
      top: bounds.top + parseFloat(layoutStyle.paddingTop),
      bottom: bounds.bottom - parseFloat(layoutStyle.paddingBottom),
    };
  }

  function boundedSize(value, minimum, maximum, hardMaximum) {
    const max = Math.max(0, Math.min(maximum, hardMaximum));
    const min = Math.min(minimum, max);
    return Math.round(Math.max(min, Math.min(value, max)));
  }

  function setSize(width, height, maxWidth, maxHeight, offsetX, offsetY) {
    const nextWidth = boundedSize(width, minimumSize.width, maxWidth, maximumSize.width);
    const nextHeight = boundedSize(height, minimumSize.height, maxHeight, maximumSize.height);
    terminal.style.setProperty('--terminal-width', nextWidth + 'px');
    terminal.style.setProperty('--terminal-height', nextHeight + 'px');
    terminal.style.setProperty('--terminal-offset-x', offsetX + 'px');
    terminal.style.setProperty('--terminal-offset-y', offsetY + 'px');
  }

  function applyKeyboardSize(width, height) {
    const area = availableBounds();
    const bounds = terminal.getBoundingClientRect();
    const maxWidth = Math.min(bounds.width + 2 * (bounds.left - area.left), bounds.width + 2 * (area.right - bounds.right));
    const maxHeight = Math.min(bounds.height + 2 * (bounds.top - area.top), bounds.height + 2 * (area.bottom - bounds.bottom));
    setSize(width, height, maxWidth, maxHeight, currentOffset('x'), currentOffset('y'));
  }

  function currentOffset(axis) {
    return parseFloat(terminal.style.getPropertyValue('--terminal-offset-' + axis)) || 0;
  }

  function resetSize() {
    terminal.style.removeProperty('--terminal-width');
    terminal.style.removeProperty('--terminal-height');
    terminal.style.removeProperty('--terminal-offset-x');
    terminal.style.removeProperty('--terminal-offset-y');
  }

  function syncPointerResize() {
    terminal.classList.toggle('is-resizable', pointerResize.matches);
    if (!pointerResize.matches) resetSize();
  }

  syncPointerResize();
  pointerResize.addEventListener('change', syncPointerResize);
  maximizeControl.addEventListener('click', () => setMaximized(!terminal.classList.contains('is-maximized')));

  terminal.addEventListener('pointerdown', event => {
    const edge = event.target.closest('.terminal-resize-edge');
    if (!pointerResize.matches || !edge || (event.pointerType === 'mouse' && event.button !== 0)) return;

    const bounds = terminal.getBoundingClientRect();
    activeResize = {
      pointerId: event.pointerId,
      edge: edge.dataset.edge,
      x: event.clientX,
      y: event.clientY,
      width: bounds.width,
      height: bounds.height,
      bounds,
      offsetX: currentOffset('x'),
      offsetY: currentOffset('y'),
    };
    terminal.setPointerCapture(event.pointerId);
    event.preventDefault();
  });

  terminal.addEventListener('pointermove', event => {
    if (!activeResize || event.pointerId !== activeResize.pointerId) return;
    const bounds = availableBounds();
    const edge = activeResize.edge;
    const deltaX = event.clientX - activeResize.x;
    const deltaY = event.clientY - activeResize.y;
    const isWest = edge.includes('w');
    const isEast = edge.includes('e');
    const isNorth = edge.includes('n');
    const isSouth = edge.includes('s');
    const maxWidth = isEast ? bounds.right - activeResize.bounds.left : isWest ? activeResize.bounds.right - bounds.left : bounds.right - bounds.left;
    const maxHeight = isSouth ? bounds.bottom - activeResize.bounds.top : isNorth ? activeResize.bounds.bottom - bounds.top : bounds.bottom - bounds.top;
    const nextWidth = boundedSize(activeResize.width + (isEast ? deltaX : isWest ? -deltaX : 0), minimumSize.width, maxWidth, maximumSize.width);
    const nextHeight = boundedSize(activeResize.height + (isSouth ? deltaY : isNorth ? -deltaY : 0), minimumSize.height, maxHeight, maximumSize.height);
    const offsetX = activeResize.offsetX + (isEast ? 1 : isWest ? -1 : 0) * (nextWidth - activeResize.width) / 2;
    const offsetY = activeResize.offsetY + (isSouth ? 1 : isNorth ? -1 : 0) * (nextHeight - activeResize.height) / 2;

    setSize(nextWidth, nextHeight, maxWidth, maxHeight, offsetX, offsetY);
  });

  function finishResize(event) {
    if (!activeResize || event.pointerId !== activeResize.pointerId) return;
    activeResize = null;
  }

  terminal.addEventListener('pointerup', finishResize);
  terminal.addEventListener('pointercancel', finishResize);

  resizeControl.addEventListener('click', resetSize);
  resizeControl.addEventListener('keydown', event => {
    if (event.key === 'Enter' || event.key === 'Home') {
      event.preventDefault();
      resetSize();
      return;
    }

    const step = event.shiftKey ? 80 : 32;
    const widthDelta = event.key === 'ArrowRight' ? step : event.key === 'ArrowLeft' ? -step : 0;
    const heightDelta = event.key === 'ArrowDown' ? step : event.key === 'ArrowUp' ? -step : 0;
    if (!widthDelta && !heightDelta) return;

    event.preventDefault();
    const bounds = terminal.getBoundingClientRect();
    applyKeyboardSize(bounds.width + widthDelta, bounds.height + heightDelta);
  });
}
