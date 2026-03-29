// Rule enforcement — placement, polarity, scoring
// Pure functions, no DOM, no side effects

export function parsePos(key) {
  const [r, c] = key.split('_').map(Number);
  return { row: r, col: c };
}

export function posKey(r, c) {
  return `${r}_${c}`;
}

export function getMechanismBounds(mech) {
  const keys = Object.keys(mech);
  if (keys.length === 0) return { minR: 0, maxR: 0, minC: 0, maxC: 0 };
  let minR = Infinity, maxR = -Infinity, minC = Infinity, maxC = -Infinity;
  for (const k of keys) {
    const { row, col } = parsePos(k);
    minR = Math.min(minR, row); maxR = Math.max(maxR, row);
    minC = Math.min(minC, col); maxC = Math.max(maxC, col);
  }
  return { minR, maxR, minC, maxC };
}

export function getNeighborKeys(r, c) {
  return [
    { key: posKey(r - 1, c), dir: 'top', oppDir: 'bottom' },
    { key: posKey(r, c + 1), dir: 'right', oppDir: 'left' },
    { key: posKey(r + 1, c), dir: 'bottom', oppDir: 'top' },
    { key: posKey(r, c - 1), dir: 'left', oppDir: 'right' },
  ];
}

export const DIR_INDEX = { top: 0, right: 1, bottom: 2, left: 3 };

export function checkEdgeCompatibility(cardEdge, neighborEdge) {
  if (cardEdge === 'star' || neighborEdge === 'star') return true;
  if (cardEdge === 'blank' || neighborEdge === 'blank') return false;
  return (cardEdge === '+' && neighborEdge === '-') || (cardEdge === '-' && neighborEdge === '+');
}

export function canPlaceCard(mech, card, row, col) {
  const key = posKey(row, col);
  if (mech[key]) return { valid: false };

  const mechKeys = Object.keys(mech);
  if (mechKeys.length === 0) return { valid: true, bodge: false };

  const neighbors = getNeighborKeys(row, col);
  let hasNeighbor = false;
  let polarityOk = true;
  let hasBlankViolation = false;

  for (const n of neighbors) {
    if (!mech[n.key]) continue;
    hasNeighbor = true;
    const nCard = mech[n.key];
    const myEdge = card.edges[DIR_INDEX[n.dir]];
    const theirEdge = nCard.edges[DIR_INDEX[n.oppDir]];

    if (myEdge === 'blank' || theirEdge === 'blank') {
      if (myEdge !== 'star' && theirEdge !== 'star') {
        hasBlankViolation = true;
      }
    } else if (!checkEdgeCompatibility(myEdge, theirEdge)) {
      polarityOk = false;
    }
  }

  if (!hasNeighbor) return { valid: false };
  if (hasBlankViolation) return { valid: false };
  if (!polarityOk) return { valid: true, bodge: true };
  return { valid: true, bodge: false };
}

export function getAllValidPlacements(mech, card) {
  const placements = [];
  const mechKeys = Object.keys(mech);

  if (mechKeys.length === 0) {
    placements.push({ row: 3, col: 5, bodge: false });
    return placements;
  }

  const { minR, maxR, minC, maxC } = getMechanismBounds(mech);
  for (let r = minR - 1; r <= maxR + 1; r++) {
    for (let c = minC - 1; c <= maxC + 1; c++) {
      const result = canPlaceCard(mech, card, r, c);
      if (result.valid) {
        placements.push({ row: r, col: c, bodge: result.bodge || false });
      }
    }
  }
  return placements;
}

export function countComponents(mech) {
  const keys = Object.keys(mech);
  let upright = 0, flipped = 0;
  for (const k of keys) {
    if (mech[k].upright) upright++; else flipped++;
  }
  return { total: keys.length, upright, flipped };
}

export function getUprightTypes(mech) {
  const types = [];
  for (const k of Object.keys(mech)) {
    if (mech[k].upright) types.push(mech[k].type);
  }
  return types;
}

export function checkBlueprintSatisfied(mech, blueprint) {
  const uprightTypes = getUprightTypes(mech);
  const available = [...uprightTypes];
  const required = [...blueprint.requires];

  for (let i = required.length - 1; i >= 0; i--) {
    const idx = available.indexOf(required[i]);
    if (idx !== -1) {
      available.splice(idx, 1);
      required.splice(i, 1);
    }
  }
  for (let i = required.length - 1; i >= 0; i--) {
    const widx = available.indexOf('widget');
    if (widx !== -1) {
      available.splice(widx, 1);
      required.splice(i, 1);
    }
  }
  return required.length === 0;
}

export function isConnectedWithout(mech, removeKey) {
  const keys = Object.keys(mech).filter(k => k !== removeKey);
  if (keys.length <= 1) return true;

  const visited = new Set();
  const queue = [keys[0]];
  visited.add(keys[0]);

  while (queue.length > 0) {
    const cur = queue.shift();
    const { row, col } = parsePos(cur);
    for (const n of getNeighborKeys(row, col)) {
      if (keys.includes(n.key) && !visited.has(n.key)) {
        visited.add(n.key);
        queue.push(n.key);
      }
    }
  }
  return visited.size === keys.length;
}

export function getRetrievableKeys(mech) {
  const keys = Object.keys(mech);
  if (keys.length <= 2) return [];
  return keys.filter(k => mech[k].upright && isConnectedWithout(mech, k));
}

export function scoreBlueprint(mech, blueprint) {
  const uprightTypes = getUprightTypes(mech);
  const available = [...uprightTypes];
  const required = [...blueprint.requires];
  let widgetsUsed = 0;

  for (let i = required.length - 1; i >= 0; i--) {
    const idx = available.indexOf(required[i]);
    if (idx !== -1) {
      available.splice(idx, 1);
      required.splice(i, 1);
    }
  }
  for (let i = required.length - 1; i >= 0; i--) {
    const widx = available.indexOf('widget');
    if (widx !== -1) {
      available.splice(widx, 1);
      required.splice(i, 1);
      widgetsUsed++;
    }
  }

  const basePoints = blueprint.requires.length - widgetsUsed;
  const { upright, flipped } = countComponents(mech);
  const minRequired = blueprint.requires.length;
  const excess = Math.min(3, upright - minRequired);
  const penalty = flipped > 0 ? flipped * -2 : 0;

  return {
    base: basePoints,
    excess: Math.max(0, excess),
    penalty,
    total: basePoints + Math.max(0, excess) + penalty,
  };
}
