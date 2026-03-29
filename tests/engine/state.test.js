import { describe, test, expect } from '@jest/globals';
import {
  generateEdges, createCard, buildDeck, shuffle,
  createPlayerState, createInitialState, dealStartingHands, dealBlueprintChoices
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

  test('non-widget cards have standard edges', () => {
    const card = createCard(0, 'spring');
    expect(card.edges.filter(e => e === 'blank')).toHaveLength(1);
  });
});

describe('buildDeck', () => {
  test('produces 110 cards', () => {
    const deck = buildDeck();
    expect(deck).toHaveLength(110);
  });

  test('has correct distribution of types', () => {
    const deck = buildDeck();
    const counts = {};
    for (const card of deck) {
      counts[card.type] = (counts[card.type] || 0) + 1;
    }
    // 5 common types x 10 each
    expect(counts.spring).toBe(10);
    expect(counts.gear).toBe(10);
    expect(counts.piston).toBe(10);
    expect(counts.cable).toBe(10);
    expect(counts.wheel).toBe(10);
    // 10 specialist types x 5 each
    expect(counts.lever).toBe(5);
    expect(counts.cam).toBe(5);
    // Widgets
    expect(counts.widget).toBe(10);
  });

  test('all cards have unique ids', () => {
    const deck = buildDeck();
    const ids = new Set(deck.map(c => c.id));
    expect(ids.size).toBe(110);
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
  test('creates a valid game state', () => {
    const state = createInitialState();
    expect(state.deck).toHaveLength(110);
    expect(state.blueprintDeck.length).toBeGreaterThan(0);
    expect(state.round).toBe(0);
    expect(state.phase).toBe('draft');
    expect(state.gameOver).toBe(false);
    expect(state.player.tolerance).toBe(3);
    expect(state.ai.tolerance).toBe(3);
  });
});

describe('dealBlueprintChoices', () => {
  test('gives player 2 choices and AI 1 blueprint', () => {
    const state = createInitialState();
    const initialBpCount = state.blueprintDeck.length;
    dealBlueprintChoices(state);
    expect(state.player.blueprintChoices).toHaveLength(2);
    expect(state.ai.blueprint).toBeDefined();
    expect(state.ai.blueprint.requires).toBeDefined();
    // 4 drawn (2 per player), 1 returned = net -3
    expect(state.blueprintDeck.length).toBe(initialBpCount - 3);
  });
});

describe('dealStartingHands', () => {
  test('deals 4 cards to each player', () => {
    const state = createInitialState();
    dealBlueprintChoices(state);
    const deckBefore = state.deck.length;
    dealStartingHands(state);
    expect(state.player.hand).toHaveLength(4);
    expect(state.ai.hand).toHaveLength(4);
    expect(state.deck.length).toBe(deckBefore - 8);
  });
});
