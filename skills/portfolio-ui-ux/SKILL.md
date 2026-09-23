---
name: portfolio-ui-ux
description: Design and review the visual system, responsive layout, motion, and interaction behavior of this portfolio website. Use for UI/UX direction or frontend presentation work on the portfolio; defer content decisions and general implementation quality to the project's other skills.
---

# Portfolio UI/UX

Create a dark, minimal portfolio that combines the calm clarity of Notion and Apple interfaces with the character of a modern terminal. The result should feel personal and intentionally designed, not like a generic portfolio template.

## Visual direction

- Use a near-black or charcoal foundation with crisp light text and restrained surface separation.
- Use several terminal-inspired accents, such as green, cyan, amber, and magenta. Give each color a consistent role instead of scattering rainbow color decoratively.
- Pair a clean sans-serif typeface for reading with a monospace face for labels, metadata, navigation cues, commands, and technical details.
- Keep the overall composition minimal and spacious. Use a grid to create hierarchy, alignment, and occasional asymmetry rather than filling every cell.
- Prefer flat, precise surfaces, fine borders, and controlled glow. Keep corner radii and shadows modest.
- Treat terminal motifs as a visual language, not a literal terminal emulator. Visitors should never need to know commands or type into a prompt to navigate.

## Layout and interaction template

Use this as the default when the current design does not establish a stronger pattern:

- Provide a compact top navigation with conventional links and a clearly visible current, hover, and focus state.
- Open with a concise identity statement in the dominant grid area and use a smaller terminal-inspired status or metadata panel as support.
- Present projects in a responsive grid. Make the whole project target easy to activate and give hover and keyboard focus the same information.
- Use direct links or buttons for primary actions. A command-style prefix may add character, but the actual label must remain clear.
- Let the grid collapse into a single readable column on narrow screens while preserving content order and hierarchy.
- Use prominent motion at key moments: an intentional page entrance, section transition, project response, or cursor detail. Avoid animating every element or delaying access to information.

## Accessibility expectations

- Preserve semantic HTML, logical heading order, keyboard navigation, and visible focus indicators.
- Meet WCAG AA contrast for text and controls. Do not rely on accent color alone to communicate state.
- Keep interactive targets comfortably usable on touch screens and ensure hover-only effects have focus and touch equivalents.
- Honor `prefers-reduced-motion` by removing large movement, parallax, and repeated animation while preserving state changes.
- Maintain readable type sizes and line lengths; terminal styling must not reduce legibility.

## Avoid

- Generic AI-generated landing-page patterns: gradient blobs, excessive glass panels, pill-shaped decoration, uniform rounded cards, arbitrary neon glow, and a centered hero followed by interchangeable feature cards.
- Decorative fake windows or traffic-light controls that have no relationship to the content.
- Dense walls of monospace text, low-contrast gray copy, or color combinations that make the interface feel noisy.
- Effects that imitate Apple, Notion, or a terminal so literally that the portfolio loses its own identity.

## Verification loop

After visual implementation, run the site and inspect the rendered interface at a representative desktop viewport of `1440x900` and mobile viewport of `390x844`. Use the project's available browser workflow; do not require a specific automation framework.

At both sizes, verify:

1. The page has no unintended horizontal scrolling, clipping, overlap, or unreadably narrow text.
2. The navigation, primary actions, and project targets are discoverable and usable.
3. Grid order and spacing preserve the intended hierarchy when the layout collapses.
4. Typography, contrast, focus states, and terminal accents remain legible.
5. Motion feels purposeful, and the reduced-motion version remains understandable.

Exercise the main navigation and one representative project interaction with both pointer and keyboard. Check the browser console for UI-related errors. Correct visible problems and repeat the two viewport checks before considering the UI work complete. Record what was actually checked and any limitation that prevented a check.

This skill governs presentation and interaction choices. Do not use it to invent portfolio claims, choose professional evidence, or restate general code-organization rules.
