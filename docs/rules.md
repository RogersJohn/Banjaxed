# Banjaxed — Official Rules

> A Game of Magnificent Contraptions and Spectacular Failure

## Overview

Two rival inventors compete to build elaborate mechanisms from components to fulfil secret Blueprints. Every component added is another point of failure — push your luck too far and the whole thing collapses.

## Objective

Complete **2 Blueprints** before your opponent, or have the **highest score** when the draw pile is exhausted.

---

## Components

### Component Types

| Category    | Types                                                                 | Count in Deck | Tolerance Cost |
|-------------|-----------------------------------------------------------------------|---------------|----------------|
| Common      | Spring, Gear, Piston, Cable, Wheel                                    | 10 each       | 0              |
| Specialist  | Lever, Pulley, Flywheel, Bellows, Pin, Cam, Ratchet, Worm Gear, Escapement, Crank | 5 each | 1 |
| Wildcard    | Widget                                                                | 10            | 0              |

**Total deck size:** 110 cards (50 common + 50 specialist + 10 widgets)

### Card Anatomy

Each component card has **4 edges** (top, right, bottom, left). Each edge has a polarity:

- **+** (positive) — connects to **−** edges
- **−** (negative) — connects to **+** edges
- **Blank** — dead end; nothing can connect to a blank edge
- **Star** (Widget only) — connects to any edge type

Standard (non-Widget) cards have **3 polarity edges** (+/−) and **1 blank edge**, randomly distributed.

---

## Setup

1. Shuffle the component deck.
2. Deal **2 Blueprint cards** to each player. Each player chooses 1 to keep (secretly) and returns the other to the Blueprint deck.
3. Deal **4 component cards** to each player as a starting hand.

---

## Turn Structure

Each round consists of four phases, in order:

### 1. Draft Phase

1. Each player draws **2 cards** from the deck.
2. Each player **keeps 1** and **gifts the other** to their opponent.
3. The opponent **must accept** the gifted card.
4. Gifted cards must be placed into the receiving player's mechanism if a valid placement exists. If no valid placement exists, the gifted card is discarded.

### 2. Build Phase

1. Play **1 to 3 components** from your hand onto your mechanism grid.
2. Each component must be placed **adjacent** to an existing component (or in any position if the mechanism is empty).
3. Adjacent edges must be **polarity-compatible**:
   - **+** connects to **−** (and vice versa)
   - **Star** connects to anything
   - **Blank** blocks — nothing can be placed adjacent to a blank edge
4. **Bodge Rule**: You may override a polarity mismatch (+ to + or − to −) at a cost of **+3 Tolerance**. Blank edge violations cannot be bodged.
5. Specialist components cost **+1 Tolerance** when placed.
6. You must play at least 1 card per turn. If your hand is empty, draw 1 card and play it.

### 3. Banjax Roll

Roll **one die per upright component** in your mechanism.

| Die Face | Probability | Effect |
|----------|-------------|--------|
| Blank    | 3/6 (50%)   | Nothing happens |
| Wobble   | 2/6 (33%)   | +1 Tolerance |
| Eureka   | 1/6 (17%)   | Draw 2 cards, play 1 to your mechanism, return the other to the deck |

#### Tolerance Thresholds (modify die results)

| Tolerance | Effect |
|-----------|--------|
| 0–6       | Normal rolls |
| 7–8       | **Disadvantage**: Blank results become Wobble |
| 9–11      | **Escalation**: Wobble results become **Banjax** (flip one upright component upside-down) |
| 12+       | **Collapse** (see below) |

### 4. Repair Phase (Optional)

You may perform **one** of the following by discarding a card from your hand:

- **Repair**: Flip one upside-down component back upright.
- **Reduce Tolerance**: Lower your Tolerance by 1.
- **Skip**: Do nothing.

---

## Special Rules

### Collapse

When Tolerance reaches **12 or higher**:

1. All **upside-down components** are removed from your mechanism.
2. Tolerance resets to **3**.
3. You draw a **new Blueprint** (the old one is lost).
4. Upright components remain.

### 13-Component Limit

When your mechanism reaches **13 components**:

- If your Blueprint is satisfied: you **must declare** it complete immediately.
- If your Blueprint is not satisfied: you **collapse** (see above).

### Widget (Wildcard)

- Star edges connect to **any** adjacent edge type.
- Widgets count as **any component type** for Blueprint requirements.
- Widgets score **0 points** when calculating Blueprint base score.

### Declaration

At the start of your Build phase, you may **declare** your Blueprint complete if all required components are present and upright in your mechanism.

- **Successful declaration**: Score the Blueprint (see Scoring).
- **Failed declaration** (requirements not met): **+3 Tolerance** penalty.

After a successful declaration:
1. Your mechanism is cleared.
2. Tolerance resets to 3.
3. You draw a new hand of 4 cards.
4. You receive a new Blueprint.

---

## Scoring

When a Blueprint is declared complete:

| Component          | Points |
|--------------------|--------|
| **Base Points**    | 1 per required component type fulfilled (Widgets score 0) |
| **Excess Bonus**   | +1 per extra upright component beyond the minimum required (max +3) |
| **Upside-Down Penalty** | −2 per upside-down component in the mechanism |

**Total = Base Points + Excess Bonus + Upside-Down Penalty**

### End-Game Scoring

The game ends when:
1. A player completes their **2nd Blueprint** (that player wins), or
2. The **draw pile is exhausted** (highest total score wins).

Ties are possible.

---

## Polarity Reference

| My Edge | Their Edge | Result |
|---------|------------|--------|
| +       | −          | Valid connection |
| −       | +          | Valid connection |
| +       | +          | Mismatch (can Bodge for +3 Tolerance) |
| −       | −          | Mismatch (can Bodge for +3 Tolerance) |
| blank   | anything   | Blocked (cannot place, cannot Bodge) |
| anything| blank      | Blocked (cannot place, cannot Bodge) |
| star    | anything   | Valid connection |
| anything| star       | Valid connection |
