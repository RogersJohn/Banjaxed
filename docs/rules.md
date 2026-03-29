# Banjaxed — Official Rules

> A Game of Magnificent Contraptions and Spectacular Failure  
> First Edition — Version 1.0  
> 2–5 Players | 45–90 Minutes | Ages 10+

---

## Overview

Players are eccentric inventors racing to complete Blueprint Cards using increasingly unwieldy contraptions. Every component added to your mechanism makes it more powerful and more fragile simultaneously. Other players can gift you components you never asked for, sabotaging your machine with weaponised generosity.

The game ends when one player completes 2 Blueprints, or when the draw pile is exhausted — at which point the player with the highest cumulative score wins.

---

## Components

### Component Cards (120 cards)

| Category   | Types                                                                               | Count in Deck | Tolerance Cost |
|------------|-------------------------------------------------------------------------------------|---------------|----------------|
| Common     | Spring, Gear, Piston, Cable, Wheel                                                  | 10 each       | 0              |
| Specialist | Lever, Pulley, Flywheel, Bellows, Pin, Cam, Ratchet, Worm Gear, Escapement, Crank  | 5 each        | 1              |
| Wildcard   | Widget                                                                              | 10            | 0              |
| Spanner    | Spanner                                                                             | 10            | 0              |

**Total deck size:** 120 cards (50 common + 50 specialist + 10 widgets + 10 spanners)

### Card Anatomy

Each component card has **4 edges** (top, right, bottom, left). Each edge has a polarity:

- **+** (positive) — connects to **−** edges only
- **−** (negative) — connects to **+** edges only
- **Blank** — dead end; nothing can connect to a blank edge in either direction
- **★ (Star)** (Widget only) — connects to any edge type without restriction

Standard (non-Widget) cards have **exactly 3 polarity edges** (+/−) and **1 blank edge**, in a unique layout per physical card. Copies of the same type have different edge layouts.

### Other Components

- **Blueprint Cards (30)** — Secret mission cards. Each describes a machine to build.
- **Banjax Dice (15)** — Custom six-sided dice; one rolled per upright component per roll.
- **Tolerance Dials (5)** — Personal dials numbered 1–12.
- **Player Blueprints (5)** — Personal tableaux where component cards are physically arranged.
- **Reference Cards (5)** — Per-player quick reference of die faces, thresholds, and turn structure.

---

## Setup

1. Shuffle all 120 cards (110 Component Cards + 10 Spanners) into the draw pile, face-down in the centre.
2. Shuffle all 30 Blueprint Cards. Deal **2 to each player** face-down. Each player reads both privately, **keeps 1**, and returns the other face-down to the **bottom** of the Blueprint deck. Kept Blueprints remain secret.
3. Each player draws **4 Component Cards** as their starting hand.
4. Each player sets their Tolerance Dial to **3**.
5. The player who most recently broke something valuable goes first.

---

## Turn Structure

Each round has a **simultaneous Draft Phase**, followed by **Build**, **Banjax Roll**, and **Repair** phases resolved in **clockwise order**.

---

### Phase 1 — Draft (Simultaneous)

All players draw **2 Component Cards** from the top of the draw pile at the same time. Each player **keeps 1** and **passes the other face-up** to their immediate **left or right neighbour** — their choice. The recipient must add the gifted card to their mechanism immediately, subject to polarity and placement rules (see Gifting Rule, below).

**Retrieval (optional):** Once per Draft Phase, each player may remove one **upright** card from their mechanism and return it to their hand. This can be done before or after keeping and gifting. The retrieved card carries its edge configuration with it and must be legally placed again if replayed.

A card may only be retrieved if removing it leaves every remaining card in the mechanism with at least one edge-adjacent neighbour — **the mechanism must stay physically connected**. You cannot retrieve a card that acts as the only bridge between two parts of your mechanism. A two-card mechanism cannot have either card retrieved. **Upside-down cards cannot be retrieved.**

---

### Phase 2 — Build

In clockwise order, each player plays **1 to 3 Component Cards** from their hand onto their Blueprint tableau. Each card played raises the player's Tolerance dial by the card's Tolerance cost. Polarity rules and Placement Conditions must be satisfied, or the Bodge rule applied (see below).

**You must play at least 1 card if you have any in hand.** If your hand is empty, draw 1 card and play it immediately.

