# Implementation Report

## 2026-09-24 — Give terminal replies more room

### What changed and why

- Let project and experience bullet lists use the full transcript width instead of capping them at `82ch`.
- Reduced the horizontal gutter and the gaps between conversation entries, project/experience items, roles, and bullets so the terminal shows more of each reply at once.

### Architecture and trade-offs

The width and spacing changes live in the homepage-only stylesheet. The regular Projects page keeps its existing reading-width limit. The denser terminal still separates experience roles with a subtle rule.

### Verification performed

- The local in-app preview rendered `/experience` and `/projects` at 390x844 and 1440x900; desktop experience bullets measured 844px wide, and the document stayed 1440px wide.
- At 390x844, the terminal session measured 368px and experience and project bullets measured 316px; the document stayed 390px wide with no horizontal overflow.
- `/` and `/projects` returned HTTP 200. The homepage used stylesheet version `full-width-terminal-1`, and the served CSS included the full-width rule and 12px article spacing.
- `git diff --check` passed for the touched paths; Git emitted only its LF-to-CRLF normalization warnings.

### Git state

This UI change remains local alongside the existing uncommitted worktree edits. No commit, push, or deployment was made.

## 2026-09-23 — Make the Gmail link orange

### What changed and why

- Changed the shared Gmail color token to orange in both themes: `#FFB347` in dark mode and `#9A4C00` in light mode. The stronger light-theme shade keeps the link readable on the warm background.
- Bumped the shared stylesheet URL version so browsers fetch the updated color.

### Architecture and trade-offs

Both the `/contact` page and the homepage terminal contact reply use the same `--contact-email` token. Keeping that semantic token preserves one source of truth, while separate shades maintain contrast against each theme's surface.

### Verification performed

- Confirmed both Gmail links use the shared `contact-email` class and CSS token.
- Calculated WCAG contrast across the contact page and terminal surfaces: at least `9.89:1` in dark mode and `5.27:1` in light mode.
- Flask test-client requests returned HTTP 200 for `/`, `/contact`, and the versioned stylesheet; the rendered templates and both orange tokens were present. `git diff --check` passed for the touched paths.

### Git state

The orange color token, stylesheet cache version, and this report entry are in a focused local commit. Existing unrelated changes were not included; no push or deployment was made.

## 2026-09-23 — Publish terminal updates to GitHub and Vercel

Pushed commit `71453a9` to `origin/main` (`mthinhngn/ultra-maxing-portfolio`) and deployed it to the linked Vercel production project at `https://ultra-maxing-portfolio.vercel.app`. The commit contains the terminal and theme changes, including both theme animation videos. Removed `README.md` from GitHub while preserving the local copy; `.gitignore` prevents it from being staged again, and `.vercelignore` excludes it from direct deployments.

### Verification

- Before publishing, the Flask test client returned 200 for six pages and the relevant CSS, JavaScript, SVG, and WebM assets. JavaScript syntax checks and `git diff --check` passed.
- GitHub's current recursive tree identifies commit `71453a9`, includes both theme videos, and has no `README.md`.
- Vercel reported production deployment `dpl_CySA2tJd1o3njjdyUZJpoKDihMzh` as READY and aliased the existing production domain. Live HTTP returned 200 for `/`, `/projects`, `/experience`, `/about`, `/contact`, `/resume`, the theme script, both videos, and the welcome SVG. The live script includes the reduced-motion playback rate.

### Git state

`main` matches `origin/main` at `71453a9`. Local `IMPLEMENTATION.md`, skill edits, and local tool/workshop folders remain uncommitted and were excluded from the deployment. The local `README.md` remains present and ignored.

## 2026-09-23 — Make the day/night animation visible in the terminal

The terminal title bar now shows a 24px sun or moon instead of a tiny pill switch. User-triggered video playback runs in both theme directions; when reduced motion is enabled, the same clip finishes in half the time. The dark theme inverts the video colors so the supplied dark artwork remains visible on the dark title bar. The clip still stops at its final frame and returns to the static icon. Interior pages retain their existing switch layout.

Why: the previous preview had reduced motion enabled and skipped the clip entirely; the small black icon also blended into the dark bar. The animation now gives a visible response to the explicit click while keeping a shorter reduced-motion path.

### Verification

- Local browser with `prefers-reduced-motion: reduce`: clicking in each direction loaded the corresponding WebM, played at 2× speed, reached the end, and returned to the static icon. The selected theme and accessible switch state updated in both directions; no browser errors appeared.
- The theme button remains beside maximize/restore in the terminal header. The existing 1440×900 and 390×844 layout checks showed no horizontal overflow; the follow-up dark-video color adjustment was visually confirmed in the live preview.
- `node --check public/static/js/theme.js` and `git diff --check` passed.

### Git state

Changes remain uncommitted with the pre-existing worktree edits. No push or deployment was made.

## 2026-09-23 — Reverse the night animation for the theme switch

Converted the supplied `Night Mode.mp4` into two small transparent WebM clips: day to night and the frame-reversed night to day. The shared theme switch plays the appropriate clip when activated, then returns to its existing static icon. The terminal header keeps the switch next to maximize/restore; other pages use the same shared control. The source video's visible IconScout watermark remains in both clips.

