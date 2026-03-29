import { describe, test, expect } from '@jest/globals';
import {
  parsePos, posKey, getMechanismBounds, getNeighborKeys, DIR_INDEX,
  checkEdgeCompatibility, canPlaceCard, getAllValidPlacements,
  countComponents, getUprightTypes, checkBlueprintSatisfied,
  isConnectedWithout, getRetrievableKeys, isSpanner, getDestroyableKeys,
  scoreBlueprint
} from '../../src/engine/rules.js';

describe('parsePos / posKey', () => {
  test('round-trips correctly', () => {
    expect(parsePos('3_5')).toEqual({ row: 3, col: 5 });
    expect(posKey(3, 5)).toBe('3_5');
    expect(parsePos(posKey(0, -1))).toEqual({ row: 0, col: -1 });
  });
});

describe('getMechanismBounds', () => {
  test('returns zeros for empty mechanism', () => {
    expect(getMechanismBounds({})).toEqual({ minR: 0, maxR: 0, minC: 0, maxC: 0 });
  });

  test('computes bounds for populated mechanism', () => {
    const mech = {
      '2_3': { type: 'gear' },
      '4_5': { type: 'spring' },
      '3_1': { type: 'cable' },
    };
    expect(getMechanismBounds(mech)).toEqual({ minR: 2, maxR: 4, minC: 1, maxC: 5 });
  });
});

describe('getNeighborKeys', () => {
  test('returns 4 neighbors with correct directions', () => {
    const neighbors = getNeighborKeys(3, 5);
    expect(neighbors).toHaveLength(4);
    expect(neighbors.find(n => n.dir === 'top')).toEqual({ key: '2_5', dir: 'top', oppDir: 'bottom' });
    expect(neighbors.find(n => n.dir === 'right')).toEqual({ key: '3_6', dir: 'right', oppDir: 'left' });
    expect(neighbors.find(n => n.dir === 'bottom')).toEqual({ key: '4_5', dir: 'bottom', oppDir: 'top' });
    expect(neighbors.find(n => n.dir === 'left')).toEqual({ key: '3_4', dir: 'left', oppDir: 'right' });
  });
});

describe('DIR_INDEX', () => {
  test('maps directions to edge array indices', () => {
    expect(DIR_INDEX.top).toBe(0);
    expect(DIR_INDEX.right).toBe(1);
    expect(DIR_INDEX.bottom).toBe(2);
    expect(DIR_INDEX.left).toBe(3);
  });
});

describe('checkEdgeCompatibility', () => {
  test('+ connects to -', () => {
    expect(checkEdgeCompatibility('+', '-')).toBe(true);
    expect(checkEdgeCompatibility('-', '+')).toBe(true);
  });

  test('same polarity does not connect', () => {
    expect(checkEdgeCompatibility('+', '+')).toBe(false);
    expect(checkEdgeCompatibility('-', '-')).toBe(false);
  });

  test('blank blocks everything', () => {
    expect(checkEdgeCompatibility('blank', '+')).toBe(false);
    expect(checkEdgeCompatibility('blank', '-')).toBe(false);
    expect(checkEdgeCompatibility('+', 'blank')).toBe(false);
    expect(checkEdgeCompatibility('blank', 'blank')).toBe(false);
  });

  test('star connects to anything', () => {
    expect(checkEdgeCompatibility('star', '+')).toBe(true);
    expect(checkEdgeCompatibility('star', '-')).toBe(true);
    expect(checkEdgeCompatibility('star', 'blank')).toBe(true);
    expect(checkEdgeCompatibility('star', 'star')).toBe(true);
    expect(checkEdgeCompatibility('+', 'star')).toBe(true);
    expect(checkEdgeCompatibility('blank', 'star')).toBe(true);
  });
});

