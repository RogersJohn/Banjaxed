# BANJAXED

**A Game of Magnificent Contraptions and Spectacular Failure**

A digital adaptation of the Banjaxed card game, playable in the browser against an AI opponent.

## Play

Open `index.html` in any modern browser. No build step, no dependencies, no server required.

## About the Game

You are an eccentric inventor of questionable genius. Build elaborate mechanisms using springs, gears, pistons, and more exotic components to complete secret Blueprints — but every component you add is another point of catastrophic failure waiting to happen.

### Core Mechanics

- **Draft Phase**: Draw 2 cards, keep 1, gift the other to your rival. Gifting is never neutral — it's a weapon.
- **Build Phase**: Play 1–3 components from your hand onto your mechanism grid. Polarity edges (+/−) must match, or you Bodge at +3 Tolerance cost.
- **Banjax Roll**: Roll one die per upright component. Blanks do nothing, Wobbles raise Tolerance, Eurekas force you to play more cards, and at high Tolerance, things get worse.
- **Repair Phase**: Discard a card to flip a damaged component upright, or reduce Tolerance by 1.
- **13-Component Limit**: Hit 13 components and you must declare your Blueprint complete or collapse.

### Winning

Complete 2 Blueprints first, or have the highest score when the draw pile runs out.

## AI Opponent

The AI ("The Automaton") plays a competent game:

- Prioritizes components needed for its Blueprint
- Avoids dangerous Tolerance levels
- Gifts you cards that are hard to place
- Times declarations based on risk assessment
- Repairs strategically when flipped components threaten scoring

It won't play perfectly, but it will punish sloppy play.

## Game Rules

The complete rules document is included as `Banjaxed_Rules_v8.docx`. This digital version implements all core rules:

- Full polarity system (+/− edge matching with blank dead ends)
- Bodge rule (override polarity at +3 Tolerance)
- Widget wildcards (connect anywhere, count as any type, score zero)
- Tolerance thresholds (7–8 Disadvantage, 9–11 Wobble→Banjax, 12 Collapse)
- Blueprint completion with Base Points, Excess Bonus, and Upside-Down Penalty
- 13-component forced declaration/collapse
- Eureka card resolution
- Retrieval *(not yet implemented in digital version)*

## Tech

Single HTML file. Vanilla JavaScript. No frameworks, no build tools, no npm. The way games should ship.

## License

Game design © the original designers. Digital implementation provided as-is.

---

*All mechanisms depicted are fictional. Any resemblance to functioning engineering is unintentional and mildly alarming.*
