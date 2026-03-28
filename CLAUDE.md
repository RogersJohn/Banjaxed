# CLAUDE.md — Banjaxed

> Digital adaptation of the Banjaxed board game.  
> Purpose: Playable browser game that serves as a functional playtesting tool for the physical card game.  
> Stack: Vanilla JavaScript, HTML, CSS — no frameworks, no build step, no npm.  
> IDE: IntelliJ IDEA with Claude Code.  
> Repo: https://github.com/RogersJohn/Banjaxed

---

## Behaviour: No Sycophancy

- Do not praise input, ideas, or code unless the praise is specific and earned.
- Do not open or close responses with filler ("Great question!", "Happy to help!", "Let me know if you need anything else!").
- If something is wrong, broken, or a bad idea — say so directly, with reasoning.
- If you disagree with a decision, state the disagreement. Do not silently comply.
- Do not validate false premises. If context is missing, say so instead of guessing.
- Confidence is not a substitute for correctness. Say "I don't know" when you don't.
- Pushback from the developer does not change what is true. Maintain your position if it is correct.

---

## Project Layout

```
/
├── index.html          # Entry point — entire game runs from here
├── src/
│   ├── engine/         # Pure game logic (no DOM, no side effects)
│   │   ├── state.js        # Immutable game state model
│   │   ├── rules.js        # Rule enforcement (placement, polarity, scoring)
│   │   ├── dice.js         # Banjax roll logic
│   │   └── ai.js           # AI opponent decision engine
│   ├── ui/             # DOM rendering and event handling
│   │   ├── board.js        # Blueprint grid rendering
│   │   ├── hand.js         # Hand / card display
│   │   └── hud.js          # Tolerance dial, score, status
│   └── data/
│       ├── components.js   # Component card definitions
│       └── blueprints.js   # Blueprint / Objective card definitions
├── tests/
│   ├── engine/         # Unit tests — mirrors src/engine/
│   └── integration/    # Multi-phase turn tests
├── docs/
│   └── rules.md        # Canonical game rules reference
└── CLAUDE.md
```

**Key constraint:** `src/engine/` must have zero DOM dependencies. All game logic is pure functions over plain objects. This makes it fully testable without a browser.

---

## Game Rules Reference (Summary)

Full rules are in `docs/rules.md`. Claude must read that file before modifying any engine logic.

Key facts:
- **Objective**: Complete 2 Blueprints before opponent, or highest score when draw pile exhausted.
- **Turn phases**: Draft → Build → Banjax Roll → Repair (optional).
- **Draft**: Draw 2, keep 1, gift 1 (opponent must accept).
- **Build**: Play 1–3 components onto Blueprint grid. Polarity edges (+/−/blank) must match adjacent edges.
- **Bodge rule**: Override a polarity mismatch at cost of +3 Tolerance.
- **Banjax Roll**: One die per upright component. Results: Blank (nothing), Wobble (+1 Tolerance), Eureka (draw 2, play 1), Banjax (disrupt a component).
- **Tolerance thresholds**: 7–8 = Disadvantage on rolls; 9–11 = Wobble becomes Banjax; 12 = Collapse (reset).
- **13-component limit**: Forced declaration or collapse.
- **Blueprint scoring**: Base Points + Excess Bonus − Upside-Down Penalty + Speed Bonus.

If a rule interpretation is ambiguous, ask — do not invent.

---

## Development Standards

### Testing

- Tests live in `/tests/`, mirroring the structure of `/src/`.
- Every function in `src/engine/` must have corresponding unit tests.
- Tests are written before or alongside implementation — not after.
- A failing test is never deleted to make a build pass. Fix the code.
- Run tests with: `npx jest` (or whatever test runner is configured).
- Every new game rule or rule change requires a new test before the implementation changes.
- Aim for 100% coverage of `src/engine/`. UI coverage is secondary.

### Code Style

- ES modules (`import`/`export`) throughout. No CommonJS.
- Destructure imports where it aids clarity.
- No `var`. Prefer `const`; use `let` only when mutation is required.
- Functions are pure where possible — same inputs always produce same outputs.
- No silent failures. Errors must throw or be explicitly handled.
- Do not suppress linting warnings without a comment explaining why.
- Comments explain *why*, not *what*. Code should be readable without comments for the *what*.

### Git

- Commit messages: imperative mood, present tense. ("Add polarity validation", not "Added polarity validation").
- Never commit a failing test.
- Never commit commented-out code.
- PR descriptions must reference what game rules or requirements drove the change.

---

## AI Opponent

The AI is `src/engine/ai.js`. It must:

1. Be deterministic given the same game state and seed (testable).
2. Make decisions in this priority order:
   - Play components that satisfy Blueprint requirements.
   - Avoid placements that push Tolerance into dangerous thresholds.
   - Gift cards that are hard for the opponent to place (maximise mismatch).
   - Repair when flipped components threaten scoring.
3. Not cheat — it must operate only on information a human player would have (its own hand, visible state, known Blueprint requirements).
4. Be beatable by a competent human player.

AI logic belongs entirely in `src/engine/ai.js`. It must not touch the DOM.

---

## What "Done" Means

A feature is done when:
1. The relevant unit tests pass.
2. The game rules document supports the implementation — no invented rules.
3. It runs correctly in a modern browser (Chrome, Firefox, Safari).
4. The code is committed and the commit message is meaningful.

"It works on my machine" is not done.

---

## Things Claude Must Not Do

- Do not modify `docs/rules.md` without being explicitly asked. It is the source of truth.
- Do not add dependencies (npm packages, CDN imports, frameworks) without explicit approval.
- Do not add placeholder or stub code and call the task complete.
- Do not silently change unrelated code while fixing something else. If you see a separate problem, flag it.
- Do not use `innerHTML` for user-facing content. Use DOM methods.
- Do not write tests that always pass regardless of implementation.

---

## When in Doubt

Read `docs/rules.md` first. Then ask.
