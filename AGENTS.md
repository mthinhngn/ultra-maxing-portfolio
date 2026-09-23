# Project Instructions

## Development behavior
- Inspect the existing project before changing it. Preserve the current stack, architecture, conventions, and public behavior unless the task requires otherwise.
- Keep changes focused on the requested work. Do not modify unrelated files or perform broad rewrites without a concrete reason.
- Prefer the smallest coherent implementation that fully solves the task.
- Use the `clean-coding` skill whenever writing, modifying, refactoring, or reviewing code.
- Use the `portfolio-website-content` skill when deciding what information, sections, project details, calls to action, or professional evidence belong on a portfolio website.
- For visual direction, styling taste, layout aesthetics, motion, or other UI/UX decisions, use a project-specific UI/UX skill if one exists. Do not invent a universal visual style for the user.

## Verification
- Verify changed behavior before declaring development complete. Use the project's existing build, test, lint, type-check, browser, or other relevant feedback loops when available.
- Do not claim a check passed unless it was actually run successfully.

## Git and repository maintenance
- Treat version control as part of development, not as cleanup after development.
- If the workspace is already a Git repository, inspect repository status before making changes and keep each completed development unit reflected in a clear, coherent Git history.
- Do not mix unrelated changes into the same commit.
- Never commit secrets, credentials, generated private data, or environment files that should remain local.
- If the workspace is not a Git repository, ask the user whether they want to treat it as one and whether you should initialize Git before doing repository-maintenance actions.
- If no remote is configured, do not invent one. If publishing or pushing is needed, ask the user where the repository should live.

## Completion communication
- At the end of every completed development turn, explain:
  1. what changed,
  2. why those changes were made,
  3. what verification was performed, and
  4. the resulting Git state when version control is in use.
- Keep the explanation concise and oriented toward decisions and outcomes rather than narrating every edit.
