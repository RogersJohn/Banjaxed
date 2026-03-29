// AI opponent decision engine
// Deterministic given the same state and random seed. No DOM dependencies.
// Operates only on information a human player would have.

import { TYPES } from '../data/components.js';
import { getAllValidPlacements, countComponents, getUprightTypes, checkBlueprintSatisfied, posKey } from './rules.js';

export function getNeededTypes(blueprint, mechanism) {
  const have = getUprightTypes(mechanism);
  const needed = [...blueprint.requires];
  for (const h of have) {
    const idx = needed.indexOf(h);
    if (idx !== -1) needed.splice(idx, 1);
  }
  return needed;
}

export function draftChoice(aiState, drawnCards) {
  const needed = getNeededTypes(aiState.blueprint, aiState.mechanism);

  const scores = drawnCards.map((card, idx) => {
    let score = 0;
    if (needed.includes(card.type)) score += 10;
    if (card.type === 'widget') score += 5;
    if (TYPES[card.type].tol === 0) score += 2;
    const placements = getAllValidPlacements(aiState.mechanism, card);
    if (placements.some(p => !p.bodge)) score += 3;
    return { card, idx, score };
  });

  scores.sort((a, b) => b.score - a.score);
  return { keep: scores[0].idx, gift: scores[1].idx };
}

export function buildPhase(aiState, deck) {
  const actions = [];
  const maxPlay = 3;
  let played = 0;
  const needed = getNeededTypes(aiState.blueprint, aiState.mechanism);

  const sorted = [...aiState.hand].sort((a, b) => {
    const aNeeded = needed.includes(a.type) ? 0 : (a.type === 'widget' ? 1 : 2);
    const bNeeded = needed.includes(b.type) ? 0 : (b.type === 'widget' ? 1 : 2);
    return aNeeded - bNeeded;
  });

  for (const card of sorted) {
    if (played >= maxPlay) break;
    if (countComponents(aiState.mechanism).total >= 12) break;

    const placements = getAllValidPlacements(aiState.mechanism, card);
    if (placements.length === 0) continue;

    const good = placements.filter(p => !p.bodge);
    const chosen = good.length > 0 ? good[0] : placements[0];

    const tolCost = TYPES[card.type].tol + (chosen.bodge ? 3 : 0);
    if (aiState.tolerance + tolCost >= 10 && !needed.includes(card.type)) continue;

    const key = posKey(chosen.row, chosen.col);
    aiState.mechanism[key] = { ...card, upright: true };
    aiState.hand = aiState.hand.filter(c => c.id !== card.id);
    aiState.tolerance += tolCost;
    played++;

    actions.push({
      type: 'play',
      card,
      position: chosen,
      bodge: chosen.bodge,
    });

    const idx = needed.indexOf(card.type);
    if (idx !== -1) needed.splice(idx, 1);
  }

  if (played === 0 && aiState.hand.length > 0) {
    const card = aiState.hand[0];
    const placements = getAllValidPlacements(aiState.mechanism, card);
    if (placements.length > 0) {
      const chosen = placements.find(p => !p.bodge) || placements[0];
      const key = posKey(chosen.row, chosen.col);
      aiState.mechanism[key] = { ...card, upright: true };
      aiState.hand = aiState.hand.filter(c => c.id !== card.id);
      aiState.tolerance += TYPES[card.type].tol + (chosen.bodge ? 3 : 0);
      actions.push({ type: 'play', card, position: chosen, bodge: chosen.bodge });
    } else {
      aiState.hand.shift();
      actions.push({ type: 'discard', card });
    }
  }

  if (aiState.hand.length === 0 && deck.length > 0) {
    const card = deck.shift();
    const placements = getAllValidPlacements(aiState.mechanism, card);
    if (placements.length > 0) {
      const chosen = placements.find(p => !p.bodge) || placements[0];
      const key = posKey(chosen.row, chosen.col);
      aiState.mechanism[key] = { ...card, upright: true };
      aiState.tolerance += TYPES[card.type].tol + (chosen.bodge ? 3 : 0);
      actions.push({ type: 'draw-and-play', card, position: chosen, bodge: chosen.bodge });
    }
  }

  return actions;
}

export function chooseBanjaxTarget(aiState) {
  const keys = Object.keys(aiState.mechanism).filter(k => aiState.mechanism[k].upright);
  if (keys.length === 0) return null;

  const nonNeeded = keys.filter(k => !aiState.blueprint.requires.includes(aiState.mechanism[k].type));
  if (nonNeeded.length > 0) return nonNeeded[Math.floor(Math.random() * nonNeeded.length)];
  return keys[Math.floor(Math.random() * keys.length)];
}

export function repairPhase(aiState) {
  if (aiState.hand.length === 0) return null;

  const { flipped } = countComponents(aiState.mechanism);
  const needed = getNeededTypes(aiState.blueprint, aiState.mechanism);

  if (flipped > 0 && aiState.tolerance < 9) {
    const flippedKeys = Object.keys(aiState.mechanism).filter(k => !aiState.mechanism[k].upright);
    if (flippedKeys.length > 0) {
      const sorted = [...aiState.hand].sort((a, b) => {
        return (needed.includes(a.type) ? 1 : 0) - (needed.includes(b.type) ? 1 : 0);
      });
      aiState.hand = aiState.hand.filter(c => c.id !== sorted[0].id);
      aiState.mechanism[flippedKeys[0]].upright = true;
      return { type: 'repair', target: flippedKeys[0], discarded: sorted[0] };
    }
  }

  if (aiState.tolerance >= 7 && aiState.hand.length > 1) {
    const sorted = [...aiState.hand].sort((a, b) => {
      return (needed.includes(a.type) ? 1 : 0) - (needed.includes(b.type) ? 1 : 0);
    });
    aiState.hand = aiState.hand.filter(c => c.id !== sorted[0].id);
    aiState.tolerance--;
    return { type: 'reduce-tolerance', discarded: sorted[0] };
  }

  return null;
}

export function shouldDeclare(aiState) {
  if (checkBlueprintSatisfied(aiState.mechanism, aiState.blueprint)) {
    const counts = countComponents(aiState.mechanism);
    if (counts.total >= 10 || aiState.tolerance >= 8 || counts.upright >= aiState.blueprint.requires.length + 2) {
      return true;
    }
    if (Math.random() < 0.3 && counts.upright >= aiState.blueprint.requires.length) {
      return true;
    }
  }
  return false;
}

export function handleEureka(aiState, card1, card2) {
  const needed = getNeededTypes(aiState.blueprint, aiState.mechanism);
  const score1 = (needed.includes(card1.type) ? 10 : 0) + (card1.type === 'widget' ? 5 : 0);
  const score2 = (needed.includes(card2.type) ? 10 : 0) + (card2.type === 'widget' ? 5 : 0);
  return score1 >= score2 ? { play: card1, ret: card2 } : { play: card2, ret: card1 };
}

// TODO: Intentionally conservative pending playtesting — AI does not retrieve for now.
export function shouldRetrieve(aiState) {
  return false;
}

export function chooseGiftPlacement(aiState, card) {
  const placements = getAllValidPlacements(aiState.mechanism, card);
  if (placements.length === 0) return null;

  const good = placements.filter(p => !p.bodge);
  const chosen = good.length > 0 ? good[0] : (Math.random() < 0.5 ? placements[0] : null);
  return chosen;
}