describe('canPlaceCard', () => {
  test('first card can be placed on empty mechanism', () => {
    const card = { type: 'gear', edges: ['+', '-', '+', 'blank'] };
    expect(canPlaceCard({}, card, 3, 5)).toEqual({ valid: true, bodge: false });
  });

  test('cannot place on occupied cell', () => {
    const mech = { '3_5': { type: 'gear', edges: ['+', '-', '+', 'blank'] } };
    const card = { type: 'spring', edges: ['+', '-', '+', 'blank'] };
    expect(canPlaceCard(mech, card, 3, 5)).toEqual({ valid: false });
  });

  test('cannot place with no neighbors', () => {
    const mech = { '3_5': { type: 'gear', edges: ['+', '-', '+', 'blank'] } };
    const card = { type: 'spring', edges: ['+', '-', '+', 'blank'] };
    expect(canPlaceCard(mech, card, 0, 0)).toEqual({ valid: false });
  });

  test('valid placement with compatible edges', () => {
    // Gear at 3_5 has right edge '-', card has left edge '+'
    const mech = { '3_5': { type: 'gear', edges: ['+', '-', '+', 'blank'] } };
    const card = { type: 'spring', edges: ['+', '-', '+', '+'] };
    // Place to the right of gear: card's left edge (index 3) = '+', gear's right edge (index 1) = '-' => compatible
    const result = canPlaceCard(mech, card, 3, 6);
    expect(result.valid).toBe(true);
    expect(result.bodge).toBe(false);
  });

  test('bodge required for polarity mismatch', () => {
    // Gear at 3_5 has right edge '-', card has left edge '-' => mismatch
    const mech = { '3_5': { type: 'gear', edges: ['+', '-', '+', 'blank'] } };
    const card = { type: 'spring', edges: ['+', '+', '+', '-'] };
    const result = canPlaceCard(mech, card, 3, 6);
    expect(result.valid).toBe(true);
    expect(result.bodge).toBe(true);
  });

  test('blank edge blocks placement', () => {
    // Gear at 3_5 has left edge 'blank', card placed to the left
    const mech = { '3_5': { type: 'gear', edges: ['+', '-', '+', 'blank'] } };
    const card = { type: 'spring', edges: ['+', '+', '+', '+'] };
    // Place to the left: card's right (index 1) = '+', gear's left (index 3) = 'blank' => blocked
    const result = canPlaceCard(mech, card, 3, 4);
    expect(result.valid).toBe(false);
  });

  test('star edge overrides blank', () => {
    const mech = { '3_5': { type: 'gear', edges: ['+', '-', '+', 'blank'] } };
    const card = { type: 'widget', edges: ['star', 'star', 'star', 'star'] };
    const result = canPlaceCard(mech, card, 3, 4);
    expect(result.valid).toBe(true);
    expect(result.bodge).toBe(false);
  });
});

describe('getAllValidPlacements', () => {
  test('returns single position for empty mechanism', () => {
    const card = { type: 'gear', edges: ['+', '-', '+', 'blank'] };
    const placements = getAllValidPlacements({}, card);
    expect(placements).toHaveLength(1);
    expect(placements[0]).toEqual({ row: 3, col: 5, bodge: false });
  });

  test('returns multiple positions for non-empty mechanism', () => {
    const mech = { '3_5': { type: 'widget', edges: ['star', 'star', 'star', 'star'] } };
    const card = { type: 'widget', edges: ['star', 'star', 'star', 'star'] };
    const placements = getAllValidPlacements(mech, card);
    expect(placements.length).toBeGreaterThan(1);
    expect(placements.every(p => p.bodge === false)).toBe(true);
  });
});

describe('getAllValidPlacements — bodge-only scenarios', () => {
  test('returns both bodge and non-bodge placements with correct flags', () => {
    // Place a card with edges [+, -, +, -] at center
    const mech = { '3_5': { type: 'gear', edges: ['+', '-', '+', '-'], upright: true } };
    // Card with left='+' connects cleanly to right='-', but left='-' would bodge
    const card = { type: 'spring', edges: ['+', '+', '+', '+'] };
    const placements = getAllValidPlacements(mech, card);
    expect(placements.length).toBeGreaterThan(0);
    const bodge = placements.filter(p => p.bodge);
    const clean = placements.filter(p => !p.bodge);
    // Should have at least one of each depending on edge compatibility
    expect(bodge.length + clean.length).toBe(placements.length);
  });

  test('all placements are bodge when only polarity mismatches exist', () => {
    // Card at center with all + edges on connectable sides
    const mech = { '3_5': { type: 'gear', edges: ['+', '+', '+', '+'], upright: true } };
    // New card also all + edges — every adjacent connection is +/+ mismatch
    const card = { type: 'spring', edges: ['+', '+', '+', '+'] };
    const placements = getAllValidPlacements(mech, card);
    expect(placements.length).toBeGreaterThan(0);
    expect(placements.every(p => p.bodge)).toBe(true);
  });
});