The selected theme, `aria-checked` state, favicon, and local storage update immediately. Playback is optional feedback: it stops on completion or error, restarts in the opposite direction after a rapid second click, and is skipped when `prefers-reduced-motion` is enabled. Versioned CSS/JS URLs refresh previously cached browser assets. The video files are self-hosted, so no runtime animation library or external media request is needed. Source: [Night Mode Animation on IconScout](https://iconscout.com/lottie-animation/night-mode-animation_5604995).

### Verification

- Inspected the supplied MP4: 2 seconds, 1500×844, 30 fps, sun at the start and moon at the end. Inspected the reversed clip: moon at the start, sun at the end.
- Both clips returned HTTP 200 as `video/webm`; `node --check public/static/js/theme.js` and `git diff --check` passed.
- In the local browser, pointer clicks switched light to dark and back, and Enter switched to dark. The switch's accessible checked state matched the selected theme; no browser errors were reported.
- At 1440×900 and 390×844, the switch remained beside maximize/restore and the page had no horizontal overflow.
- The local preview reports `prefers-reduced-motion: reduce`, so video playback was intentionally skipped there. Playback under normal motion was not visually verified in that browser.

### Git state

The code, report, and generated video assets remain uncommitted alongside pre-existing worktree changes. No commit, push, or deployment was made.

## 2026-09-23 — Compact the background motion control

Changed the homepage motion control to a subtle glass media button at the lower-right viewport edge. Its visible frosted circle is about 18px, while a 28px button target remains easy to reach. The circle blends with the page using translucent theme colors, blur, and reduced idle opacity; hover and keyboard focus reveal it clearly. It shows a Play triangle when motion is paused and Pause bars while motion is running. Maximizing the terminal hides the control.

Why: make the motion action recognizable on hover while letting the small translucent control recede into the lower-right corner until it is needed.

Architecture and trade-offs: `scene.js` still owns playback state and synchronizes the accessible label and icon. `terminal.js` exposes maximize state on `body`, which the homepage stylesheet uses to hide only the motion control. The shared control keeps its original text presentation on other pages.

### Verification

- In the local browser preview at 1440×900, confirmed the 28×28 px button target sits 8px from the lower-right edges, with an 18px frosted-glass circle, an 11px media icon, and 48% idle opacity. Hover and keyboard focus reveal it.
- Clicking the control pauses the video and switches to the Play triangle and accessible label; keyboard Enter restarts motion and shows the focus outline.
- Maximizing the terminal hides the motion control while focus remains on the restore control; restoring brings the motion control back. At 390×844, the desktop-only motion control remains hidden and the page has no horizontal or vertical overflow.
- Checked an interior page: its original text label remains visible and the icon SVGs remain hidden. `node --check public/static/js/scene.js`, `node --check public/static/js/terminal.js`, and `git diff --check` passed.

### Git state

These files remain uncommitted alongside pre-existing worktree changes. No commit, push, or deployment was made.

## 2026-09-23 — Remove title-bar caption

Removed the “portfolio session” caption from the terminal title bar and deleted its now-unused desktop and mobile styles. The terminal identity and icon-only size control remain unchanged.

Why: simplify the header to the user-requested icon and portfolio identity.

Old look: portfolio identity on the left, caption and expand control on the right. New look: portfolio identity on the left, expand control alone on the right.

### Verification

- Fresh local Flask preview rendered the title bar with the portfolio tab and size icon only; the caption is absent from the accessibility tree.
- `git diff --check` passed.

### Git state

The template, stylesheet, and this report remain uncommitted with existing worktree changes. No commit, push, or deployment was made.

## 2026-09-23 — Make terminal size control icon-only

Replaced the boxed maximize control with an inline SVG of outward-facing corner marks; when maximized, it switches to inward-facing corners for restoring the smaller window. Removed the button's visible border and hover fill while keeping its accessible name, keyboard focus outline, and existing maximize/restore behavior.

Why: match the supplied expand/shrink icon references and keep the title bar control visually limited to the icon.

Old look: a small expand mark inside a bordered square, with a mismatched restore mark. New look: unboxed outward corners to expand and inward corners to restore, using the terminal's theme color.

### Verification

- Reviewed the icon-only control in dark and light themes in the local preview; verified it toggles between “Maximize terminal” and “Restore terminal size” and returns to the original size.
- `node --check public/static/js/terminal.js` and `git diff --check` passed.

### Git state

The template, stylesheet, and this report remain uncommitted with existing worktree changes. No commit, push, or deployment was made.

## 2026-09-23 — Make the terminal scrollbar ultra thin and edge-aligned

Set the conversation scrollbar to a 2px rounded thumb with a transparent track in WebKit browsers, hide its top and bottom buttons, and move it to 4px from the terminal frame. Extend the scroll region through the session's right inset while adding equivalent inner padding, preserving the text's previous line width. The mobile inset uses matching offsets; other browsers retain a thin native scrollbar fallback.

Why: remove the empty strip beside the scrollbar without pushing conversation text against the terminal edge.

Old look: scrollbar inset by the session padding, leaving a wide empty gutter at the right. New look: the same thin scrollbar sits near the frame edge while transcript text keeps its existing clearance.

### Verification

- Loaded overflowing project content and verified the 2px scrollbar sits close to the frame with no end arrows in dark and light themes in the local preview.
- Confirmed the obsolete hover class and 42px expansion rules are gone. `node --check public/static/js/terminal.js` and `git diff --check` passed.

### Git state

The CSS, JavaScript, and this report remain uncommitted with existing worktree changes. No commit, push, or deployment was made.

## 2026-09-23 — Keep visitor-entered commands neutral

Changed echoed visitor commands to use the theme's main text color: cool white in dark mode and charcoal in light mode. The muted brass visitor accent remains on the command-row edge, and the active input stays neutral.

Why: entered commands should stay crisp and readable without competing with the varied project, contact, and skills accents.

Old look: echoed commands used the brass visitor accent. New look: command text follows the foreground; only its slim edge marker keeps the visitor accent.

### Verification

- Reviewed a submitted command in the local preview in both themes; the command text used the foreground color and the edge marker retained its accent.
- `git diff --check` passed.

### Git state

The stylesheet and this report remain uncommitted alongside existing worktree changes. No commit, push, or deployment was made.

## 2026-09-23 — Compose distinct calm and deep theme palettes

Changed the terminal and shared site colors to use two separate, role-based palettes. Dark mode now has deep navy graphite surfaces and strong jewel accents; light mode uses warm ivory neutrals and calm, dusty pastel inks. Topic headings and selection use the primary accent; project names, skill groups, and all four contact links each have their own accent. The animated “Generating...” shimmer remains.

Why: the previous look repeated one blue/cyan across almost everything, removing the distinctions that make the terminal feel colorful and alive.

Old look: one blue accent throughout light mode and one cyan throughout dark mode; project, skill, and contact colors blended together, and loading shimmer had been flattened to a pulse.

New look: theme-matched color roles with readable separation. The light palette stays soft and neutral; the dark palette has deeper surfaces and stronger jewel tones.

Light palette — primary `#355d97`; visitor `#756953`; projects Porta `#81643f`, PreParty `#8b5968`, Adversarial `#665f80`; skills languages `#756031`, frameworks `#416e61`, databases `#97574c`, infrastructure `#685f7c`; contact Gmail `#376d67`, GitHub `#665f80`, LinkedIn `#41694f`, resume `#895564`.

Dark palette — primary `#71d5e2`; visitor `#d6b46f`; projects Porta `#e3a665`, PreParty `#e7879c`, Adversarial `#b69be8`; skills languages `#ddc271`, frameworks `#72cbaa`, databases `#e98e72`, infrastructure `#bb9fe8`; contact Gmail `#61c8b8`, GitHub `#b69be8`, LinkedIn `#8bc99e`, resume `#e7879c`.

### Verification

- Measured every text accent against its terminal surface: all light and dark palette roles meet at least 4.5:1 contrast; the lowest is 4.60:1 for the light-theme visitor label.
- Reviewed the rendered contact, project, and skills sections in both themes. Light mode reads as calm, muted pastels; dark mode has deep graphite surfaces and stronger jewel accents. JavaScript and Python behavior were not changed in this palette update.

### Git state

The CSS, project guidance, and this report remain uncommitted alongside pre-existing worktree changes. No commit, push, or deployment was made.

## 2026-09-23 — Consolidate the palette across light and dark themes

This first single-accent palette pass is superseded by the 2026-09-23 palette refresh above. It remains in the change history as the prior visual direction that was replaced at the user's request.

### What changed and why

- Audited the homepage and shared contact/resume tokens and reduced the visual system to one theme primary plus neutral text/surfaces and one muted error color.
- Removed orange, pink, purple, green, and brown content accents from project titles, skill groups, contact links, and selection states. These elements now use the same theme-aware primary blue/cyan so color communicates hierarchy instead of category noise.
- Kept the visitor command text neutral, preserving the input surface and prompt structure without reintroducing the previous orange accent.
- Replaced the loading text gradient with a solid primary-color opacity pulse, preserving the requested animation without gradient-text color drift.

### Architecture and trade-offs

- Existing semantic tokens remain in place for compatibility, but project, skill, and contact aliases now resolve to the shared primary token. Error text remains distinct so failure feedback is still recognizable.
- The neutral SVG identity artwork and the site’s ambient background treatment were left intact; they are structural brand surfaces rather than interactive content accents.

### Verification performed

- Impeccable detector was run against the changed HTML/CSS and previously identified the old gradient-text rule; the gradient was removed from the loading label.
- Verified the rendered homepage in both themes in an isolated browser tab: light mode uses the single blue primary and dark mode uses the single softened cyan primary; project/skill/contact accents no longer introduce orange, pink, purple, or green.
- Confirmed the loading treatment remains animated while using solid primary color rather than a gradient. Restored the original light-theme preference after testing and closed the isolated tab.
- `node --check public/static/js/terminal.js`, `python -m compileall -q app.py`, and `git diff --check` passed. The Impeccable detector now reports only the pre-existing structural side-tab border warning in `styles.css`; no gradient-text warning remains.

### Git state

The stylesheets and this report remain uncommitted alongside pre-existing worktree changes. No commit, push, or deployment was made.

## 2026-09-23 — Make command highlight follow pointer movement

### What changed and why

- Pointer movement over a command suggestion now updates the same active row used by Up/Down, so the accent and left indicator follow the pointer and only one suggestion is highlighted at a time.
- Removed the independent CSS hover highlight that could leave the keyboard-selected row blue while also highlighting the hovered row.
- Pointer selection does not auto-scroll the list; keyboard selection still scrolls the active row into view, preventing the menu from shifting underneath the pointer.

### Architecture and trade-offs

- Kept one `aria-selected` state as the source of truth for both pointer and keyboard selection. Explicit selection by either input method submits that suggestion with Enter; clicks continue to submit the clicked row directly. Touch behavior is unchanged.

### Verification performed

- In the isolated local preview, a live pointer move selected `/projects` without scrolling the menu, and exactly one option remained selected. ArrowDown selected `/experience`; its background stayed transparent while text and left indicator used the blue accent.
- Checked contact colors in light and dark modes: headings used the topic blue (`rgb(38, 77, 166)`) and dark theme accent (`rgb(67, 220, 232)`); Gmail used distinct teal (`rgb(0, 119, 102)` and `rgb(52, 194, 176)`) rather than the input colors.
- Checked the `/projects` marker against Porta's title in both themes; each pair matched (`rgb(139, 99, 44)` light, `rgb(255, 137, 63)` dark). No browser console errors. `node --check public/static/js/terminal.js` and `git diff --check` passed.

### Git state

The JavaScript, stylesheet, and this report remain uncommitted alongside pre-existing worktree changes. No commit, push, or deployment was made.

## 2026-09-23 — Match contact and project accents to topic hierarchy

### What changed and why

- Contact headings now use the same blue reply-heading accent as “Available commands” in light mode (and the corresponding theme accent in dark mode).
- Gmail uses a dedicated teal accent in both themes, distinct from the heading, the input’s brown, and the social-link colors.
- The `/projects` reply bullet now matches Porta, the first project. An individual project reply uses that project's own heading color for its bullet.

### Architecture and trade-offs

- Reused `--terminal-reply` for headings and each existing `--terminal-project-*` color for project bullets. Updated the existing global `--contact-email` token with theme-specific teal values so terminal and regular contact links stay consistent.

### Verification performed

- In the local preview, checked both themes: the contact heading matched the “Available commands” accent while Gmail had its separate teal, different from the input accent. The `/projects` marker matched Porta's heading color in light and dark modes. No browser console errors; `git diff --check` passed.

### Git state

The JavaScript, stylesheets, and this report remain uncommitted alongside pre-existing worktree changes. No commit, push, or deployment was made.

## 2026-09-23 — Align completion metadata and refine suggestion selection

### What changed and why

- Indented the failed-command completion line by 18px so its first character lines up with the reply text after the bullet.
- Added the local completion time to “Generated for … · done”, using the visitor’s locale for a concise hour-and-minute timestamp.
- Removed the filled selection background from command suggestions. The selected/hovered row is indicated by the theme accent on its text and left edge (blue in light mode), preserving a clear cue without painting the whole row.

### Architecture and trade-offs

- Reused the existing reply grid spacing and theme token; no new layout or color tokens were needed. Completion time is generated alongside the existing elapsed duration, and selection continues to use the existing `aria-selected` state and keyboard navigation.

### Verification performed

- Submitted `halp` in the browser: the completion line included a local time (`Generated for 1.4s · done 2:43 PM`) and its left edge exactly matched the reply text at desktop and mobile sizes.
- Used ArrowDown to select a suggestion at 1440×900 and 390×844. The selected row had a transparent background, blue theme-accent text, and blue left indicator; neither viewport had horizontal overflow.
- No browser console errors were reported. `node --check public/static/js/terminal.js` and `git diff --check` passed.

### Git state

The JavaScript, stylesheet, and this report remain uncommitted alongside pre-existing worktree changes. No commit, push, or deployment was made.

## 2026-09-23 — Simplify failed-command completion status

### What changed and why

- Removed the decorative sparkle SVG from the “Generated for … · done” line shown after an unrecognized command.
- Reduced that completion metadata from 0.88× to 0.75× the answer text size so it reads as secondary information. Normal answers and the animated “Generating...” state keep their existing presentation.

### Architecture and trade-offs

- Kept status creation in the existing unknown-command completion callback and rendered it as plain text, avoiding extra markup for a decorative icon. The smaller style applies only to this completion line, which is only appended for failed command resolution.

### Verification performed

- Submitted `hello` in the local browser: the not-found reply appeared and its completion line was plain text with no icon (`11.25px` versus `15px` for the answer at 1440×900).
- At 390×844, the completion line remained smaller (`9.75px` versus `13px`) and the page had no horizontal overflow. A successful `/help` response remained 15px and had no completion metadata.
- No browser console errors were reported. `node --check public/static/js/terminal.js` and `git diff --check` passed.

### Git state

The JavaScript, stylesheet, and this report remain uncommitted alongside pre-existing worktree changes. No commit, push, or deployment was made.

## 2026-09-23 — Tighten command suggestion row spacing

### What changed and why

- Tightened the desktop command board rows from 30px to 26px and reduced row/menu vertical padding. The board now caps at 109px, showing four complete suggestions in a shorter block that covers less conversation content.
- Kept mobile rows at 44px so each suggestion remains comfortable to tap.

### Architecture and trade-offs

- This is a CSS-only adjustment to the existing listbox. Keyboard navigation, selected-row styling, hidden scrollbars, and the mobile touch target are unchanged.

### Verification performed

- At 1440×900, the 109px suggestion board shows four complete 26px rows; the selected-row styling remains visible.
- At 390×844, the board uses 44px touch rows within its 185px cap and shows four complete options, with no horizontal overflow.
- The mobile browser console had no errors. `git diff --check` completed successfully, and the local page returned HTTP 200.

### Git state

The stylesheet and this report remain uncommitted alongside pre-existing worktree changes. No commit, push, or deployment was made.

## 2026-09-23 — Fix contact heading color and compact the command picker

### What changed and why

- The contact heading now resolves to the warm visitor accent even when the browser serves the older cached template without `contact-heading`; the existing email link acts as a stable marker. This fixes the observed same-color heading and email.
- Reduced desktop suggestion rows from 36px to 30px and the picker cap from 160px to 129px, keeping exactly four full options visible with less of the transcript covered. Reduced the prompt dock minimum height from 52px to 46px; its send button remains 44px tall. Mobile suggestion rows keep their 44px touch target, with a 185px picker cap for four full rows.

### Architecture and trade-offs

- Reuses the existing palette tokens and contact email marker instead of adding another color. The picker keeps its existing keyboard navigation and hidden-scrollbar behavior while taking less vertical space.

### Verification performed

- In the local browser, the contact heading rendered warm amber (`rgb(255, 179, 71)`) in dark mode and brown (`rgb(120, 94, 64)`) in light mode; the Gmail link remained cyan (`rgb(67, 220, 232)`) and blue (`rgb(38, 77, 166)`) respectively. The result also worked against the old cached markup that originally lacked `contact-heading`.
- At 1440×900, exactly four of six desktop options fit in the 129px picker; rows are 30px. The prompt is 46px high and its submit button remains 44px. At 390×844, exactly four mobile options fit in the 185px picker, touch rows are about 44px, and there is no horizontal overflow.
- No browser console errors were reported. `git diff --check` passed.

### Git state

The stylesheet and this report remain uncommitted alongside pre-existing worktree changes. The local Flask preview is running from the project virtual environment at `127.0.0.1:5059`. No commit, push, or deployment was made.

## 2026-09-23 — Distinct contact heading and email colors

### What changed and why

- The `/contact` reply heading “Get in touch” now uses the warm, theme-aware visitor accent. The Gmail address keeps its existing cyan/blue link color, so the heading and actionable email read as separate elements.
- GitHub, LinkedIn, and resume link colors are unchanged.

### Architecture and trade-offs

- The heading reuses the existing `--terminal-visitor` theme token rather than introducing another palette value. The email continues to use the existing `--contact-email` token, keeping light and dark theme colors consistent with their established roles.

### Verification performed

- `git diff --check` and source checks for the contact heading class and its theme token passed.
- Calculated foreground/background contrast from the existing palette tokens: heading 10.16:1 in dark mode and 5.17:1 in light mode; Gmail link 10.89:1 in dark mode and 6.66:1 in light mode.
- The existing local preview at `127.0.0.1:5059` served a cached Jinja template without the updated heading class. Restarting the running preview was blocked, and the available Python environment did not have Flask, so rendered browser color verification was not possible in this turn.

### Git state

The contact template, stylesheet, and this report remain uncommitted alongside pre-existing worktree changes. No commit, push, or deployment was made.

## 2026-09-23 — Require exact terminal input

### What changed and why

- Removed edit-distance typo correction and loose partial-text matching. Visitors must now enter an exact command name; the leading slash remains optional. Explicit exact aliases and exact project titles continue to work.
- Unknown words such as `experienc` and `hello` return the not-found response rather than a nearby command. Existing `Generating...` and measured `Generated for … · done` feedback is preserved, now with a small sparkle beside the completion line using the same accent as the Porta project title.

### Architecture and trade-offs

The resolver still normalizes case, spacing, punctuation, and an optional leading slash, then compares the full input against the command catalog. This keeps slashless commands convenient while avoiding ambiguous guesses. Exact catalog aliases and project-title lookup remain supported, but arbitrary sentences and partial project-title matches no longer resolve to portfolio content. The completion sparkle is an inline, decorative SVG marked `aria-hidden`, colored through the existing Porta accent token; the visible timing text remains the only status content announced to assistive technology.

### Verification performed

- `node --check public/static/js/terminal.js` and `git diff --check` passed.
- In a temporary browser tab, both `experience` and `/experience` opened the experience response. `experienc` and `hello` each produced the not-found reply followed by the existing measured completion line.
- Compared the icon against the rendered Porta title in both themes: both were `rgb(255, 137, 63)` in dark mode and `rgb(139, 99, 44)` in light mode. The 12×12 decorative icon stays separate from the muted status text and fits without horizontal overflow at the tested 1280×720 viewport.
- `/clear` reset the conversation between cases.

### Git state

The JavaScript and report remain uncommitted alongside pre-existing worktree changes. No commit, push, or deployment was made.

## 2026-09-23 — Wrong-input completion status and typo matching

### What changed and why

- Unknown terminal requests keep the animated “Generating...” state, then show the existing not-found guidance, followed by a muted `Generated for 1.4s · done` line. The duration is measured from submission through the end of the reply reveal, so it reflects the complete visible interaction.
- Tightened command typo matching from two edits to one. A near miss like `experienc` still finds `/experience`, while `hello` correctly remains unmatched instead of resolving to `/help`.

### Architecture and trade-offs

The command resolver still selects curated local replies; this is a presentation status, not a claim of live model generation. The reveal helper accepts an optional completion callback, used only by the unknown-command path. It runs after the word animation finishes and is guarded against duplicate completion. Measuring through the full reveal makes the displayed time match when the terminal considers its response done, at the cost of including animation time as well as the brief loading cue.

### Verification performed

- `node --check public/static/js/terminal.js` and `git diff --check` passed.
- In a temporary browser tab, submitted `hello`: “Generating...” appeared first, then the not-found guidance, then `Generated for 1.4s · done` beneath it.
- Submitted `experienc` and confirmed it resolved to the experience response with no unknown-command completion line.
- Checked the new status style in both themes: the 13.2px muted line has 8px top spacing and 18px left alignment; contrast measured 5.65:1 in light mode and 8.10:1 in dark mode.

### Git state

The JavaScript, stylesheet, and report remain uncommitted with pre-existing worktree changes. No commit, push, or deployment was made.

## 2026-09-23 — Animated terminal response status

### What changed

- Submitting a new terminal command now shows a 4×4 dotted activity mark beside a shimmering “Generating...” label for a brief 680 ms, then swaps in the existing local portfolio response and its word-by-word reveal.
- The pending request is marked busy and announced through the existing screen-reader status region. Sending another command completes the pending response first; `/clear` removes it cleanly.
- The user-requested animation intentionally overrides the site-wide reduced-motion animation reset, but only for this small loading cue. The dots pulse at 840 ms and the text shimmer runs at 1.2 seconds; the rest of the site's motion preferences are unchanged.

### Architecture and trade-offs

The current command resolver and Jinja templates remain the source of answers. The browser inserts a temporary status row, then replaces it with the already-supported local template response; no React code, dependency, remote API, or live AI generation was introduced. This is a short presentation cue before curated portfolio content, not a claim that a model is generating a live answer. CSS draws the reference's dotted mark and applies a theme-aware shimmer using the existing focus color.

### Verification performed

- `node --check public/static/js/terminal.js` and `git diff --check` passed. The local JavaScript and CSS assets returned HTTP 200.
- In the in-app browser, the system reduced-motion preference was enabled. Computed styles still reported the dot pulse at 0.84 s and text shimmer at 1.2 s, both infinitely. Over 260 ms, the shimmer position changed from 100% to about 39% and a dot's opacity changed from 0.24 to about 0.93, confirming the override animates rather than remaining static.
- Submitted `/contact` and confirmed its response replaced the pending state; issued `/clear` during a pending `/help` and confirmed the transcript emptied; submitted `/experience` at 390×844 and confirmed four response articles with no horizontal overflow. No browser console errors were reported.
- The tested browser requested reduced motion; the normal-motion path is defined in CSS but was not separately captured under a no-preference browser.

### Git state

The implementation and report remain uncommitted alongside pre-existing worktree changes. No push or Vercel deployment was made.

## 2026-09-23 — Match the dark-mode welcome cursor accent

Changed the dark-mode welcome underscore to use `--terminal-focus`, matching the cyan accent on the Enter prompt. The cursor still blinks, and the existing light-mode blue remains unchanged. This only updates a CSS color token; no markup or interaction changed. The change is in the local preview and has not been redeployed.

Git state: stylesheet and report remain uncommitted alongside existing worktree changes.

## 2026-09-23 — Vertically center the welcome content

Changed `.welcome-screen` to center its existing content stack vertically. WELCOME, “Portfolio session ready_”, and “Press Enter to continue” now sit together around the middle of the available height. Their scale, left alignment, spacing, order, and cursor animation stay the same. This is a one-property CSS layout adjustment; no template or interaction changes were needed.

The template continues to render the heading and action group in sequence. The flex container centers that complete stack within the terminal content area, so the position follows the available viewport height without fixed offsets. The local Flask preview was visually inspected after refreshing. The production deployment was not changed by this local layout edit.

Git state: stylesheet and report changes remain uncommitted with the existing worktree changes.

## 2026-09-23 — Production deployment to Vercel

### What changed and why

- Added a root `.vercelignore` to keep local agent skills, Codex settings, design notes, virtual environments, and implementation guidance out of future deployment uploads.
- Deployed the current portfolio to the Vercel production alias: `https://ultra-maxing-portfolio.vercel.app`.

### Architecture and trade-offs

The existing Vercel Flask preset builds the root `app.py` with Python 3.12 and `requirements.txt`; Flask serves the page routes while `public/static` provides CSS, JavaScript, images, and the resume PDF. No runtime or build configuration changes were needed. The first deploy ran before `.vercelignore` was correctly placed at the Git root and uploaded 93 source files. After correcting its location, the final production deployment uploaded 30 files. The earlier deployment is no longer aliased. Its direct checks for skill files, Codex hooks, the design plan, and this report all returned 404; the old deployment record remains in Vercel history.

### Data flow

Vercel installs the Flask dependency, builds the Python serverless function from `app.py`, and publishes files under `public/static` to the same static URLs used locally. The root ignore file trims development-only files from that upload.

### Verification performed

- Final deployment `dpl_4rtAhTPZD1RDsRyXbPGv4secmfBw` reached `READY` as Production and is aliased to the portfolio domain. Build output detected Python 3.12 and the Flask serverless function.
- Production GETs returned HTTP 200 for `/`, `/projects`, `/experience`, `/about`, `/contact`, `/resume`, the homepage and base CSS, terminal JavaScript, WELCOME SVG, and resume PDF. The homepage includes the ready cursor, the stylesheet includes its blink animation and updated spacing, and the resume begins with a valid `%PDF` signature.
- The earlier deployment returned 404 for the workspace-only file paths checked above. The Vercel error-log query returned no entries; drain and monitoring configuration was not verified.
- `git diff --check` passed. No Git commit or push was performed.

### Git state

`.vercelignore` and the current portfolio edits remain local and uncommitted alongside pre-existing worktree changes.

## 2026-09-23 — Welcome spacing and blinking ready cursor

Increased the gap beneath WELCOME from 8–12px to 24–36px. The ready line now reads “Portfolio session ready_”, with a blue underscore blinking once per second. The cursor has a theme-specific blue and is hidden from screen readers; opacity animation reserves its space and avoids text movement.

The Jinja template renders a decorative span, and the homepage stylesheet controls its color and blink. Per the user's explicit request, the cursor animation overrides the global reduced-motion reset for this element only. This preserves the requested animation even when the browser requests reduced motion; other motion rules are unchanged. No JavaScript or dependency changes were needed.

Verification: Flask test-client rendering passed using the existing requirements in a temporary uv environment. Restarted the cached local preview, then inspected the refreshed browser: computed gap 24px, blue rgb(38, 77, 166), one-second infinite animation, and sampled opacity values 1, 1, 1, 0, 0, 1 confirmed blinking. Visually checked spacing in the current preview. Full responsive and theme coverage was not repeated for this small adjustment.

Git state: template, stylesheet, and report changes remain uncommitted alongside the existing worktree changes. No push or deployment was performed.

## 2026-09-23 — Terminal `/help` directory and resume `/skills`

### What changed and why

- Added one server-side command catalog for the autocomplete menu and `/help` output. `/help` now lists `/help`, `/experience`, `/projects`, `/skills`, `/about`, `/contact`, and `/clear` with descriptions; supported aliases are shown alongside their primary commands.
- Kept `/help` and `/skills` in the autocomplete list and generated topic labels and aliases from the same menu data so submitted suggestions resolve to the matching response.
- Replaced the previous About-derived skills with the four exact Technical Skills groups from `D:\Thinh\ThinhNguyenResume2027.pdf`: Languages, Frameworks, Databases & Storage, and Infra & Tools. Each group has its own accessible accent in both themes.

### Architecture and trade-offs

Flask supplies the command catalog and resume skills to the existing Jinja homepage. The same command data renders the picker and help response; the terminal controller reads labels and aliases from picker attributes. This keeps the displayed help, autocomplete, and topic resolution aligned without adding routes, packages, or services. Skill groups remain normal text in the terminal, with category color limited to each heading and divider for readability.

### Verification performed

- Extracted the supplied resume PDF and confirmed all four Technical Skills categories and entries.
- Python AST parsing passed for `app.py`; `node --check` passed for `public/static/js/terminal.js`.
- Checked the four skill accent colors against the light and dark terminal surfaces; all measured contrast ratios exceed 4.5:1.
- `git diff --check` passed, with only line-ending normalization warnings.
- Flask/Jinja homepage rendering passed through the test client in a temporary `uv` environment using the repository's existing Flask version; no project dependency files changed. Verified HTTP 200, all seven described commands, six picker options including `/help` and `/skills`, command aliases, all four exact resume skill groups, and HTTP 200 for the homepage CSS/JS assets.
- The existing local page at `http://127.0.0.1:5059/` returned HTTP 200 but did not contain the new command markers, so that running preview is serving stale HTML; it was left running. No browser visual check was completed.

### Git state

Updated `app.py`, the homepage template, terminal controller, homepage stylesheet, and this report. Existing local edits remain uncommitted; no commit, push, or deployment was made.

## 2026-09-23 — Collapse unrevealed answer lines and default to light theme

### What changed and why

- The project list showed floating em-dash markers and large blank gaps during generation because hidden word spans retained their layout space while the paragraph markers were CSS pseudo-elements, visible independently of the words.
- Unrevealed words now use `display: none`; each word becomes visible with the existing upward/blur reveal when its timer fires. The containing paragraph is marked on its first revealed word, so its project dash appears with its text rather than ahead of it.
- The document root now explicitly starts with `data-theme="light"`. The existing theme controller still honors a visitor's saved choice, while a first visit and the no-script fallback are light.

### Architecture and trade-offs

The existing browser-side `revealReply` flow still owns timing and interruption behavior. A small local helper reveals each word and marks its paragraph; CSS collapses words that have not started, and animates them once shown. The reduced-motion rule removes the spatial/blur animation while keeping the progressive text reveal. No new dependencies or server routes were added.

### Verification performed

- Reproduced `/projects` locally at the start of its reveal. Only the active line had a visible dash; later paragraphs measured zero height and had no generated marker until their first word appeared.
- Submitted `/contact` during the project reveal. The project response finished, cleared `aria-busy`, and the contact response began; after completion both replies had no hidden words and no browser console warnings or errors were reported.
- Checked the local preview at 1440 × 900 and 390 × 844. The 390px viewport had a 390px document width and a 370px terminal, with no horizontal overflow. The root theme and toggle were light.
- The browser requests reduced motion, so its no-translation variant was used; progressive reveal was observed, while the normal-motion transform was not visually checked. `node --check public/static/js/terminal.js` and `git diff --check` passed. No automated test suite was run.

### Git state

The source changes and this report are local and uncommitted. Existing report edits and local tooling/design-plan files were preserved. No commit, push, or Vercel deployment was performed.

## 2026-09-23 — Reliable answer generation reveal

### What changed and why

- Reworked the portfolio answer reveal after observing that this browser has `prefers-reduced-motion: reduce` enabled. The previous code returned early in that setting, so replies appeared all at once.
- Replies now reveal word by word in both motion settings. Normal motion uses a more visible upward fade with blur clearing; reduced motion removes translation, blur, and transitions while keeping the brief progressive text reveal.
- Interrupting a reveal clears its scheduled timers and immediately finishes the current response.

### Architecture and trade-offs

The existing browser-side `revealReply` function still animates the server-rendered reply templates without changing their links or structure. The reveal duration scales with the number of words and is bounded to keep long answers from taking too long. Under reduced motion, words appear directly without spatial movement or a transition.

### Verification performed

- Inspected the local preview and confirmed the browser reports reduced motion enabled; the previous early return was the reason no reveal occurred in that mode.
- In reduced-motion mode, `/contact` showed 4 of 11 words after 260 ms and all 11 words after the reveal finished; `aria-busy` cleared at completion. The `/projects` reply also revealed progressively, and submitting `/about` while it was running completed the project reply before starting the new one.
- At 1440 × 900, the document had no horizontal overflow. At 390 × 844, the document width was 390px and the terminal width was 370px, with the transcript remaining internally scrollable.
- The browser console had no warnings or errors. No automated tests were run.

### Git state

Changes remain local and uncommitted with the existing worktree changes. No deployment, commit, or push was performed.

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
- The first Vercel build published only the `public/` files because the existing project's Framework preset was `Other`, which disabled Flask detection. Set the Vercel project preset to Flask; a subsequent Vercel build produced the Python function from `app.py`.
- Preview and production checks returned 200 for Home, Projects, Experience, About, Contact, CSS, JavaScript, and the resume PDF. Production HTML contains the expected portfolio title and terminal content; the PDF response begins with the `%PDF` signature.
- Production is available at `https://ultra-maxing-portfolio.vercel.app`.
- The first function exclusion override was invalid for this zero-configuration Flask entry point and was removed. No custom routing configuration is required.

### Git state

The application and Vercel setup are pushed to `origin/main`; the Vercel project's Flask framework preset is set in its project settings, and production is live on the domain above.

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

## 2026-09-23 — Single-screen terminal homepage

### What changed and why
Replaced the old homepage dashboard with a centered desktop-terminal-style welcome and portfolio conversation. The welcome screen uses the existing pixel name art. Continue and Enter open the same page in place. The conversation repeats that artwork at the upper left, shows the agreed SJSU computer engineering introduction, and offers `/experience`, `/project`, `/about`, and `/contact` in the requested order. Arrow keys, Enter, pointer selection, Escape, common aliases, and short typo matching work in the prompt. Replies use current Flask project/experience records and established about/contact details. Unknown text receives the agreed fallback. There is no shell execution, authentication, or live AI service.

### Architecture and cost
Kept Flask/Jinja, browser JavaScript, and CSS; added no dependencies, API service, or paid resources. The home handler supplies its existing project and experience tuples to small reply templates. A page-specific stylesheet contains the fixed viewport terminal and responsive sizing. The existing video and motion controls remain in use; the prior teal color treatment is restored, with localized translucent darkening at the broad light areas. Conversation output scrolls internally while the document remains viewport-sized.

### Verification
Flask test client returned 200 for `/`, all four existing content pages, homepage CSS/JS, and the resume. `node --check` passed for the terminal and scene controllers; `git diff --check` passed. Browser review at 1440x900 confirmed welcome-to-terminal transition, all four suggestions, keyboard selection, replies for projects/experience/contact, typo `/abotu`, unknown text, internal transcript scrolling, video playback/pause, and no page-level overflow. At 390x844, both screens fit after adjusting the large name to prevent a horizontal scrollbar; the menu is reachable and the transcript can scroll. Browser console had no warning/error messages. The browser session preferred reduced motion, so automatic playback stayed paused until manually started; the reduced-motion preference change listener is implemented but the OS setting itself was not changed.

Follow-up visual feedback enlarged the welcome pixel wordmark and placed it left of center; the session now reuses the same artwork at the upper left instead of repeating a plain text name. Restored the earlier teal background grading and subdued its broadest light areas with localized overlays. At 390x844, the wordmark is 265px wide and the welcome container's scroll width equals its client width (368px), with no document overflow.

The video is still served from its existing remote CloudFront source. CSS can reduce its diffuse glow, though the source video can vary across frames; a static browser screenshot confirms the tonal adjustment only at the captured frame.

### Git state
Modified the Flask home handler, base template, home template, existing terminal and scene JavaScript; added a homepage-only CSS file. Updated the design plan. Existing Git changes and the untracked plan folder were preserved. No commit or push was made.

## 2026-09-23 — Project-aware terminal chat and theme surfaces

### What changed and why

- Visitor messages now appear above curated replies. A project-title query returns one verified project; /projects returns the full current list. Unmatched queries point visitors to supported topics.
- Repeating a topic, project, or identical unmatched query returns to its first response without adding another transcript entry. /clear removes transcript entries, resets this lookup, and leaves the visitor in the active terminal.
- Dark mode uses amber visitor prompts, green portfolio replies, and muted red errors. Light mode uses neutral brown/green/red accents, a beige terminal, and a slightly darker warm off-white page.
- Removed the top-right and bottom-left dark video vignettes while keeping the existing motion, video grading, and edge contrast. Inverted the pixel name artwork in light mode. Reduced welcome spacing on shorter desktop viewports so its content fits without a welcome-panel scrollbar.

### Architecture, data flow, and trade-offs

Kept Flask/Jinja, the existing PROJECTS and EXPERIENCE data, and the homepage JavaScript/CSS. Jinja marks verified project titles in the existing reply template; the browser matches normalized visitor text to those titles and clones the matching project entry. The complete /projects answer still comes from the same template. No endpoint, package, AI service, or external API was added. Chat matching is intentionally limited to verified local content.

### Verification performed

- JavaScript syntax check passed for terminal.js. git diff --check found no whitespace errors; Git emitted existing LF-to-CRLF notices.
- Manually inspected a fresh local preview at 1280×720. Verified welcome fit, all four topics, one-project lookup, the full project list, unmatched Dash Project guidance, repeated-answer return without duplication, /clear reset, pointer selection, arrow/Enter selection, light/dark surfaces and accents, and internal conversation scrolling.
- Started and paused the existing background motion control. The browser opened with motion paused; its OS reduced-motion setting was not changed.
- No automated test suite was added or run. The available browser viewport did not allow setting 1440×900 or 390×844, and browser console logs were not accessible through that interface; those checks remain unverified.

### Git state and preview

No commit, push, or deployment was made. Existing local edits were preserved. The existing preview on port 5055 kept serving its cached template, so verification used a separate local preview on port 5056; the original process was left untouched.

## 2026-09-23 — Theme-responsive accents and chat alignment

### What changed and why

- Made accent colors respond to the active theme. Dark mode uses vivid orange visitor prompts, green reply markers, pink-red errors, and distinct orange, cyan, and purple project titles. Light mode uses softer earthy/pastel equivalents, including warm brown, sage, dusty red, and muted project accents.
- Kept the command row subtly highlighted and the reply on the terminal surface with no filled panel. The bullet sits at the left edge of the reply; the reply heading and body share a content column beginning just below the command text, instead of being shifted far to the right. Project descriptions retain their em-dash prefixes.
- Kept the terminal centered against the viewport itself, independent of inherited `.shell` sizing, with responsive safe-area padding.
- Accent contrast against the terminal surface is at least 4.58:1 across both themes (light mode minimum: Porta title; dark mode minimum: error accent).

### Architecture and trade-offs

The styling remains in the homepage stylesheet and uses CSS custom properties selected by the existing theme attribute. The theme toggle therefore updates terminal surfaces, prompt/output colors, project titles, and focus accents together without changing the transcript or adding runtime services. A decorative marker is added by the existing client-side reply builder and hidden from assistive technology; Flask/Jinja content and server data remain unchanged.

### Verification performed

- Refreshed the preview at `http://127.0.0.1:5056/` and visually inspected the `/projects` transcript in dark and light modes at 625×680. The theme switch changes the terminal and accent palette together; the light palette is visibly softer. The question row, reply bullet, project title, and dash-led details remain distinct, and the prompt remains visible while output scrolls.
- Calculated WCAG contrast for visitor, reply, error, project-title, and focus accents against the terminal surface. The minimum is 4.58:1 in light mode and 6.20:1 in dark mode. `node --check` and `git diff --check` passed. No automated test suite was added or run.
- A 1440×900 and a 390×844 viewport check was not available in this browser session; those sizes remain unverified for this refinement.

### Git state

Updated the homepage stylesheet, implementation report, and design plan. Existing local changes remain in the worktree. No commit, push, or deployment was made.

## 2026-09-23 — Cyan and cobalt default accents

### What changed and why

- Made cyan the shared dark-theme default for the welcome callout bar, reply marker, focused prompt, selected suggestion, links, and focus outline.
- Made the corresponding light-theme default cobalt blue (`#264da6`) to match the original light palette.
- Changed the PreParty Live title from teal to vivid pink (`#ff5f87`) in dark mode and a contrast-safe rose (`#a34f69`) in light mode. Porta remains orange and Adversarial Text Generator remains violet.

### Architecture and trade-offs

The existing CSS theme tokens drive both themes and all of these elements; Flask, JavaScript, and the transcript data flow are unchanged. The light rose is darker than a decorative pastel so project text remains readable on the beige terminal.

### Verification performed

- Inspected the `/projects` view in both themes at the available 625×680 viewport. The welcome callout and prompt use cyan in dark mode and cobalt in light mode; PreParty Live is pink/rose in both.
- Calculated contrast against the terminal surface: default accent is 10.89:1 in dark mode and 6.66:1 in light mode; PreParty Live is 6.24:1 in dark mode and 4.63:1 in light mode.
- `git diff --check` and trailing-whitespace inspection passed. 1440×900 and 390×844 remain unverified in this refinement.

### Git state

Updated the homepage stylesheet, implementation report, and design plan. Existing local changes remain uncommitted; no push or deployment was made.

## 2026-09-23 — Remove repeated footer prompt

Removed the repeated `thinh@portfolio:~$` label from the terminal's bottom status strip, matching the supplied screenshot request. The source template now contains only the keyboard guidance there. The preview process retained its old rendered template, so a scoped status rule also hides any stale repeated span while preserving the hint. The welcome-screen path and per-message command prompt are unchanged.

Verified by reloading the local preview and checking the terminal footer. `git diff --check` passed. No automated test suite was added or run. Changes remain local and uncommitted.

## 2026-09-23 — Distinct contact colors and resume preview

### What changed and why

- Assigned separate theme-aware colors to the email, GitHub, LinkedIn, and resume links. Dark mode uses bright cyan, purple, green, and pink; light mode switches to cobalt, muted purple, sage, and rose. The same tokens style contact links in the dedicated contact page, portfolio replies, and resume actions.
- Added a dedicated `/resume` page with the one-page resume visible by default, plus an “Open full size” link and a direct PDF download. The global Resume link and contact links now lead to this page.
- New visitors start in light mode; saved explicit theme preferences still take precedence. Existing reduced-motion behavior remains in effect.

### Architecture and trade-offs

The viewer uses a static PNG rendered from the existing PDF for a dependable inline preview. The Codex in-app browser displayed the PDF iframe as a blank area, so a raster preview makes the document visible there; both actions still target the original PDF. The preview is about 564 KB. No dependency, external API, or paid service was added.

### Verification performed

- Visually inspected `/contact` at the available 753×680 in-app viewport in light and dark modes. Email, GitHub, LinkedIn, and Resume appeared in four distinct colors in both themes; switching the theme changed the background and palette. Restored the preview to light mode.
- Inspected `/resume` at the same viewport. The resume preview rendered, the page defaulted to light for this fresh local origin, and both actions pointed to the original PDF. The browser accessibility tree exposed the preview image and both actions.
- `node --check public/static/js/theme.js` and `git diff --check` passed. No automated test suite was added or run. Other viewport sizes and reduced-motion variants were not rechecked in this turn.

### Git state

Updated the Flask route, shared/base and contact templates, theme and terminal CSS, resume page styles, and design plan. Existing local edits remain in the worktree; no commit, push, or deployment was made.

## 2026-09-23 — Resume viewer proportions

Widened the centered resume viewer's maximum width from 1240px to 1600px so its scale on large displays better matches the supplied desktop reference while preserving the narrow-screen gutters. Kept the motion control aligned to the same centered content edge. Updated the design plan to record the selected maximum width.

Visually checked `/resume` at a 2048 × 1123 viewport; the paper, links, and motion control align with the requested desktop proportions. `node --check public/static/js/theme.js` and `git diff --check` passed. The production build completed successfully, and the new public URL `https://mthinhngn.vercel.app` serves the portfolio. The existing Vercel project was already connected to `mthinhngn/ultra-maxing-portfolio`, so the deployment reused that project. Its SSO gate was disabled so visitors can open the `.vercel.app` URL without signing in. Local changes were deployed directly; they have not been committed or pushed to GitHub.

## 2026-09-23 — Resume scale and return navigation

Reduced the centered resume preview from a 1600px fixed maximum to 77vw, capped at 1200px, to match the full-page size in the latest reference image at common desktop widths. Added a top-right “Back to portfolio” link and moved the motion control higher so the two controls do not overlap. Updated the living design plan to match.

At 1488 × 1664, the deployed viewer measured 1146px wide (about 78% of the browser's CSS viewport), matching the reference scale; the preview image loaded and the header controls remained separate. At 390 × 844, the page had no horizontal overflow and the back link remained visible. Clicked “Back to portfolio” in the local preview and confirmed it returned to `/`.

The updated production deployment is ready at `https://mthinhngn.vercel.app` (deployment `dpl_8HeWKW4m72u81kXxnLpcJCpKws3D`). The `/resume` page, its stylesheet, preview PNG, and PDF returned HTTP 200; the in-app browser also loaded the live resume image. `node --check public/static/js/theme.js` and `git diff --check` passed. No automated test suite was added or run. The changes remain uncommitted and were not pushed to GitHub.

## 2026-09-23 — Resizable portfolio terminal

### What changed and why

- Set the desktop terminal's default width and height to about 70% of the viewport, with sensible maximum dimensions; mobile keeps the terminal full-width.
- Added a bottom-right resize grip. Dragging resizes within the available page area, arrow keys adjust width and height, and clicking the grip restores the default size.
- Raised the mobile prompt input to 16px so focusing it to choose a suggestion avoids the small-field auto-magnification behavior on mobile browsers.

### Architecture and trade-offs

The existing homepage CSS defines default dimensions and the full-width mobile layout. The existing vanilla JavaScript uses pointer capture for dragging and CSS custom properties for the current dimensions; keyboard resizing follows the same clamped sizing path. Reset removes those properties and restores the responsive CSS defaults. No package, service, or data flow was added.

### Verification performed

- In the local browser at 1440×900, the default terminal measured 1008×630. Drag resized it to 1098×700; clicking reset restored 1008×630; ArrowRight and ArrowDown resized it to 1040×662.
- At 390×844, the terminal remained full-width (370×778), the resize grip was hidden, focusing the prompt opened all four suggestions, its computed font size was 16px, `visualViewport.scale` stayed at 1, and the page had no horizontal overflow. The in-app browser does not reproduce all physical iOS Safari behavior, so that exact device behavior remains unverified.
- `node --check public/static/js/terminal.js` and `git diff --check` passed. No automated test suite was added or run.

### Git state

The resize stylesheet and controller, design plan, and this report are updated in the existing worktree. Existing unrelated user changes remain untouched. No commit or GitHub push was made.

The production build completed and was deployed to `https://mthinhngn.vercel.app` as `dpl_DzNcQCHTngWiXQyNwxRN3zJxo4CC`. The custom domain had remained aliased to the previous production deployment, so it was reassigned to this release. Verified the alias target and HTTP 200 responses for the homepage, terminal stylesheet, terminal controller, and resume page; the live homepage includes the resize grip and the stylesheet/controller include the new resize behavior. No GitHub push was made.

## 2026-09-23 — Hover-only terminal resizing

### What changed and why

- Constrained the welcome wordmark to its actual content column so it stays inside the terminal as the window changes size.
- Removed the persistent resize icon. Pointer users can drag any edge or corner; the corresponding resize cursor appears only while hovering over that edge or corner. The same shared terminal frame handles both the welcome screen and portfolio session.
- Kept keyboard resizing and reset support through a control that appears as text only when keyboard-focused. Mobile remains full-width with pointer resizing disabled.

### Architecture and trade-offs

The Flask/Jinja template provides transparent edge hit areas and a keyboard control. The homepage stylesheet supplies hover cursors and bounds the welcome artwork; the existing JavaScript applies clamped width/height and offsets while preserving the opposite edge during pointer resizing. No packages, services, or hosting configuration changed.

### Verification performed

- Refreshed the local preview at `http://127.0.0.1:5059/` after restarting Flask so the updated template was loaded. At 768 × 694, the terminal measured 538 × 486 and the welcome screen had no horizontal overflow; the wordmark fit its 382px content column.
- Confirmed west, south, northeast, and southeast hover targets select the expected resize cursor. Dragging the southeast corner changed the terminal to 562 × 510. Keyboard ArrowRight resized it and Home restored the default dimensions.
- At 390 × 844, the terminal remained 370 × 778, pointer resize targets were hidden, and the document had no horizontal overflow. The browser console had no errors.
- `node --check public/static/js/terminal.js` and `git diff --check` passed. No automated test suite was added or run.

## 2026-09-23 — Terminal reference size and centering

Changed the desktop terminal default from 70vw × 70dvh to 64vw × 90dvh, capped at 1440px wide and 1000px tall, to match the user's reference image. Removed asymmetric desktop top and bottom padding, including the short-viewport overrides, so the window remains centered on the viewport at every desktop height. The mobile full-width sizing and safe-area padding remain unchanged. Drag and keyboard resizing still override these defaults; reset returns to the new reference size.

The plan now records the selected proportions. In the local preview at `http://127.0.0.1:5059/`, a 2048 × 924 viewport produced a 1311 × 832 terminal centered at (1024, 462), matching the supplied reference's proportions and center. At 768 × 694 it measured 492 × 625 and remained centered, with no page overflow or welcome-wordmark overflow. At 390 × 844 the existing mobile layout remained 370 × 778 with no page overflow. The local preview returned to the active browser after the viewport checks. `git diff --check` passed. No automated suite or deployment was run.

### Git state

Updated the homepage template, homepage stylesheet, terminal controller, this report, and the design plan. Other existing worktree changes remain untouched. Changes are local only; no deployment, commit, or push was made.

## 2026-09-23 — Motion starts enabled by default

### What changed and why

- Set the background video to start playing on every page load at viewport widths of 601px and wider, including when the browser prefers reduced motion. The Pause/Play control remains available, and background motion still pauses while the tab is hidden.
- Lowered the playback threshold from 1000px to 601px so the local preview and smaller laptop/tablet layouts also receive the default motion. Narrow mobile layouts remain static; CSS animations continue to honor reduced-motion preferences.

### Architecture and trade-offs

The existing shared `scene.js` controller owns the video lifecycle. The motion default is initialized per page load and is not persisted, so a visitor who pauses it can still reload or navigate to a page that starts in motion. No services or dependencies changed; video bandwidth remains tied to existing traffic.

### Verification performed

- On the local preview at 768 × 694, with `prefers-reduced-motion: reduce` enabled, the video loaded and advanced to 1.74 seconds, the page reported `data-motion="running"`, and the Pause control was visible.
- Clicked Pause and Play; the video paused, then resumed, and the control label and `aria-pressed` state updated accordingly. The browser reported no console warnings or errors.
- `node --check public/static/js/scene.js` and `git diff --check` passed. No automated test suite was added or run.

### Git state

Updated the shared background controller, design plan, and this report. Existing local changes remain intact. Changes are local only; no deployment, commit, or push was made.

## 2026-09-23 — Terminal expand control, browser favicon, and hover scrollbar

### What changed and why

- Added a minimal four-corner expand/restore control beside “portfolio session.” Expanding fills the viewport and scales the terminal contents with it; restoring returns the terminal to its previous dimensions.
- Kept the original `❯_` prompt glyph in the terminal tab. Added a terminal-window favicon to the browser tab, with cyan on slate in dark mode and cobalt blue on cream in light mode.
- Kept the conversation scrollbar 6px wide at rest. Moving the pointer to its right edge expands it into a 42px themed rail with a larger thumb and arrow controls. Keyboard focus on the transcript exposes the same expanded rail.

### Architecture and trade-offs

The existing terminal controller toggles one temporary hover class from pointer proximity and retains the current terminal sizing variables for restore. CSS `zoom` scales the existing titlebar and conversation together inside the fixed viewport. Two small SVG assets provide the browser favicon, and the shared theme controller selects the matching asset on load and on theme changes. The scrollbar remains native and uses browser scrollbar pseudo-elements. No packages, services, APIs, or deployment settings changed.

### Verification performed

- `node --check public/static/js/terminal.js`, `node --check public/static/js/theme.js`, and `git diff --check` passed. No automated test suite was added or run.
- On `http://127.0.0.1:5059/`, the desktop terminal measured 491.5 × 624.6 at 768 × 694, expanded to 768 × 694 with content zoom 1.111, and restored to its original dimensions. No horizontal page overflow was present.
- At 390 × 844, the terminal measured 370 × 778, expanded to 390 × 844 with content zoom 1.054, and had no horizontal overflow.
- With `/projects` open and overflowing the transcript, the scrollbar measured 6px at rest, 42px near the right edge, and returned to 6px when the pointer moved away. Keyboard focus also expanded it to 42px.
- Confirmed the terminal tab shows the original `❯_` glyph. The browser favicon link selects the light and dark SVGs as the theme changes, and both assets returned HTTP 200. Returned the local preview to light mode.

### Git state

The changes remain in the existing uncommitted worktree alongside previously present local edits. No deployment, commit, or push was performed for this update.

## 2026-09-23 — Browser tab title

Changed the homepage browser tab title to exactly `thinhdegoat`. The other page titles retain their page label and use `thinhdegoat` as the site name. This updates the text beside the favicon without changing the portfolio content or the icon.

Restarted the local Flask preview at `http://127.0.0.1:5059/` and confirmed `document.title` is `thinhdegoat` on the homepage. No automated test suite was added or run. The work remains uncommitted in the existing worktree; no deployment or push was made.
## 2026-09-23 — Generated answer word reveal

### What changed and why

- Replaced the homepage response reveal's character-by-character timer with an Aceternity-inspired word reveal: each answer word enters with a short upward movement, blur reduction, and opacity transition after a visitor submits a topic.
- Kept the existing response templates, links, duplicate-response behavior, keyboard interaction, and reduced-motion handling intact.

### Architecture and trade-offs

The existing `revealReply` boundary still owns response animation. It now wraps only non-whitespace text nodes in presentation spans, so headings, paragraphs, metadata, and links retain their original structure and semantics. A short completion timer lets interrupted responses finish immediately. The effect uses CSS transitions and no new dependency; per-word spans slightly increase the generated DOM size, which is appropriate for the small portfolio responses.

### Verification performed

- `node --check public/static/js/terminal.js` passed.
- `git diff --check` passed.
- No browser preview or automated test suite was run in this turn.

### Git state

The change remains local and uncommitted in the existing worktree. Existing unrelated modifications were preserved; no deployment, commit, or push was performed.
## 2026-09-23 — Terminal `/help` and `/skills` commands

### What changed and why

- Added `/help` to the terminal command picker and resolver. Its response lists every supported navigation command with a short description, including `/help`, `/skills`, and `/clear`.
- Added `/skills` to the picker and resolver. Its response presents the existing portfolio skill content in four grouped sections: Languages, Backend & data, Infrastructure, and Observability.
- Applied a distinct accent color to each skill section while preserving the terminal's existing monospace layout, response markers, word reveal, duplicate-response behavior, and responsive mobile layout.
- Expanded unknown-command guidance so visitors can discover the new commands.

### Architecture and trade-offs

The commands remain client-side terminal topics: the existing `topicAliases`, response templates, and `createReply` flow handle them without adding routes, dependencies, APIs, or server state. The skills are duplicated in the homepage response template from the verified About content so the terminal can render a self-contained response; if the skills change later, both presentation surfaces should be updated together. The section colors are intentionally limited to the skills response and do not alter the page-wide theme palette.

### Verification performed

- `node --check public/static/js/terminal.js` passed.
- `git diff --check` passed; Git emitted only existing line-ending normalization warnings.
- Confirmed the new Jinja templates and command entries are present in `templates/index.html`, and the existing Flask data/routes remain unchanged.
- Attempted a Flask homepage render with the test client, but the current Python environment does not have Flask installed (`ModuleNotFoundError: No module named 'flask'`), so server-side template rendering remains unverified in this turn.
- No browser preview or automated test suite was run in this turn.

### Git state

The homepage template, terminal controller, and homepage stylesheet remain local and uncommitted alongside pre-existing worktree changes in `IMPLEMENTATION.md` and `templates/base.html`. No deployment, commit, or push was performed.

## 2026-09-23 — Scrollable terminal command picker

### What changed and why

- Capped the command picker at a responsive height and enabled contained vertical scrolling with the terminal's existing scrollbar colors, so every command remains reachable when the menu is taller than its viewport.
- Kept keyboard-selected commands in view as visitors move through the list.
- Refreshed the stale local preview so the current `/help` and `/skills` command options are served.

### Verification performed

- Confirmed the local homepage serves both `/help` and `/skills`, and the stylesheet serves the scroll constraint and overflow behavior.
- `node --check public/static/js/terminal.js` and `git diff --check` passed.
- No automated browser visual test was run.

### Git state

The change remains local and uncommitted with pre-existing worktree changes; no deployment, commit, or push was performed.

## 2026-09-23 — Four-row command picker without a visible scrollbar

### What changed and why

- Limited the picker viewport to four command rows: 36px desktop rows and 44px mobile rows, plus the existing vertical padding.
- Hid the scrollbar indicator while retaining vertical overflow, so wheel/touch scrolling and keyboard selection can still reach commands beyond the first four.

### Architecture and trade-offs

The picker remains the existing listbox; no command data or interaction flow changed. `highlight()` still scrolls the active option into view for keyboard navigation. Hiding the scrollbar reduces visual clutter but also removes the drag handle, so the existing up/down keyboard hint and native wheel/touch scrolling remain important ways to discover the rest.

### Verification performed

- Confirmed the CSS caps the menu at four row heights, uses `overflow-y: auto`, and hides scrollbar rendering for Firefox and WebKit-based browsers.
- `node --check public/static/js/terminal.js` and `git diff --check` passed.
- No automated browser visual test was run.

### Git state

The CSS and report update remain local and uncommitted alongside the existing worktree changes. No deployment, commit, or push was performed.

## 2026-09-23 — Command descriptions and `/whoami`

### What changed and why

- Replaced the command picker’s label column with short, user-facing descriptions, and shortened the `/help` rows to the same command-description format shown in the reference.
- Renamed the terminal command and reply template from `/about` to `/whoami`; updated unknown-command guidance. Natural-language “about me” requests still resolve to the identity response.
- Kept the website’s separate `/about` route unchanged; only the terminal command was renamed.

### Architecture and trade-offs

`TERMINAL_COMMANDS` remains the single source for command names and descriptions in both the picker and `/help`. The picker keeps its `data-label` and alias attributes for topic naming and resolution while rendering `description` as the visible second column. The `whoami` command reuses the existing identity response content under the new template ID; no content facts, routes, or dependencies changed.

### Verification performed

- Flask/Jinja test-client checks confirmed the homepage renders the short descriptions, `/whoami` option and reply template, and no `/about` terminal option; the direct `/about` page route remains available.
- `node --check public/static/js/terminal.js` and `git diff --check` passed.
- No automated browser visual test was run.

### Git state

The command, template, controller, and report changes remain local and uncommitted alongside existing worktree changes. No deployment, commit, or push was performed.

## 2026-09-23 — More casual command descriptions

### What changed and why

- Rewrote the shared command descriptions in a more relaxed, playful voice while keeping each line recognizable: for example, `/experience` now says “where I put my skills to work,” and `/whoami` says “meet the human behind the keyboard.”
- Updated `/help`, the picker, and `/clear` descriptions from the same command catalog, so the copy stays consistent in both outputs.

### Architecture and trade-offs

Only description strings changed; command IDs, aliases, reply templates, and routes remain untouched. The conversational phrasing adds personality but stays brief enough to scan in the two-column menu.

### Verification performed

- Flask/Jinja test-client check confirmed all seven updated descriptions appear in both the picker and `/help` output.
- `node --check public/static/js/terminal.js` and `git diff --check` passed.
- No automated browser visual test was run.

### Git state

The description and report updates remain local and uncommitted alongside existing worktree changes; no deployment, commit, or push was performed.

## 2026-09-23 — Distinct skills-section accent colors

### What changed and why

- Replaced the Databases & Storage section's blue accent with coral in both themes, avoiding a repeat of the blue Technical skills heading while preserving distinct colors for Languages, Frameworks, Databases & Storage, and Infra & Tools.

### Architecture and trade-offs

Only the semantic `--skill-databases` token changes; the theme-specific coral values are `#ff8a65` on the dark surface and `#a94332` on the light surface. The category label and divider continue to share this token, keeping the accent role consistent without changing the wider terminal palette.

### Verification performed

- Calculated contrast against each theme's terminal surface: 7.82:1 dark and 5.08:1 light, both above 4.5:1.
- Confirmed the other three skill-group colors remain distinct and `git diff --check` passed.
- No browser screenshot test was run.

### Git state

The stylesheet and report remain local and uncommitted alongside existing worktree changes; no deployment, commit, or push was performed.

## 2026-09-23 — Welcome-screen wordmark

### What changed and why

- Replaced the large THINH NGUYEN welcome-screen wordmark with WELCOME, matching the request while leaving the session identity wordmark unchanged.
- Added a dedicated pixel-tile SVG for the welcome title. It reuses the existing 432×213 viewBox, square tile size, layered offsets, stroke/fill colors, and accessible-text pattern.

### Architecture and trade-offs

The welcome and session identity now use separate SVG assets, so changing the introductory title cannot accidentally rename the in-session identity. The smaller, single-line word has more open space within the same canvas; tile size and CSS sizing remain unchanged to preserve the established title treatment and layout.

### Verification performed

- Parsed the new SVG as XML and checked its viewBox and visual treatment tokens against the existing wordmark.
- Checked the rendered home template through Flask's test client for the new welcome asset, accessible heading, and unchanged session identity asset.
- Verified the asset is served by the local preview and git diff --check passes. No browser screenshot test was run.

### Git state

The welcome template, SVG, and report updates remain local and uncommitted alongside existing worktree changes; no deployment, commit, or push was performed.

## 2026-09-23 — Clearer, larger welcome wordmark

### What changed and why

- Rebuilt WELCOME with legible 5×7 pixel glyphs; the previous 4-column custom forms made several letters hard to recognize.
- Removed the duplicate small WELCOME label and enlarged the title's desktop and mobile width limits.
- Kept the existing 12px square tiles, layered outline treatment, colors, accessible heading, and separate session identity artwork.

### Architecture and trade-offs

The welcome remains its own vector asset so it can scale cleanly without changing the name graphic in the portfolio session. The SVG uses a compact viewBox around the single-line word, so the larger responsive width also increases the actual pixel-cell size. Width remains capped and adapts to narrow viewports.

### Verification performed

- Checked the new glyph grid, SVG XML/viewBox, and matching tile, color, and stroke values against the existing name wordmark.
- Flask/Jinja checks verified the accessible heading, removed eyebrow, updated image dimensions, and unchanged session name asset.
- Checked responsive CSS declarations, local HTTP 200 for the page and asset, and git diff --check. The agent-browser CLI is unavailable in this environment, so no screenshot-based visual test was performed.

### Git state

The template, stylesheet, SVG, and report updates remain local and uncommitted alongside pre-existing changes. No commit, push, or deployment was performed.

## 2026-09-23 — Three-part welcome composition

### What changed and why

- Repositioned the large WELCOME mark at the top of the welcome area and distributed the supporting content toward the bottom, reducing the oversized blank band in the previous centered composition.
- Thickened the pixel lettering by expanding each 12px grid cell to a 15px filled tile while retaining the existing tile grid, outline layers, colors, and theme inversion.
- Grouped “Portfolio session ready.” and “Press Enter to continue” as one action cluster; increased both text sizes and the button's minimum height.

### Architecture and trade-offs

The existing Jinja content order and SVG asset remain the source of the welcome copy and art. A two-zone flex layout separates the hero from the related status/continue controls; the existing JavaScript continues to handle the same Enter and button behavior. Desktop, mobile, and short-height rules cap the mark and scale the action text. This keeps the terminal aesthetic and avoids adding cards or filler. The composition intentionally leaves breathing room between the title and action cluster rather than vertically centering all three items.

### Verification performed

- Parsed the SVG and decoded its grid to confirm the word is WELCOME; checked the heavier tile geometry and matching colors/layers.
- Flask/Jinja checks confirmed all three items render in order, the accessible heading remains, and the session identity asset is unchanged.
- The local homepage, welcome SVG, and stylesheet returned HTTP 200. Impeccable layout/type detectors returned no findings, and git diff --check passed.
- No browser screenshot was completed: agent-browser was unavailable, and Chrome's headless screenshot request was forwarded to an existing browser session.

### Git state

The welcome template, stylesheet, SVG, and report remain local and uncommitted alongside pre-existing worktree changes. No commit, push, or deployment was performed.

## 2026-09-23 — WELCOME fills the hero area

### What changed and why

- Rebuilt the thick pixel-art WELCOME mark as two stacked lines, “WEL” and “COME,” so it uses the welcome panel’s vertical space without distorting the square-tile lettering.
- Increased the desktop mark’s available width and height while retaining the existing smaller-screen and short-height limits.
- Kept “Portfolio session ready.” and “Press Enter to continue” grouped as the lower action area.

### Architecture and trade-offs

The page still uses its existing Jinja template, standalone SVG asset, and responsive CSS. Splitting the word across two lines gives it substantially more height than a single-line wordmark at the same readable scale; the trade-off is the deliberate visual break in the word. The original colors, tile thickness, outline layers, accessible heading, and separate session identity remain intact. No JavaScript behavior changed.

### Data flow

Jinja renders the accessible “Welcome” heading and points its decorative image at public/static/images/welcome.svg. The SVG supplies the pixel lettering; terminal-home.css sizes it against the viewport while the existing flex layout keeps the status and continue controls together below.

### Verification performed

- Parsed the SVG as XML and checked its six glyph definitions, seven positioned letter uses, and updated viewBox.
- Flask test client confirmed the homepage response, updated image dimensions, both action labels, and unchanged session identity asset.
- Live HTTP checks returned 200 for the homepage, SVG, and stylesheet after restarting the local preview server.
- Impeccable layout detection returned no findings; git diff --check passed.
- No browser screenshot was captured, so final visual sizing has not been independently screenshot-verified.

### Git state

The template, stylesheet, SVG, and this report remain local and uncommitted alongside pre-existing worktree changes. No commit, push, or deployment was performed.

## 2026-09-23 — Single-line WELCOME at two-line height

### What changed and why

- Replaced the stacked “WEL / COME” wordmark with one continuous, single-line WELCOME.
- Scaled the existing pixel glyphs vertically so the visible letter height matches the prior two-line composition; updated the SVG's intrinsic dimensions to preserve that taller silhouette responsively.
- Retained the original tile artwork, thickness, colors, outline layers, accessible heading, and lower ready/continue content.

### Architecture and trade-offs

The Jinja template still references one standalone SVG, with existing CSS controlling responsive width and maximum height. The SVG reuses the same glyph paths in one reading line and applies a 2.2× vertical scale, matching the previous stacked lettering's visible height. The trade-off is intentionally taller-than-wide pixel cells; this keeps WELCOME on one line while matching the requested overall height.

### Data flow

Jinja outputs the screen-reader heading and the decorative SVG image. The SVG composes the WELCOME glyphs and layered outlines; the existing responsive hero CSS sizes the image. The ready message and continue button remain unchanged, as does their JavaScript behavior.

### Verification performed

- Flask test client parsed the SVG and verified the single-line WELCOME glyph order, placement, 2.2× transform, and updated image dimensions; it also confirmed the ready and continue copy.
- Live HTTP checks returned 200 for the homepage, SVG, and stylesheet after restarting the preview server.
- Impeccable type and layout detectors returned no findings; git diff --check passed.
- No browser screenshot was captured, so final visual sizing has not been independently screenshot-verified.

### Git state

The template, SVG, and this report remain local and uncommitted alongside pre-existing worktree changes. No commit, push, or deployment was performed.

## 2026-09-23 — Bring welcome actions closer to the title

### What changed and why

- Top-aligned the welcome composition and set a tight responsive 8–12px gap after WELCOME, bringing “Portfolio session ready.” and “Press Enter to continue” right beneath the title.
- Restored the title bar's intended `space-between` alignment and removed an unrelated gap there, keeping its session identity and controls in their original positions.

### Architecture and trade-offs

This is a CSS-only adjustment scoped to `.welcome-screen` and `.window-bar`. It preserves the existing Jinja reading order, art sizing, accessible heading, colors, and JavaScript behavior. The title and actions now read as one sequence, with the content intentionally grouped near the top instead of distributed across the panel.

### Data flow

The template continues to render WELCOME, the status copy, then the continue button. The welcome flex container places them in that order with a viewport-responsive gap, while the title bar continues to distribute its contents across the bar.

### Verification performed

- Scoped CSS assertions confirmed `.welcome-screen` is top-aligned with the 8–12px gap, and `.window-bar` retains its split alignment without the accidental gap.
- The live homepage and stylesheet returned HTTP 200; the refreshed preview DOM confirmed the title, ready line, then continue action order. The mobile-sized preview showed the actions immediately beneath WELCOME.
- Impeccable layout detection returned no findings; `git diff --check` passed.
- The Python Flask test client was unavailable because Flask is not installed in the current Python environment. The already-running Flask preview served the updated page and CSS successfully. The in-app browser cropped the attempted 1440×900 view, so that desktop-size visual check remains limited.

### Git state

The stylesheet and this report remain local and uncommitted alongside pre-existing worktree changes. No commit, push, or deployment was performed.

## 2026-09-23 — Mobile theme control and terminal prefix matching

### What changed and why

- On narrow screens, the theme control uses its SVG sun/moon transition instead of overlaying the WebM clip, preventing the black video rectangle seen on mobile.
- Terminal suggestions now narrow by command prefix as the visitor types. A matching command is selected with Enter; aliases are considered only when no command prefix matches.
- Updated static asset version parameters so deployed clients load the corrected CSS and JavaScript.

### Architecture and trade-offs

The existing theme storage and desktop video animation remain unchanged. Mobile uses lightweight SVG/CSS motion, with reduced-motion users avoiding video playback. Command filtering stays within the existing terminal controller and preserves free-text project requests when no command matches.

### Data flow

Theme click updates the root theme; the viewport and motion preferences decide whether video plays or the SVG transition carries the visual change. Prompt input normalizes the query, filters the command list, and Enter sends the selected visible command.

### Verification performed

- `node --check` passed for both changed JavaScript files; `git diff --check` passed.
- Local browser at 390×844: dark-mode switch showed the moon icon without a video rectangle; `ex` showed only Experience and Enter submitted `/experience`; `c` showed only Contact.
- iOS Safari itself was not available, so the mobile browser check does not prove device-specific rendering.

### Git state

The feature files are intended for a focused commit and production deployment. Pre-existing unrelated changes to this report and skill files remain local.

## 2026-09-23 — Restore desktop day/night video transition

### What changed and why

Restored WebM theme-switch playback on desktop even when the browser reports reduced motion. The prior mobile fix accidentally skipped desktop playback in that setting. The mobile SVG fallback remains unchanged.

### Architecture and trade-offs

The same theme controller decides by viewport: desktop plays the existing video; screens at 600px or narrower show the SVG transition. Reduced-motion desktop playback stays at the existing 2× rate to shorten the effect. No new media or dependencies were added.

### Data flow

On click, the theme updates immediately; the desktop video element receives the appropriate day/night source and plays over the icon until its ended event restores the static icon.

### Verification performed

- `node --check public/static/js/theme.js` and scoped `git diff --check` passed.
- Local browser at 1440×900 with reduced motion enabled: clicking the theme control showed the WebM video visible, playing, and set to 2× speed.
- Local browser at 390×844: clicking kept the video hidden and showed the SVG icon without a black rectangle.

### Git state

The code correction is committed locally; deployment was not requested for this follow-up. This report and pre-existing unrelated changes remain local and uncommitted.

## 2026-09-23 — Show Clear in terminal commands

### What changed and why

The terminal command menu now includes `/clear` and its existing description, “wipe the slate and start fresh.” It was previously excluded from the selectable list even though the command already worked.

### Architecture and trade-offs

The template receives the same command definitions used by the command index. No new command handler, style, or dependency was needed; the existing menu may scroll when all commands are shown.

### Data flow

Flask renders `/clear` into the list. Typing `cl` filters to it; clicking the option invokes the existing conversation reset.

### Verification performed

- Flask test client confirmed `/clear` and its description appear in the rendered home page.
- Local browser confirmed the `cl` suggestion and that selecting it clears the conversation log.

### Git state

The app change is intended for a focused local commit and Vercel production deployment. This report and unrelated pre-existing working-tree changes remain uncommitted.

## 2026-09-23 — Thicken homepage terminal typography

### What changed and why

- The homepage now prefers Cascadia Mono, matching the terminal-like face already used on the interior pages, and renders the terminal's base text at weight 500 instead of regular weight. This makes the character shapes read more like the supplied Claude Code and Codex terminal references.
- Kept the existing 700-weight headings, 15px desktop size, 13px mobile size, and 16px mobile prompt input. Bumped the homepage stylesheet URL version to `terminal-weight-1` so browsers request the updated CSS.

### Architecture and trade-offs

This is a CSS font stack and weight change; it adds no font download or dependency. The homepage font stack is now Cascadia Mono, Cascadia Code, SFMono-Regular, Menlo, and Consolas. On systems without those faces, the final monospace fallback and available weights can look different. Using weight 500 strengthens the whole terminal without flattening the existing distinction between body copy and bold reply headings.

### Data flow

`body.home-page` supplies the monospace stack. `.portfolio-terminal` sets the 500-weight base, inherited by the welcome/session copy, transcript, and prompt; reply headings keep their explicit bold rule. `templates/base.html` changes the stylesheet query version to invalidate cached copies.

### Verification performed

- Impeccable's type detector returned no findings before and after the change; `git diff --check` passed for the application edits.
- Local browser preview at 1440×900 reported the Cascadia-first family, 500 base weight, 15px text, and no horizontal overflow. At 390×844 it reported 500 weight, 13px text, no transcript overflow, and no horizontal page overflow.
- Clicked Continue, submitted `/projects` with Enter, and confirmed the project response rendered. The browser console had no errors. Flask served the homepage stylesheet under the new `terminal-weight-1` URL with HTTP 200.
- The checks used the local in-app browser on Windows. Font appearance on other operating systems was not verified.

### Git state

`public/static/css/terminal-home.css`, `templates/base.html`, and this report remain uncommitted. Existing unrelated worktree changes were left untouched. No commit, push, or deployment was performed.

## 2026-09-23 — Match resume entries and stabilize mobile theme controls

### What changed and why

- Reordered each experience entry so the organization is the heading and the role follows directly below it, with dates and location beneath the role. Added the resume's full bullet lists for all four positions.
- Replaced expandable project summaries with all resume bullets and the corresponding technology list. The same content appears on `/projects` and in the homepage terminal's `/projects` and `/experience` replies.
- Centered the phone terminal with equal top and bottom insets. Added a `100vh` fallback before `100dvh` for the viewport-sized homepage layout.
- Removed the theme toggle's WebM overlay. It could show an opaque video rectangle in Safari; the day and night SVG icons now crossfade and rotate with CSS, and the terminal surfaces transition their colors.
- The Gmail link uses the existing orange theme colors: `#FFB347` on dark surfaces and `#9A4C00` on light surfaces.

### Architecture and trade-offs

`PROJECTS` and `EXPERIENCE` in `app.py` are the shared content source for the standalone pages and the homepage's Jinja reply templates. This keeps the company/role order and bullet wording consistent across both ways to browse the portfolio. Showing every bullet makes the pages longer, but preserves the resume's evidence and tools.

`theme.js` still updates `data-theme`, the switch's accessible state, the favicon, and local storage. CSS now handles the icon and surface transition directly, so theme switching does not depend on video codec or transparency support. The existing reduced-motion preference still shortens transitions as requested by the browser or operating system.

### Data flow

Experience and project tuples render into Jinja lists. On the homepage, the existing command handler clones those same rendered templates into the terminal transcript. The theme button updates the root theme; CSS transitions the active SVG icon and terminal colors.

### Verification performed

- Local responsive preview at 390×844 showed the terminal with equal 12px top and bottom gaps and no horizontal overflow.
- `/experience` rendered four organizations in company → role → date/location order, with bullet counts 3, 5, 3, and 4. `/projects` rendered three projects and nine total bullets; neither page overflowed horizontally.
- In the homepage terminal, `/experience` rendered all four entries and 15 bullets; `/projects` rendered all three projects and nine bullets.
- At an iPad-sized 1024×1366 viewport, the terminal had equal 183px top and bottom gaps. Switching themes updated the page colors and switch state, and the WebM overlay was absent.
- The local in-app browser reports `prefers-reduced-motion: reduce`, so it shortened CSS transitions during the check. Responsive layout and final theme states were checked locally; physical iPhone/iPad Safari was not available for direct testing.
- `node --check public/static/js/theme.js` and `git diff --check` passed.

### Git state

The app data, templates, styles, theme script, and this report remain uncommitted with the pre-existing worktree changes. No commit, push, or deployment was performed.

## 2026-09-24 — Rework experience order, distinguish project stacks, and deploy

### What changed and why

- Experience now shows four separate roles with the role title first, then organization and dates, then the description. This follows the supplied example and removes the grouped-company presentation.
- Project technology names are stored as tuples and rendered in a terminal-style footer line, led by `└─` and separated with `›`. Cascadia Mono at weight 600 and each project's existing accent color distinguish the stack from project descriptions. The names stay in a curated, non-alphabetical sequence and wrap on narrow screens without boxed chips.
- The same stack presentation appears on `/projects` and in the homepage terminal's `/projects` reply. Project bullets use hyphens.

### Architecture and data flow

`PROJECTS` and `EXPERIENCE` in `app.py` feed the standalone Jinja pages and the homepage reply templates. `PROJECTS[*].technologies` is now a tuple of individual names so both views can render the same branch-and-chevron pattern. CSS assigns the stack line the matching project accent in light and dark themes.

### Verification performed

- Local in-app browser showed all four role-first experience rows and the project stack line; the homepage `/experience` and `/projects` commands rendered the same data.
- At a 390px viewport, the project stack wrapped without horizontal page overflow. Browser computed styles confirmed Cascadia Mono, weight 600, hyphen project markers, and project-specific stack colors.
- `git diff --check` and `.venv\Scripts\python.exe -m py_compile app.py` passed.
- Vercel production deployment `dpl_ABQWqPyW2kL11TaGu2wekC187p2H` is **Ready** (17-second build) at `https://ultra-maxing-portfolio.vercel.app`. GET checks for `/`, `/experience`, `/projects`, and both updated CSS assets returned HTTP 200. `/projects` contained 22 stack items and three branch markers. Vercel reported no error logs for the last hour.

### Git state

The implementation report, application, templates, and styles remain uncommitted with other existing worktree changes. No commit or push was made. The Vercel deployment was made from the local working tree.

## 2026-09-24 — Put organization and dates first in experience

### What changed and why

- All four experience entries now lead with the organization and date range on one blue line, separated by a middle dot (`Place · Time`). The role sits directly below, followed by its description. The top line wraps naturally on narrow screens.
- Ended the RA sentence with a period after “mobile Android infrastructure.” Kept the exact Spartan LinkedIn wording. Kept the SCE and SJSU College of Engineering content already provided, and added no employment mode, location, or skill details.
- Added an accessible visible hyphen before each description in both views. Made `/experiences` the canonical terminal command, kept `/experience` as a command alias, and exposed `/experiences` as a page route while preserving `/experience`. Bumped both stylesheet URLs and the terminal JavaScript URL so clients fetch the latest command guidance.

### Architecture and data flow

`EXPERIENCE` in `app.py` remains the shared source for both Jinja templates. Each template groups organization and dates in an `experience-heading-line`, then renders role and description in reading order. The description hyphen is an `aria-hidden` marker; the paragraph text remains the announced content. Flex wrapping moves the date range below the organization when the available width is too narrow. The terminal resolves `/experience` to canonical topic `experiences` and clones `reply-experiences`.

### Verification performed

- `python -m py_compile app.py` passed.
- Flask test-client requests to `/experience`, `/experiences`, and `/` returned HTTP 200. Assertions confirmed four entries, the clean RA sentence, exact Spartan wording, and visible hyphen markers in both rendered views. The command data lists `/experiences` with `experience` as an alias.
- `git diff --check` passed.
- Impeccable layout detection returned no findings; it could not resolve Jinja-generated stylesheet URLs in `base.html`, so the CSS files were also supplied directly to the scan.
- Local browser inspection showed the visible hyphen prefixes and the organization · date, role, description hierarchy. The terminal rendered `/experiences`, and `/experience` resolved to the same Experience response. The earlier 390×844 inspection confirmed that long organizations and dates wrap before the role. Direct iPhone Safari verification was not available.
- Vercel production deployment `dpl_Bh9k7rTb728vp8LP5QAF76vH3Bc7` was created in `mthinhngns-projects/ultra-maxing-portfolio` and reached **Ready** (9-second build). Its unique deployment URL passed GET checks for `/experiences`, `/experience`, `/`, the updated CSS assets, and terminal JavaScript; the Experience page contained the expected Research Assistant and Spartan Racing copy. After the user clarified this was a retired design, `mthinhngn.vercel.app` was restored to its pre-change deployment `ultra-maxing-portfolio-q5yqz5jop-mthinhngns-projects.vercel.app`; `ultra-maxing-portfolio.vercel.app` remained on its existing deployment. The restored domain's homepage returned HTTP 200. Vercel reported no error logs for the deployment.

### Git state

The requested application and report changes are being published to `origin/main`. Local agent and environment files and customized skill files are excluded from the release commit. The Vercel domain alias remains restored to its pre-change deployment.
