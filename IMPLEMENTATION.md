# Implementation Report

## 2026-09-22 - Vercel deployment preparation

### What changed and why

- Moved browser assets from `static/` to `public/static/` so Vercel can serve them from its CDN, including the downloadable resume.
- Pointed Flask's existing `static` endpoint at `public/static`, preserving the `/static/...` paths used by templates during local development.
- Added `.python-version` for Python 3.12. Vercel's Flask zero-configuration runtime serves `public/**` assets directly and discovers the root Flask app without a custom routing configuration.
- Replaced the starter README with the portfolio architecture, local run steps, and Vercel deployment commands.

### Architecture and trade-offs

Vercel's Flask runtime discovers the root `app.py` WSGI object and installs Flask from `requirements.txt`. The platform serves `public/**` assets separately, while Flask/Jinja handles the five content routes. The video remains hosted on CloudFront, so its playback still depends on that external host and the visitor's connection.

### Verification performed

- Flask test-client smoke checks returned 200 for all five pages, CSS, JavaScript, and the resume PDF. JavaScript syntax checks and `git diff --check` passed.
- The first Vercel build rejected a function exclusion override because the zero-configuration Flask app has no `api/` serverless function. Removed that unnecessary override; retry pending.
- Pending: confirm Vercel CLI build and production behavior after account authentication.

### Git state

The initial deployment commit is pushed to `origin/main`. Follow-up Vercel configuration corrections and deployment verification remain in progress.

## 2026-09-22 - Scroll-linked terminal trace

### What changed

Added a desktop scroll indicator inspired by Studians LLC's `scroll line animation` reference on LottieFiles. A bright segment repeatedly travels down a thin vertical rail, while a cyan/cobalt line and percentage display the visitor's actual page progress. The traveling segment fades at 100%.

### Architecture and decisions

The indicator is a small inline SVG in the shared Jinja shell. `scroll-motion.js` calculates normalized page progress inside `requestAnimationFrame`, updates a 128px SVG stroke, and responds to passive scroll/resize events. CSS owns the traveling pulse and derives its colors from the existing dark/light theme tokens. The existing Motion control pauses both the background video and scroll pulse.