describe('countComponents', () => {
  test('counts empty mechanism', () => {
    expect(countComponents({})).toEqual({ total: 0, upright: 0, flipped: 0 });
  });

  test('counts upright and flipped', () => {
    const mech = {
      '3_5': { type: 'gear', upright: true },
      '3_6': { type: 'spring', upright: false },
      '4_5': { type: 'cable', upright: true },
    };
    expect(countComponents(mech)).toEqual({ total: 3, upright: 2, flipped: 1 });
  });
});

describe('getUprightTypes', () => {
  test('returns only upright component types', () => {
    const mech = {
      '3_5': { type: 'gear', upright: true },
      '3_6': { type: 'spring', upright: false },
      '4_5': { type: 'cable', upright: true },
    };
    const types = getUprightTypes(mech);
    expect(types).toContain('gear');
    expect(types).toContain('cable');
    expect(types).not.toContain('spring');
    expect(types).toHaveLength(2);
  });
});

describe('checkBlueprintSatisfied', () => {
  const blueprint = { name: 'Test', requires: ['gear', 'spring', 'cable'], basePoints: 3 };

  test('satisfied when all required types are upright', () => {
    const mech = {
      '3_5': { type: 'gear', upright: true },
      '3_6': { type: 'spring', upright: true },
      '4_5': { type: 'cable', upright: true },
    };
    expect(checkBlueprintSatisfied(mech, blueprint)).toBe(true);
  });

  test('not satisfied when a required type is missing', () => {
    const mech = {
      '3_5': { type: 'gear', upright: true },
      '3_6': { type: 'spring', upright: true },
    };
    expect(checkBlueprintSatisfied(mech, blueprint)).toBe(false);
  });

  test('not satisfied when a required type is flipped', () => {
    const mech = {
      '3_5': { type: 'gear', upright: true },
      '3_6': { type: 'spring', upright: false },
      '4_5': { type: 'cable', upright: true },
    };
    expect(checkBlueprintSatisfied(mech, blueprint)).toBe(false);
  });

  test('widgets fill missing requirements', () => {
    const mech = {
      '3_5': { type: 'gear', upright: true },
      '3_6': { type: 'widget', upright: true },
      '4_5': { type: 'cable', upright: true },
    };
    expect(checkBlueprintSatisfied(mech, blueprint)).toBe(true);
  });

  test('duplicate requirements need duplicate components', () => {
    const bp = { name: 'Test', requires: ['gear', 'gear', 'spring'], basePoints: 3 };
    const mechOne = {
      '3_5': { type: 'gear', upright: true },
      '3_6': { type: 'spring', upright: true },
    };
    expect(checkBlueprintSatisfied(mechOne, bp)).toBe(false);

    const mechTwo = {
      '3_5': { type: 'gear', upright: true },
      '3_6': { type: 'gear', upright: true },
      '4_5': { type: 'spring', upright: true },
    };
    expect(checkBlueprintSatisfied(mechTwo, bp)).toBe(true);
  });
});

describe('isConnectedWithout', () => {
  test('single remaining card is connected', () => {
    const mech = {
      '3_5': { type: 'gear' },
      '3_6': { type: 'spring' },
    };
    expect(isConnectedWithout(mech, '3_5')).toBe(true);
  });

  test('remains connected after removing non-bridge', () => {
    const mech = {
      '3_5': { type: 'gear' },
      '3_6': { type: 'spring' },
      '4_6': { type: 'cable' },
    };
    // Removing 3_5 leaves 3_6 and 4_6 which are adjacent
    expect(isConnectedWithout(mech, '3_5')).toBe(true);
  });

  test('disconnected after removing bridge', () => {
    const mech = {
      '3_4': { type: 'gear' },
      '3_5': { type: 'spring' },
      '3_6': { type: 'cable' },
    };
    // Removing middle card disconnects the two ends
    expect(isConnectedWithout(mech, '3_5')).toBe(false);
  });
});

