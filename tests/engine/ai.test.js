import { describe, test, expect } from '@jest/globals';
import {
  getNeededTypes, draftChoice, chooseBanjaxTarget,
  shouldDeclare, handleEureka, chooseGiftPlacement, shouldRetrieve
} from '../../src/engine/ai.js';

function makeAiState(overrides = {}) {
  return {
    hand: [],
    mechanism: {},
    blueprint: { name: 'Test', requires: ['gear', 'spring', 'cable'], basePoints: 3 },
    tolerance: 3,
    score: 0,
    blueprintsComplete: 0,
    cardsPlayedThisTurn: 0,
    ...overrides,
  };
}

function makeCard(id, type, edges) {
  return { id, type, edges: edges || ['star', 'star', 'star', 'star'], upright: true };
}

describe('getNeededTypes', () => {
  test('returns all required types when mechanism is empty', () => {
    const bp = { requires: ['gear', 'spring', 'cable'] };
    const needed = getNeededTypes(bp, {});
    expect(needed.sort()).toEqual(['cable', 'gear', 'spring']);
  });

  test('removes satisfied types', () => {
    const bp = { requires: ['gear', 'spring', 'cable'] };
    const mech = { '3_5': { type: 'gear', upright: true } };
    const needed = getNeededTypes(bp, mech);
    expect(needed.sort()).toEqual(['cable', 'spring']);
  });

  test('ignores flipped components', () => {
    const bp = { requires: ['gear', 'spring'] };
    const mech = { '3_5': { type: 'gear', upright: false } };
    const needed = getNeededTypes(bp, mech);
    expect(needed.sort()).toEqual(['gear', 'spring']);
  });

  test('handles duplicate requirements', () => {
    const bp = { requires: ['gear', 'gear', 'spring'] };
    const mech = { '3_5': { type: 'gear', upright: true } };
    const needed = getNeededTypes(bp, mech);
    expect(needed.sort()).toEqual(['gear', 'spring']);
  });
});

describe('draftChoice', () => {
  test('prefers needed types', () => {
    const ai = makeAiState();
    const cards = [
      makeCard(1, 'gear'),   // needed
      makeCard(2, 'lever'),  // not needed
    ];
    const choice = draftChoice(ai, cards);
    expect(choice.keep).toBe(0); // gear
    expect(choice.gift).toBe(1); // lever
  });

  test('prefers widgets over non-needed types', () => {
    const ai = makeAiState();
    const cards = [
      makeCard(1, 'lever'),
      makeCard(2, 'widget'),
    ];
    const choice = draftChoice(ai, cards);
    expect(choice.keep).toBe(1); // widget
    expect(choice.gift).toBe(0); // lever
  });
});

describe('chooseBanjaxTarget', () => {
  test('returns null when no upright components', () => {
    const ai = makeAiState({
      mechanism: { '3_5': { type: 'gear', upright: false } },
    });
    expect(chooseBanjaxTarget(ai)).toBeNull();
  });

  test('prefers non-needed components', () => {
    const ai = makeAiState({
      mechanism: {
        '3_5': { type: 'gear', upright: true },    // needed
        '3_6': { type: 'lever', upright: true },    // not needed
      },
    });
    // Should always pick lever since it's not in blueprint requires
    for (let i = 0; i < 20; i++) {
      expect(chooseBanjaxTarget(ai)).toBe('3_6');
    }
  });
});

describe('shouldDeclare', () => {
  test('returns false when blueprint not satisfied', () => {
    const ai = makeAiState({
      mechanism: { '3_5': { type: 'gear', upright: true } },
    });
    expect(shouldDeclare(ai)).toBe(false);
  });

  test('returns true when satisfied and at high component count', () => {
    const mech = {};
    // Fill mechanism with needed types and extras to reach 10
    const types = ['gear', 'spring', 'cable', 'lever', 'cam', 'pin', 'pulley', 'flywheel', 'bellows', 'crank'];
    types.forEach((t, i) => {
      mech[`3_${i}`] = { type: t, upright: true };
    });
    const ai = makeAiState({ mechanism: mech });
    expect(shouldDeclare(ai)).toBe(true);
  });
});

describe('handleEureka', () => {
  test('chooses needed type over non-needed', () => {
    const ai = makeAiState();
    const c1 = makeCard(1, 'gear');    // needed
    const c2 = makeCard(2, 'lever');   // not needed
    const result = handleEureka(ai, c1, c2);
    expect(result.play.type).toBe('gear');
    expect(result.ret.type).toBe('lever');
  });

  test('chooses widget over non-needed non-widget', () => {
    const ai = makeAiState();
    const c1 = makeCard(1, 'lever');
    const c2 = makeCard(2, 'widget');
    const result = handleEureka(ai, c1, c2);
    expect(result.play.type).toBe('widget');
    expect(result.ret.type).toBe('lever');
  });
});

describe('shouldRetrieve', () => {
  test('returns false (conservative stub)', () => {
    const ai = makeAiState({
      mechanism: {
        '3_5': { type: 'gear', upright: true },
        '3_6': { type: 'spring', upright: true },
        '4_6': { type: 'cable', upright: true },
      },
      tolerance: 10,
    });
    expect(shouldRetrieve(ai)).toBe(false);
  });
});

describe('chooseGiftPlacement', () => {
  test('returns null when no valid placements', () => {
    const ai = makeAiState({
      mechanism: {
        '3_5': { type: 'gear', edges: ['blank', 'blank', 'blank', 'blank'], upright: true },
      },
    });
    const card = makeCard(1, 'spring', ['+', '+', '+', '+']);
    // All edges of existing card are blank, so nothing can connect
    expect(chooseGiftPlacement(ai, card)).toBeNull();
  });

  test('returns a placement for empty mechanism', () => {
    const ai = makeAiState();
    const card = makeCard(1, 'spring', ['+', '-', '+', 'blank']);
    const result = chooseGiftPlacement(ai, card);
    expect(result).toBeDefined();
    expect(result.row).toBeDefined();
    expect(result.col).toBeDefined();
  });
});
