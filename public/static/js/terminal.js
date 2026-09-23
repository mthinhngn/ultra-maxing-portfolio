const promptForm = document.querySelector('.prompt');

if (promptForm) {
  const commandInput = document.querySelector('#command');
  const terminalLog = document.querySelector('#terminal-log');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  const routeNames = {
    home: 'home',
    project: 'projects',
    projects: 'projects',
    work: 'projects',
    experience: 'experience',
    about: 'about',
    whoami: 'about',
    education: 'about',
    skills: 'about',
    contact: 'contact',
  };

  const routes = Object.fromEntries(
    Object.entries(promptForm.dataset)
      .filter(([key]) => key.startsWith('route'))
      .map(([key, value]) => [key.replace('route', '').toLowerCase(), value]),
  );

  const writeLog = (command, message, state = '') => {
    terminalLog.replaceChildren();

    const commandLine = document.createElement('p');
    commandLine.className = 'terminal-log-command';
    commandLine.textContent = `> /${command}`;

    const responseLine = document.createElement('p');
    responseLine.className = state;
    responseLine.textContent = message;

    terminalLog.append(commandLine, responseLine);
  };

  const normalizeCommand = (value) => value.trim().toLowerCase().replace(/^\/+/, '');

  promptForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const command = normalizeCommand(commandInput.value);

    if (!command) {
      writeLog('', 'Enter a route or type /help.', 'terminal-error');
      return;
    }

    if (command === 'help') {
      writeLog(command, 'Available: /project /experience /about /contact /home');
      commandInput.select();
      return;
    }

    if (command === 'clear') {
      terminalLog.replaceChildren();
      commandInput.value = '';
      return;
    }

    const routeName = routeNames[command];
    const destination = routeName ? routes[routeName] : null;

    if (!destination) {
      writeLog(command, `Command not found: /${command}. Try /help.`, 'terminal-error');
      commandInput.select();
      return;
    }

    writeLog(command, `Opening /${routeName}...`, 'terminal-success');
    const navigationDelay = prefersReducedMotion.matches ? 0 : 180;
    window.setTimeout(() => window.location.assign(destination), navigationDelay);
  });
}