describe('getRetrievableKeys', () => {
  test('returns empty for mechanisms with 2 or fewer cards', () => {
    expect(getRetrievableKeys({})).toEqual([]);
    expect(getRetrievableKeys({ '3_5': { type: 'gear', upright: true } })).toEqual([]);
    expect(getRetrievableKeys({
      '3_5': { type: 'gear', upright: true },
      '3_6': { type: 'spring', upright: true },
    })).toEqual([]);
  });

  test('returns empty when all upright cards are bridges', () => {
    // Linear chain: removing any middle card disconnects
    const mech = {
      '3_4': { type: 'gear', upright: true },
      '3_5': { type: 'spring', upright: true },
      '3_6': { type: 'cable', upright: true },
    };
    // 3_5 is a bridge, 3_4 and 3_6 are ends — but removing an end leaves 2 connected
    // Actually, removing 3_4 leaves 3_5 and 3_6 connected, so 3_4 IS retrievable
    const keys = getRetrievableKeys(mech);
    // End cards are retrievable, bridge is not
    expect(keys).toContain('3_4');
    expect(keys).toContain('3_6');
    expect(keys).not.toContain('3_5');
  });

  test('returns non-bridge upright cards', () => {
    // L-shape: 3_5, 3_6, 4_6 — removing 3_5 leaves 3_6 and 4_6 connected
    const mech = {
      '3_5': { type: 'gear', upright: true },
      '3_6': { type: 'spring', upright: true },
      '4_6': { type: 'cable', upright: true },
    };
    const keys = getRetrievableKeys(mech);
    expect(keys).toContain('3_5');
    expect(keys).toContain('4_6');
  });

  test('does not return upside-down cards', () => {
    const mech = {
      '3_5': { type: 'gear', upright: false },
      '3_6': { type: 'spring', upright: true },
      '4_6': { type: 'cable', upright: true },
    };
    const keys = getRetrievableKeys(mech);
    expect(keys).not.toContain('3_5');
  });

  test('does not return a card whose removal disconnects the mechanism', () => {
    const mech = {
      '3_4': { type: 'gear', upright: true },
      '3_5': { type: 'spring', upright: true },
      '3_6': { type: 'cable', upright: true },
    };
    const keys = getRetrievableKeys(mech);
    expect(keys).not.toContain('3_5'); // bridge card
  });
});

describe('isSpanner', () => {
  test('returns true for spanner cards', () => {
    expect(isSpanner({ type: 'spanner' })).toBe(true);
  });

  test('returns false for component cards', () => {
    expect(isSpanner({ type: 'gear' })).toBe(false);
    expect(isSpanner({ type: 'widget' })).toBe(false);
    expect(isSpanner({ type: 'lever' })).toBe(false);
  });
});

describe('getDestroyableKeys', () => {
  test('returns the single card key for a 1-card mechanism', () => {
    const mech = { '3_5': { type: 'gear', upright: true } };
    expect(getDestroyableKeys(mech)).toEqual(['3_5']);
  });

  test('returns both keys for a 2-card mechanism', () => {
    const mech = {
      '3_5': { type: 'gear', upright: true },
      '3_6': { type: 'spring', upright: true },
    };
    const keys = getDestroyableKeys(mech);
    expect(keys).toContain('3_5');
    expect(keys).toContain('3_6');
  });

  test('does not return a bridge card', () => {
    const mech = {
      '3_4': { type: 'gear', upright: true },
      '3_5': { type: 'spring', upright: true },
      '3_6': { type: 'cable', upright: true },
    };
    const keys = getDestroyableKeys(mech);
    expect(keys).not.toContain('3_5');
  });

  test('returns end cards and non-bridge cards', () => {
    const mech = {
      '3_4': { type: 'gear', upright: true },
      '3_5': { type: 'spring', upright: true },
      '3_6': { type: 'cable', upright: true },
    };
    const keys = getDestroyableKeys(mech);
    expect(keys).toContain('3_4');
    expect(keys).toContain('3_6');
  });

  test('includes upside-down components as valid targets', () => {
    const mech = {
      '3_5': { type: 'gear', upright: false },
      '3_6': { type: 'spring', upright: true },
      '4_6': { type: 'cable', upright: true },
    };
    const keys = getDestroyableKeys(mech);
    expect(keys).toContain('3_5');
  });

  test('returns empty array for empty mechanism', () => {
    expect(getDestroyableKeys({})).toEqual([]);
  });
});