> **The 13-Component Limit**
>
> At the start of your Build Phase, if your mechanism contains **13 or more components** (upright and upside-down combined), you must immediately **declare Complete** — or **collapse**.
>
> - **Declare:** If your upright components satisfy your Blueprint, declare Complete and score normally.
> - **Collapse:** If you cannot satisfy your Blueprint, you collapse immediately — all upside-down components are discarded, upright components survive, Tolerance resets to 3, and you draw a new Blueprint.
>
> The 13-component check happens **before you play any cards** that turn. If a gifted card or a Eureka card pushes your mechanism to 13, the forced declaration or collapse triggers at the **start of your next Build Phase**. There is no grace period and no exception.

---

### Phase 3 — The Banjax Roll

After building, each player in clockwise order rolls **one Banjax Die per upright component** in their mechanism. Upside-down components do not add dice.

| Die Face    | Probability | Effect |
|-------------|-------------|--------|
| **Blank**   | 3/6 (50%)   | No effect. |
| **Wobble**  | 2/6 (33%)   | +1 to your Tolerance dial. |
| **Eureka!** | 1/6 (17%)   | Draw 2 cards from the top of the deck. Immediately play 1 onto your Blueprint (obeying all polarity and placement rules, or Bodging). Return the other to the **top or bottom** of the deck. If playing the card pushes your mechanism to 13, the forced declaration or collapse triggers at the start of your **next Build Phase**. Resolve multiple Eurekas one at a time. |

**What is a Banjax?** When a Banjax result occurs, the rolling player chooses one of their own upright components and flips it **upside-down**. An upside-down component contributes nothing to Blueprint completion until repaired.

#### Tolerance Thresholds

| Tolerance | Effect |
|-----------|--------|
| 1–6       | Normal rolls. |
| 7–8       | **Disadvantage:** all Blank results become Wobbles instead. |
| 9–11      | **Escalation:** every Wobble result becomes a **Banjax**. |
| 12+       | **Collapse!** All upside-down components are discarded. Upright components survive. Tolerance resets to 3. Discard your Blueprint and draw a new one. You are not eliminated. |

---

### Phase 4 — Repair (Optional)

Each player may discard **1 card from their hand** to do **one** of the following:

- Flip one of your upside-down components **upright**.
- Reduce your Tolerance dial by **1**.

You may not do both in the same turn. Repair is optional.

---

## Special Rules

### The Gifting Rule

When you pass a card during the Draft Phase, it goes to your **immediate left or right neighbour** — your choice. You cannot gift to any other player.

The recipient must place the gifted card into their mechanism subject to all polarity and placement rules. If the card is **unplaceable** — meaning no valid position exists even with a Bodge — they may discard it with no penalty. **If a Bodge position exists, they may choose to Bodge or discard; the choice is always theirs.**

The 13-component limit makes gifting sharper. Pushing a neighbour to 13 forces an immediate declaration or collapse at their next Build Phase. Each copy of a card has a unique edge layout — choosing which card to pass, and to which neighbour, is a genuine tactical decision.

### Polarity Rules

- **+ connects only to −**
- **− connects only to +**
- **Blank edges are dead ends** — nothing may connect to a blank edge, and a card may not connect outward through its own blank edge. This applies in both directions.
- **All touching edges must obey polarity simultaneously.** If a card has two neighbours, both touching edges must be polarity-legal. There are no exceptions except the Bodge rule.

### The Bodge Rule

If no polarity-legal position exists for a card — or if you choose to place it somewhere that violates +/− matching — you may Bodge it:

- **+3 Tolerance** immediately.
- The card is placed ignoring +/− mismatches and any Placement Conditions.
- **Blank edges cannot be Bodged.** A card may never connect through a blank edge, even with a Bodge. If all available positions require a blank-edge connection, the card is unplaceable.
- **Unplaceable cards:** If no valid position exists even with a Bodge, the player may discard the card with no penalty. If a Bodge position exists, the player **may choose to Bodge or discard** — always their choice.
- **One Bodge covers everything:** A single +3 Tolerance payment overrides both polarity mismatches and Placement Conditions for that card.

### Widgets (Wildcard)

- **Polarity-free:** Widget edges (★) connect to any edge on any neighbouring card — +, −, or blank — without restriction.
- **Placement-free:** Widgets ignore all Placement Conditions and may be placed anywhere in your mechanism.
- **Type-flexible:** A Widget counts as **any component type** for satisfying Blueprint requirements.
- **Score zero:** Widgets contribute 0 base points at declaration, even when used to satisfy a required slot. They can contribute to the Excess Bonus as extra upright cards.
- **Upside-down penalty applies:** An upside-down Widget costs −2 points at declaration, the same as any other component.
- **Count toward the 13-component limit.**
- **Can be retrieved** during the Draft Phase under the same rules as any upright card, subject to the connectivity constraint.

