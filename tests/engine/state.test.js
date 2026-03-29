import { describe, test, expect } from '@jest/globals';
import {
  generateEdges, createCard, buildDeck, shuffle,
  createPlayerState, createInitialState, dealStartingHands, dealBlueprintChoices,
  playerLabel
} from '../../src/engine/state.js';

describe('generateEdges', () => {
  test('produces exactly 4 edges', () => {
    const edges = generateEdges();
    expect(edges).toHaveLength(4);
  });

  test('has exactly 1 blank and 3 polarity edges', () => {
    const edges = generateEdges();
    const blanks = edges.filter(e => e === 'blank');
    const polarity = edges.filter(e => e === '+' || e === '-');
    expect(blanks).toHaveLength(1);
    expect(polarity).toHaveLength(3);
  });

  test('polarity edges are + or -', () => {
    const edges = generateEdges();
    for (const e of edges) {
      expect(['+', '-', 'blank']).toContain(e);
    }
  });
});

describe('createCard', () => {
  test('creates a card with correct structure', () => {
    const card = createCard(42, 'gear');
    expect(card.id).toBe(42);
    expect(card.type).toBe('gear');
    expect(card.edges).toHaveLength(4);
    expect(card.upright).toBe(true);
  });

  test('widget cards have all star edges', () => {
    const card = createCard(0, 'widget');
    expect(card.edges).toEqual(['star', 'star', 'star', 'star']);
  });

  test('spanner cards have all null edges', () => {
    const card = createCard(0, 'spanner');
    expect(card.edges).toEqual([null, null, null, null]);
  });

  test('non-widget cards have standard edges', () => {
    const card = createCard(0, 'spring');
    expect(card.edges.filter(e => e === 'blank')).toHaveLength(1);
  });
});

describe('buildDeck', () => {
  test('produces 120 cards', () => {
    const deck = buildDeck();
    expect(deck).toHaveLength(120);
  });

  test('has correct distribution of types', () => {
    const deck = buildDeck();
    const counts = {};
    for (const card of deck) {
      counts[card.type] = (counts[card.type] || 0) + 1;
    }
    expect(counts.spring).toBe(10);
    expect(counts.gear).toBe(10);
    expect(counts.piston).toBe(10);
    expect(counts.cable).toBe(10);
    expect(counts.wheel).toBe(10);
    expect(counts.lever).toBe(5);
    expect(counts.cam).toBe(5);
    expect(counts.widget).toBe(10);
    expect(counts.spanner).toBe(10);
  });

  test('all cards have unique ids', () => {
    const deck = buildDeck();
    const ids = new Set(deck.map(c => c.id));
    expect(ids.size).toBe(120);
  });
});

describe('shuffle', () => {
  test('returns a new array with same elements', () => {
    const arr = [1, 2, 3, 4, 5];
    const shuffled = shuffle(arr);
    expect(shuffled).toHaveLength(5);
    expect(shuffled.sort()).toEqual([1, 2, 3, 4, 5]);
  });

  test('does not mutate original', () => {
    const arr = [1, 2, 3, 4, 5];
    const copy = [...arr];
    shuffle(arr);
    expect(arr).toEqual(copy);
  });
});

describe('createPlayerState', () => {
  test('returns correct initial values', () => {
    const state = createPlayerState();
    expect(state.hand).toEqual([]);
    expect(state.mechanism).toEqual({});
    expect(state.blueprint).toBeNull();
    expect(state.tolerance).toBe(3);
    expect(state.score).toBe(0);
    expect(state.blueprintsComplete).toBe(0);
    expect(state.cardsPlayedThisTurn).toBe(0);
  });

  test('does not have blueprintReceivedRound property', () => {
    const state = createPlayerState();
    expect(state).not.toHaveProperty('blueprintReceivedRound');
  });
});

describe('createInitialState', () => {
  test('default creates 2 players', () => {
    const state = createInitialState();
    expect(state.playerCount).toBe(2);
    expect(state.players).toHaveLength(2);
  });

  test('creates N players when specified', () => {
    for (const n of [2, 3, 4, 5]) {
      const state = createInitialState(n);
      expect(state.playerCount).toBe(n);
      expect(state.players).toHaveLength(n);
    }
  });

  test('does not have player or ai properties', () => {
    const state = createInitialState();
    expect(state).not.toHaveProperty('player');
    expect(state).not.toHaveProperty('ai');
  });

  test('creates a valid game state', () => {
    const state = createInitialState();
    expect(state.deck).toHaveLength(120);
    expect(state.blueprintDeck.length).toBeGreaterThan(0);
    expect(state.round).toBe(0);
    expect(state.phase).toBe('draft');
    expect(state.gameOver).toBe(false);
    expect(state.players[0].tolerance).toBe(3);
    expect(state.players[1].tolerance).toBe(3);
  });
});

describe('dealBlueprintChoices', () => {
  test('gives human 2 choices and each AI 1 blueprint', () => {
    const state = createInitialState();
    dealBlueprintChoices(state);
    expect(state.players[0].blueprintChoices).toHaveLength(2);
    expect(state.players[1].blueprint).toBeDefined();
    expect(state.players[1].blueprint.requires).toBeDefined();
  });

  test('handles 5 players correctly', () => {
    const state = createInitialState(5);
    const initialBpCount = state.blueprintDeck.length;
    dealBlueprintChoices(state);
    expect(state.players[0].blueprintChoices).toHaveLength(2);
    for (let i = 1; i < 5; i++) {
      expect(state.players[i].blueprint).toBeDefined();
    }
    // 2 for human + 2×4 AIs = 10 drawn, 4 returned = net 6
    expect(state.blueprintDeck.length).toBe(initialBpCount - 6);
  });
});

describe('dealStartingHands', () => {
  test('deals 4 cards to each player', () => {
    const state = createInitialState();
    dealBlueprintChoices(state);
    dealStartingHands(state);
    expect(state.players[0].hand).toHaveLength(4);
    expect(state.players[1].hand).toHaveLength(4);
  });

  test('deals 4 cards to each of N players', () => {
    const state = createInitialState(4);
    dealBlueprintChoices(state);
    dealStartingHands(state);
    for (let i = 0; i < 4; i++) {
      expect(state.players[i].hand).toHaveLength(4);
    }
  });

  test('never deals a spanner to starting hands', () => {
    for (let i = 0; i < 20; i++) {
      const state = createInitialState();
      dealBlueprintChoices(state);
      dealStartingHands(state);
      expect(state.players[0].hand.every(c => c.type !== 'spanner')).toBe(true);
      expect(state.players[1].hand.every(c => c.type !== 'spanner')).toBe(true);
    }
  });
});

describe('playerLabel', () => {
  test('returns You for index 0', () => {
    expect(playerLabel({}, 0)).toBe('You');
  });

  test('returns Automaton N for index N', () => {
    expect(playerLabel({}, 1)).toBe('Automaton 1');
    expect(playerLabel({}, 3)).toBe('Automaton 3');
  });
});