The source animation is a simple 125 × 500, single-layer, two-second line animation under the Lottie Simple License (https://lottiefiles.com/free-animation/scroll-line-animation-pmOjfRFHXC). A code-native SVG interpretation was used so it can represent real scroll progress, inherit both portfolio themes, and avoid adding a Lottie runtime for one line. It appears only on scrollable desktop pages and remains decorative to assistive technology.

### Verification performed

- JavaScript syntax checks passed for `scroll-motion.js` and `scene.js`; Flask returned 200 for Home, Experience, and the new static module. `git diff --check` passed.
- Browser inspection at 1440 × 900 confirmed correct 00%, 49%, and 100% states, including the corresponding 0px, 63.13px, and 127.94px progress strokes.
- Dark mode used cyan and light mode inherited cobalt (`#264da6`). The page had no horizontal overflow.
- Pausing Motion paused the background video and the scroll pulse; restarting Motion resumed both. No browser warnings or errors were observed.
- No mobile implementation or visual pass was performed because the active design scope is desktop.

### Git state

Changes remain local and uncommitted alongside the pre-existing workspace changes. No push or remote action was performed.

## 2026-09-22 - Compact theme toggle and experience summaries

### What changed

- Reduced the sun/moon theme toggle from 66 × 34px to 46 × 24px, including its icons and sliding knob, to sit closer to the 12px Motion label.
- Rewrote the four Experience summaries so each presents the contribution and outcome in plain language within two lines at the 1440px desktop viewport. Existing dates, organizations, roles, technologies, and quantitative claims were preserved.
- Changed the home `focus` line from hardware-adjacent software to AI agents, as requested.

### Architecture and decisions

The experience text remains in the `EXPERIENCE` data in `app.py`; the Jinja template continues to render it without layout-specific truncation. The icon adjustment is scoped to the existing CSS theme switch. No new dependencies or portfolio claims were introduced. Two lines are verified at the specified desktop width; narrower windows may naturally wrap.

### Verification performed

At 1440 × 900 in the browser, all four summaries measured exactly two rendered lines and the Experience page had no horizontal overflow. The Home page displayed the revised focus text, and the theme switch measured 46 × 24px next to Motion. No browser warnings or errors were observed. Python/Flask and diff checks were run for this change. Mobile layout was outside this desktop-focused request.

### Git state

Changes remain local and uncommitted alongside the pre-existing modified README and untracked application files. No push or remote action was performed.

## 2026-09-22 - Reduce dark background glare

Reduced the dark-theme video brightness filter from 0.8 to 0.6 (25% lower) to soften bright cyan areas. This focused CSS adjustment leaves text, playback, and the separate light-theme filter unchanged. Verified the stylesheet change and git diff --check; no additional browser visual pass performed for this adjustment. Changes remain local and uncommitted.

## 2026-09-22 - Default motion and light theme

Motion now starts enabled on desktop as explicitly requested, including when reduced motion is configured. The manual Pause button and hidden-tab pause remain available; browser autoplay restrictions may still require Play. Existing CSS reduced-motion rules remain unchanged.

Added a sun/cloud and moon SVG theme switch beside Motion at the bottom right of the content. The icon is a code-native interpretation of the supplied toggle reference. Light mode uses warm off-white, charcoal text, cobalt accents, inverted name artwork, and an inverted subdued video. Dark remains the first-visit default.

Architecture: shared Jinja markup plus semantic CSS theme tokens; a separate theme.js applies the saved preference before styles load and handles the accessible switch. The preference is stored locally in the visitor's browser, persists across page navigation/reloads, and gracefully falls back if storage is unavailable. No framework or new dependency was added.

Validation: JavaScript syntax checks and git diff --check passed. Desktop inspection at 1440x900 confirmed automatic video playback with advancing time, the light palette and adjacent switch, and no horizontal overflow. Reload preserved the light theme; Space switched back to dark. Browser logs reported no warnings/errors. Mobile was not redesigned or tested. Changes remain uncommitted with prior workspace changes preserved; no remote actions.

## 2026-09-22 - Reference video background and welcome wording

Replaced the home frame label with `PORTFOLIO` and `THINH NGUYEN · v1.0.0`, and changed the greeting to `Welcome to my portfolio.` The existing thinh@portfolio identity remains unchanged.

Replaced the procedural Three.js tunnel with the user-supplied CloudFront video: light traces, particles, and corner illumination. CSS desaturates and tints the video toward cyan, adjusts brightness, and shades content regions. This uses the supplied footage, not an original procedural simulation. Existing Flask/Jinja structure and terminal command navigation remain intact.

The shared template provides a decorative muted looping video. scene.js owns desktop-only lazy loading, playback, a keyboard-accessible pause/play button, reduced-motion defaults, visibility handling, and failure fallback. Reduced-motion users see the black background until they explicitly choose Play. The browser pauses playback in hidden tabs. The previous Three.js CDN import is no longer used.

Trade-off: referencing the supplied URL avoids duplicating the video asset, but playback depends on the availability and bandwidth of that external host. If loading fails, the black terminal layout remains usable. Video cannot provide the previous real-time camera parallax; its detailed motion matches the supplied reference directly.

Validation: node syntax check, Flask template assertions for the new wording/video, and git diff --check passed. Browser inspection at 1440x900 confirmed the new title, readable desktop layout, no horizontal overflow, and successful video decoding/playback (readyState 4 and advancing currentTime). Play and keyboard Pause were checked. No mobile redesign or performance benchmark was performed.

Git: changes remain local and uncommitted; existing modified/untracked files were preserved. No remote actions.

## 2026-09-22 - Desktop Three.js terminal motion

### What changed and why

Added a cyan wireframe tunnel and sparse data points behind the portfolio. Slow depth movement and pointer parallax make the desktop feel active while keeping the black background, terminal typography, and content hierarchy. A keyboard-accessible Motion button pauses or resumes the scene. Reduced-motion users receive a static scene by default and can explicitly start it.

### Architecture and trade-offs

The shared Jinja shell owns an aria-hidden, non-interactive canvas and the motion control. `static/js/scene.js` owns Three.js initialization, geometry, frame timing, pointer response, visibility, and resource cleanup. CSS controls stacking and visual intensity. Flask routes and content remain unchanged.

Data flow: shared template -> scene module -> pinned Three.js 0.186.0 CDN import -> desktop canvas. Pointer input affects camera position only; the existing terminal command router remains independent.

The official Three.js installation guide supports CDN modules (https://threejs.org/manual/pages/installation.html). This preserves the existing no-build Flask structure, with the trade-off that the effect needs CDN access and WebGL. Import or renderer failures hide the canvas and leave the portfolio usable. A local bundled dependency would remove runtime CDN dependence but add dependency maintenance/build work.

The effect initializes at desktop widths of at least 1000px, caps pixel ratio at 1.5, uses 150 points and shared line geometry, and pauses in hidden tabs. Page navigation disposes GPU resources; back-forward cached pages pause and resume. Animation timing uses requestAnimationFrame timestamps. No mobile design changes were made.

### Verification performed

- JavaScript syntax checks passed for scene.js and terminal.js; Flask test-client checks returned 200 for all five pages and the scene module. git diff --check passed.
- Inspected Home and Projects at 1440x900. Text remained readable and neither page had horizontal overflow. The scene successfully loaded from the CDN and rendered in WebGL.
- Confirmed the browser's reduced-motion default creates a static scene. Clicking Play changed the scene to running, and pressing Enter on Pause restored the static state.
- Typing /project and pressing Enter navigated to Projects. Checked the project disclosure using pointer and keyboard.
- Initial inspection found a deprecated THREE.Clock warning; replaced Clock with requestAnimationFrame timestamps. No additional warnings or errors appeared after the change; the console retained the historical warning.
- No mobile visual pass or hardware/GPU performance benchmark was performed. Desktop motion was visually inspected, not quantitatively profiled.

### Git state

Changes remain local and uncommitted. The existing modified README and untracked application/report files were preserved. No push or remote action was performed.

## 2026-09-22 - Cascadia terminal typography refinement

### What changed

- Scoped the non-home pages to `Cascadia Mono`, with `Cascadia Code`, SF Mono, Menlo, and Consolas fallbacks. The home page keeps its existing Consolas-first treatment.
- Reduced interior page commands such as `Selected projects` from a 48px maximum to 40px and reduced project titles to a 24px maximum.
- Removed the narrow reading-width caps from page introductions and project summaries. At desktop widths, those short strings now remain on one line.
- Added a terminal-output entrance sequence for breadcrumb, command heading, description, and content rows. Added a blinking underscore cursor to interior page commands and subtle row feedback on hover.

### Architecture and trade-offs

The change is CSS-only. Cascadia Mono is already installed on the current Windows system, so the page uses a local font stack instead of adding a font download, repository asset, or third-party request. Visitors without Cascadia receive a standard platform monospace fallback.

Animations use only opacity and transform, communicate output order, and remain under one half-second per element. The existing reduced-motion media query collapses the sequence for users who request less motion. Desktop one-line rules are limited to viewports wider than 1100px so narrower layouts may wrap rather than overflow.

### Verification performed

- Browser inspection at 1440x900 confirmed all four interior page headings render at 40px on one line with the Cascadia Mono stack.
- Projects page inspection confirmed the introduction and all three project summaries render on one line.
- Experience, About, and Contact introductions each render on one line without horizontal overflow.
- The connected browser reports that Cascadia Mono is available. It also advertises `prefers-reduced-motion: reduce`, so the staggered row animation correctly resolved to its static fallback during inspection; the 440-480ms no-preference rules were verified in the stylesheet. The home page still reports the original Consolas-first stack.
- No browser console warnings or errors were observed. No new mobile visual pass was performed for this desktop-focused refinement.

### Git state

The repository still contains the pre-existing modified README and untracked application files. No commit, push, or remote action was performed.

## 2026-09-22 - Multi-page terminal portfolio

### What changed

- Reworked the home page into a functional terminal-style launcher on a true black background while preserving the existing identity, focus, status, and resume access.
- Split the portfolio into `/projects`, `/experience`, `/about`, and `/contact` pages. The singular `/project` URL redirects to `/projects`.
- Added a safe client-side command router. Typing `/project` or `/projects` opens the Projects page; `/help` lists the available commands and invalid commands return inline feedback.
- Kept conventional links beside the command interface so every destination remains discoverable with pointer, keyboard, or JavaScript disabled.
- Changed all interior pages to the same Consolas-first monospace stack as the terminal home page. Reduced desktop body copy to 16px, page headings to a 48px maximum, and supporting headings to 21-26px.

### Architecture and data flow

Flask continues to own the portfolio content. Each route renders one focused Jinja template through a shared `base.html` shell. `PROJECTS` and `EXPERIENCE` remain the single data sources in `app.py`.

`GET /` -> terminal launcher -> typed command or direct link -> Flask content route -> shared Jinja shell

The browser command parser uses an explicit alias map and route URLs rendered by Flask. It never evaluates user input or sends commands to the server. The CSS remains dependency-free and uses a single black, off-white, gray, and cyan token system across every route.

### Decisions, alternatives, and trade-offs

- Multiple Flask routes were chosen over hash sections because the user requested separate pages and direct terminal navigation. A client-side framework was not needed for five static routes.
- The user explicitly requested deep black, so `#000` is used as the page foundation. Low-opacity scanlines provide terminal texture without changing the theme or reducing contrast.
- The home page uses the existing local name artwork as its visual anchor. No new portfolio claims or stock visuals were introduced.
- Entry and cursor motion communicate page hierarchy and input state. `prefers-reduced-motion` reduces those effects.
- Mobile keeps a single-column layout. An initial `autofocus` implementation was removed after browser inspection showed that it scrolled mobile visitors past the identity panel on load.

### Verification performed

- Python compilation passed.
- Flask test-client checks returned 200 for all five pages and all referenced local assets. `/project` returned a redirect to `/projects`.
- `node --check static/js/terminal.js` passed.
- Browser inspection at 1440x900 confirmed a true black computed background, a single-line desktop navigation, no horizontal overflow, a full-height home composition, and no console warnings or errors.
- Browser inspection at 390x844 confirmed a fresh page opens at scroll position zero and has no horizontal overflow. No further mobile styling was performed after the user narrowed the typography follow-up to desktop.
- Typing `/project` and pressing Enter navigated to `/projects`. `/help` returned the command list, and a project disclosure opened with the Enter key.
- Desktop checks for Projects, Experience, About, and Contact confirmed the shared monospace font, 16px body type, 48px page headings, and no horizontal overflow.

### Git state and remaining uncertainty

The repository still contains the pre-existing modified README and untracked application files present before this change. No commit, push, or remote action was performed. Reduced-motion behavior is implemented in CSS but was not inspected with OS-level motion emulation.

## 2026-09-18 — Simple portfolio page

### What changed

- Expanded the initial page into a responsive single-page portfolio with identity, technical focus, about, and contact sections.
- Kept `PROJECTS` as an empty, documented data template. The Work navigation and project grid render automatically after the first project is added.
- Added a public GitHub contact link without inventing an email address or LinkedIn profile.
- Extended the dark terminal-inspired visual system with responsive grids, accessible focus states, purposeful motion, and reduced-motion behavior.

### Architecture and data flow

The home route renders one Jinja template. Optional project content lives in the `PROJECTS` tuple in `app.py`; Jinja conditionals hide the complete project interface while that tuple is empty.

`GET /` → Flask route → `PROJECTS` context → conditional Jinja sections → responsive CSS

This keeps content editing in Python data while preserving semantic HTML and avoiding client-side JavaScript for a static portfolio.

### Decisions and trade-offs

- The page leads with a backend/infrastructure direction and keeps the first version concise.
- Projects remain absent from the rendered page until verified entries are ready. The template, responsive layout, and supported accent choices remain available for later use.
- GitHub is the only contact destination because it was verified against the authenticated public profile. Other contact methods can be added after confirmation.
- Plain Jinja and CSS keep the application dependency-light. More complex component or content systems are deferred until repetition creates a real need.

### Verification

- Flask render and asset smoke checks pass for the empty-project state.
- The project template was rendered separately with a sample entry to confirm that Work navigation and project markup appear when data exists.
- Python bytecode compilation and `pip check` pass.
- A live Flask request returns HTTP 200.
- `git diff --check` passes.
- Visual checks at `1440x900` and `390x844` could not be completed because no controllable browser is connected in the current runtime. No visual, pointer, or keyboard claim is recorded.

### Remaining work and uncertainty

- Add verified projects to `PROJECTS` when ready.
- Add confirmed email, LinkedIn, or resume destinations if desired.
- Repeat desktop and mobile rendered checks when a browser connection is available.

## 2026-09-18 — Flask portfolio skeleton

### What changed

- Added a Flask application with one `GET /` route and one Jinja template.
- Added a small responsive stylesheet following the project UI/UX skill.
- Added a pinned Flask dependency and local-development ignore rules.
- Added setup and run instructions to the project README.

### Architecture and data flow

`app.py` exposes `create_app()` so the Flask instance can be created independently for tests or a future WSGI server. The current request flow is intentionally small:

`GET /` → Flask route → `templates/index.html` → `static/css/styles.css`

There is no database, client-side JavaScript, API, form handling, or personal portfolio data yet.

### Decisions and trade-offs

- A one-file application keeps the first step easy to understand. Blueprints and a package hierarchy can be introduced after the site has multiple routes or domains.
- Jinja and plain CSS avoid a frontend build dependency. This limits component reuse for now, but matches the size of the current application.
- The page uses explicit replacement text rather than invented biographical claims.
- The visual layer establishes the selected dark grid and terminal direction without attempting a complete portfolio design.
- Flask is pinned to `3.1.3`, the current release observed through the package index on 2026-09-18, for repeatable setup.

### Alternatives considered

- A full application package with Blueprints was deferred because one route does not justify the extra structure.
- A frontend framework was deferred because the current page has no client-side state or interaction that requires one.
- A database was deferred because the initial content can remain in templates until a real persistence requirement appears.

### Verification

- Created a fresh `.venv` and installed `requirements.txt` successfully.
- Ran Python bytecode compilation for `app.py` successfully.
- Used Flask's test client to verify that `GET /` and `GET /static/css/styles.css` both return HTTP 200; the home response also contains the expected placeholder heading.
- Started the Flask development server and verified that a live request to `http://127.0.0.1:5000/` returns HTTP 200 with an HTML content type.
- Ran `git diff --check` successfully.
- The required rendered checks at `1440x900` and `390x844` could not be completed. The available browser runtime references a missing older plugin module, so no visual or pointer/keyboard claim is recorded.

### Remaining work and uncertainty

- Add verified project content when it is ready.
- Reassess the application structure when additional routes, forms, or persisted content are introduced.
- Repeat the desktop and mobile rendered checks after the browser runtime is repaired.

## 2026-09-22 — Reference-led terminal redesign

### What changed and why

- Replaced the grid background and large editorial headline with the first supplied reference's black terminal canvas, split welcome frame, thin rules, introduction block, status row, and command prompt.
- Added an original local SVG name graphic with orange pixel lettering and offset outlines inspired by the second reference. This approximates its lettering rather than claiming to identify the exact font. A semantic text heading remains available to assistive technology.
- Added three selected projects, four experience entries, education, grouped skills, verified resume contact URLs, and a download of the supplied resume. All professional claims and metrics come from ThinhNguyenResume2027.pdf; they have not been independently audited. No project-specific repository URLs were supplied, so the page links to the verified GitHub profile instead of guessing.
- Added native expandable project notes and an optional navigation command input. Conventional anchor navigation remains available without JavaScript.

### Architecture, data flow, alternatives, and trade-offs

Flask remains the server and Jinja renders PROJECTS and EXPERIENCE from app.py. Local CSS supplies responsive styling, and the local SVG avoids external font requests. The resume is served as a static PDF. A small JavaScript file maps an explicit allowlist of commands to section anchors and moves focus to the target; it never evaluates commands or submits them to the server.

GET / -> Flask data -> Jinja semantic HTML -> CSS/SVG presentation -> optional client-side anchor navigation.

A framework migration was unnecessary. Using a screenshot for the name would blur when scaled, while an unidentified external display font would not reliably match the reference. SVG is crisp and dependency-free, but the hand-built letterforms are an interpretation. Project notes use native details/summary to keep the page concise without hiding access behind custom controls. The mobile layout is longer because the two desktop panels stack vertically.

### Verification performed

- Python compileall succeeded; Flask test-client requests returned 200 for the page, stylesheet, JavaScript, SVG, and resume PDF.
- Browser inspection at 1440x900 and 390x844 found no horizontal overflow; name and welcome panels were visually inspected at both sizes.
- Pointer navigation to Projects and keyboard navigation back to the hero worked. A representative project expanded by click and collapsed with Enter.
- The help command returned the available commands. Browser console contained no warning/error entries during the check.
- Reduced-motion behavior is implemented in CSS; OS-level emulation was not performed.
- git diff --check passed for tracked changes. Existing files for the application were already untracked at the start, so that Git check does not cover all new files.

### Git state and remaining limits

The workspace already contained a modified README and untracked Flask application, assets, report, ignore file, requirements, and UI/UX skill. Existing unrelated changes were preserved. No commit or push was made. Project-specific repository/demo URLs can be added once provided. The site is local only; no deployment was performed.

User follow-up: desktop is the priority; no further mobile work was requested or performed after that clarification.

## 2026-09-22 — Larger text and neutral name color

- Increased desktop body text from 14px to 18px, supporting copy from 12–13px to 16–18px, metadata from 10–11px to 14–15px, and section/project headings proportionally. This improves readability while preserving the terminal hierarchy.
- Changed the name SVG from orange to the existing off-white text color (#e3e1da), with muted gray outlines. Kept its dimensions and pixel letterforms unchanged.
- Kept Flask/Jinja and the existing data flow unchanged; edited CSS and the local SVG only. Widened the experience date column to accommodate larger metadata. Larger text uses more vertical space, an intentional trade-off for readability.
- Verified the rendered desktop at 1440x900: screenshot reviewed, body and project copy computed at 18px, project details at 18px, no horizontal overflow, Projects navigation worked, and no console errors were returned. No mobile checks were performed in this turn, per user preference.
- Git state remains the pre-existing modified README plus untracked application files. No commit or push was made.

## 2026-09-22 — Textured terminal background and cyan accents

- Added stationary 1px scanlines at 7px spacing over a dark blue-black background, with a faint cool light wash in the upper-right area. The texture follows the supplied reference while keeping text readable.
- Replaced every orange accent with muted cyan (#8ccfd2), including navigation, links, cursor, selection, command feedback, and keyboard focus. Renamed the CSS token to --accent and coordinated muted text and borders with the cooler palette. Kept the off-white name and existing type sizes.
- Pure CSS gradients avoid image downloads, new dependencies, and moving background effects. This preserves the Flask/Jinja data flow. Subtle texture was chosen over a detailed image to preserve reading contrast.
- Reloaded the live site and visually inspected the desktop at 1440x900. Confirmed the new computed background and accent, no horizontal overflow, and no browser console errors. No mobile work was performed.
- Existing unrelated changes remain untouched; no commit or push. Only styles.css and this report changed in this turn.
