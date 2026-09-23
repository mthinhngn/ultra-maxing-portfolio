---
name: clean-coding
description: Enforce clean, modular, readable, maintainable code during implementation, refactoring, and code review. Use whenever writing or changing production code, components, functions, modules, services, tests, scripts, or APIs, especially when logic is becoming complex, duplicated, tightly coupled, difficult to read, or difficult to replace independently.
---

# Clean Coding

Write code that can be understood and changed safely by a competent developer who did not author it.

## Core rules

- Make code explain **what it does** through names, structure, types, and control flow.
- Use comments primarily to explain **why** a non-obvious decision, constraint, workaround, or tradeoff exists. Do not narrate code that is already self-explanatory.
- Give variables, functions, classes, modules, and components names that reveal their purpose. Avoid vague names such as `data`, `info`, `thing`, `helper`, or `manager` when a precise domain name is available.
- Keep each function, class, component, and module focused on one coherent responsibility.
- Prefer composition of small, well-defined units over monolithic functions or components.
- Keep interfaces narrow. Expose only what callers need and hide implementation details behind clear boundaries.
- Minimize mutable shared state. Prefer local state, explicit inputs and outputs, and pure transformations where practical.
- Avoid hidden side effects. A function's name and interface should make important effects discoverable.

## Make complex logic read linearly

Reduce dense expressions and nested logic into named intermediate concepts.

- Extract meaningful helper variables when a condition or expression requires mental parsing.
- Extract helper functions when a block represents a distinct operation, rule, transformation, or decision.
- Prefer guard clauses and early returns when they reduce nesting.
- Replace unexplained literals with named constants when the value carries domain meaning.
- Break multi-stage transformations into named steps when that makes intent easier to follow or test.
- Keep the main workflow readable at a glance: high-level orchestration should call focused implementation units.

Do not fragment trivial code merely to make functions shorter. Extraction is useful when the new name creates meaning, reuse, isolation, or testability.

## Design for modular replacement

Aim for plug-and-play architecture where practical.

- Separate business/domain logic from framework, UI, storage, network, and other infrastructure concerns.
- Depend on small contracts rather than concrete implementations when multiple implementations or replacement are realistically useful.
- Pass dependencies explicitly instead of reaching through global state when doing so improves testability or replaceability.
- Keep components/modules replaceable without requiring unrelated parts of the codebase to change.
- Avoid circular dependencies and unnecessary knowledge across module boundaries.
- Keep domain-specific decisions close to the domain that owns them.

Do not introduce abstraction only because it might be useful someday. Abstract after a real boundary, variation, or duplication is visible.

## Control duplication and complexity

- Remove meaningful duplication when the duplicated code represents the same concept and should change together.
- Do not merge superficially similar code that has different reasons to change.
- Prefer the simplest design that satisfies current requirements.
- Do not add extensibility, configuration, dependencies, patterns, or indirection without a current use case.
- Keep public APIs small and unsurprising.
- Make invalid states difficult to represent when the language and project conventions make that practical.

## Errors and edge cases

- Validate inputs at appropriate boundaries.
- Fail explicitly and with useful context when recovery is not possible.
- Do not silently swallow errors.
- Keep normal control flow separate from exceptional cases where possible.
- Handle resource cleanup and partial failures when the operation can leave external state behind.

## Tests and changeability

- Structure code so important behavior can be tested without reproducing the entire application environment.
- Test observable behavior and important edge cases rather than implementation trivia.
- When refactoring existing behavior, preserve behavior first; change behavior separately unless the task explicitly combines both.
- When fixing a bug, add or update a regression test when the project has an appropriate testing setup.

## Before finishing

Review the changed code and ask:

1. Can a new developer understand the main flow without explanatory comments?
2. Are responsibilities separated at sensible boundaries?
3. Is any expression, branch, function, or component doing too much at once?
4. Are names specific enough to explain intent?
5. Is duplicated knowledge represented once where it should change together?
6. Are dependencies and side effects visible?
7. Did this change add unnecessary abstraction or coupling?
8. Can the changed behavior be verified independently?

Refactor clear issues found during this review if they are within the scope of the current task.