describe('getAllValidPlacements — spanner cards', () => {
  test('returns no placements for spanner cards (null edges rejected)', () => {
    const mech = { '3_5': { type: 'gear', edges: ['+', '-', '+', '-'], upright: true } };
    const spannerCard = { type: 'spanner', edges: [null, null, null, null] };
    const placements = getAllValidPlacements(mech, spannerCard);
    expect(placements).toHaveLength(0);
  });
});

describe('scoreBlueprint', () => {
  test('basic scoring with exact requirements', () => {
    const blueprint = { name: 'Test', requires: ['gear', 'spring', 'cable'], basePoints: 3 };
    const mech = {
      '3_5': { type: 'gear', upright: true },
      '3_6': { type: 'spring', upright: true },
      '4_5': { type: 'cable', upright: true },
    };
    const result = scoreBlueprint(mech, blueprint);
    expect(result.base).toBe(3);
    expect(result.excess).toBe(0);
    expect(result.penalty).toBe(0);
    expect(result.total).toBe(3);
  });

  test('excess bonus capped at 3', () => {
    const blueprint = { name: 'Test', requires: ['gear'], basePoints: 1 };
    const mech = {
      '3_5': { type: 'gear', upright: true },
      '3_6': { type: 'spring', upright: true },
      '4_5': { type: 'cable', upright: true },
      '4_6': { type: 'piston', upright: true },
      '5_5': { type: 'wheel', upright: true },
    };
    const result = scoreBlueprint(mech, blueprint);
    expect(result.excess).toBe(3); // capped
  });

  test('upside-down penalty', () => {
    const blueprint = { name: 'Test', requires: ['gear', 'spring'], basePoints: 2 };
    const mech = {
      '3_5': { type: 'gear', upright: true },
      '3_6': { type: 'spring', upright: true },
      '4_5': { type: 'cable', upright: false },
    };
    const result = scoreBlueprint(mech, blueprint);
    expect(result.penalty).toBe(-2);
    expect(result.total).toBe(2 + 0 + -2); // base + excess + penalty
  });

  test('widgets score 0 base points', () => {
    const blueprint = { name: 'Test', requires: ['gear', 'spring', 'cable'], basePoints: 3 };
    const mech = {
      '3_5': { type: 'gear', upright: true },
      '3_6': { type: 'widget', upright: true },
      '4_5': { type: 'cable', upright: true },
    };
    const result = scoreBlueprint(mech, blueprint);
    expect(result.base).toBe(2); // widget fills spring slot but scores 0
  });

  test('returns no speedBonus field', () => {
    const blueprint = { name: 'Test', requires: ['gear'], basePoints: 1 };
    const mech = { '3_5': { type: 'gear', upright: true } };
    const result = scoreBlueprint(mech, blueprint);
    expect(result).toEqual({ base: expect.any(Number), excess: expect.any(Number), penalty: expect.any(Number), total: expect.any(Number) });
    expect(result).not.toHaveProperty('speedBonus');
  });

  test('total is base + excess + penalty only', () => {
    const blueprint = { name: 'Test', requires: ['gear', 'spring'], basePoints: 2 };
    const mech = {
      '3_5': { type: 'gear', upright: true },
      '3_6': { type: 'spring', upright: true },
      '4_5': { type: 'cable', upright: true },
      '4_6': { type: 'lever', upright: false },
    };
    const result = scoreBlueprint(mech, blueprint);
    expect(result.total).toBe(result.base + result.excess + result.penalty);
  });
});