### Spanners in the Works

10 Spanner Cards are shuffled into the main deck at setup (total deck: 120 cards). Spanners are action cards — they are **never placed in your mechanism**, never count toward the 13-component limit, and are discarded immediately after use.

**When to play:** On your own turn, at any point — before, during, or after any phase. On an opponent's turn, only in response to something that just happened (a component placed, a Banjax result, a Eureka card played). You cannot play a Spanner speculatively between opponents' turns.

**Playing a Spanner is free.** No Tolerance cost. Does not count as a card play. You may hold any number of Spanners.

#### The Three Actions

**DESTROY** — Remove one component from any player's mechanism and discard it permanently. You may target any upright or upside-down component. You may not destroy a bridge card — the connectivity rule applies exactly as in Retrieval.

**FIX** — Flip any one upside-down component in any player's mechanism back to upright. No polarity check. Can target any player including yourself.

**REDUCE TOLERANCE** — Reduce any one player's Tolerance dial by 2 (minimum 1). Can target any player including yourself.

### Adjacency & Connectivity

Adjacency is determined by **shared edges only** — diagonal contact does not count.

Cards may be placed in any orientation (portrait or landscape). Your mechanism may sprawl as far as the table allows — there is no size limit on the tableau, only the 13-component limit.

**Connectivity:** Your mechanism must always remain a **single connected group** — every card must have at least one edge-adjacent neighbour. You cannot remove a card during Retrieval if doing so would leave any other card isolated. A card that acts as the only bridge between two clusters cannot be retrieved.

### Collapse

When Tolerance reaches **12 or higher**:

1. All **upside-down components** are removed and discarded.
2. **Upright components survive** in your mechanism.
3. Tolerance resets to **3**.
4. Discard your Blueprint and draw a **new Blueprint Card**.
5. You are not eliminated.

---

## Completing a Blueprint (Declaration)

At the **start of your Build Phase**, you may declare Complete if your upright components satisfy your Blueprint.

- **Reveal** your Blueprint. Count **only upright components**. Widgets count as any component type.
- **Successful declaration:** Score the Blueprint (see Scoring). Then discard your entire mechanism, reset Tolerance to 3, draw a new Blueprint Card, and draw 4 new Component Cards.
- **Failed declaration** (upright components do not satisfy the Blueprint): **+3 Tolerance** immediately. The Blueprint remains secret.

---

## Scoring

When a Blueprint is declared complete:

| Component               | Points |
|-------------------------|--------|
| **Base Points**         | 1 per specific (non-Widget) required component satisfied. Widgets used to fill slots score 0 for those slots. |
| **Excess Bonus**        | +1 per upright component beyond the minimum required, up to a maximum of **+3**. |
| **Upside-Down Penalty** | −2 per upside-down component in the mechanism, including upside-down Widgets. |

**Total = Base Points + Excess Bonus + Upside-Down Penalty**

---

## Winning

**Blueprint Victory:** The first player to complete **2 Blueprints** wins immediately.

**Score Victory:** If the draw pile is exhausted before anyone completes 2 Blueprints, the player with the **highest cumulative score** wins. Tiebreaker: **fewest components** currently in their mechanism.

---

## Polarity Reference

| My Edge  | Their Edge | Result |
|----------|------------|--------|
| +        | −          | Valid connection |
| −        | +          | Valid connection |
| +        | +          | Mismatch — can Bodge for +3 Tolerance |
| −        | −          | Mismatch — can Bodge for +3 Tolerance |
| blank    | anything   | Blocked — cannot place, cannot Bodge |
| anything | blank      | Blocked — cannot place, cannot Bodge |
| ★        | anything   | Valid connection (Widget only) |
| anything | ★          | Valid connection (Widget only) |

---

## Banjax Dice — Quick Reference

| Result  | Faces | Effect |
|---------|-------|--------|
| Blank   | 3     | No effect. |
| Wobble  | 2     | +1 Tolerance. At Tolerance 9–11, becomes Banjax instead. |
| Eureka! | 1     | Draw 2 cards, play 1 immediately (all rules apply, or Bodge), return the other to top or bottom of deck. |

| Tolerance | Effect |
|-----------|--------|
| 1–6       | Normal rolling. One Banjax Die per upright component. |
| 7–8       | Disadvantage: all Blank results become Wobbles. |
| 9–11      | All Wobble results become Banjaxes. |
| 12+       | Collapse! Upside-down cards discarded. Upright cards survive. Tolerance resets to 3. New Blueprint drawn. |
