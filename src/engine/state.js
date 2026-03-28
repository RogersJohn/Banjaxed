// Immutable game state model — pure functions, no DOM, no side effects

import { TYPES, COMMON_TYPES, SPECIALIST_TYPES, COMMON_COUNT, SPECIALIST_COUNT, WIDGET_COUNT } from '../data/components.js';
import { BLUEPRINTS } from '../data/blueprints.js';

export function generateEdges() {
  const symbols = [];
  for (let i = 0; i < 3; i++) symbols.push(Math.random() < 0.5 ? '+' : '-');
  symbols.push('blank');
  for (let i = symbols.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [symbols[i], symbols[j]] = [symbols[j], symbols[i]];
  }
  return symbols; // [top, right, bottom, left]
}

export function createCard(id, type) {
  const edges = type === 'widget'
    ? ['star', 'star', 'star', 'star']
    : generateEdges();
  return { id, type, edges, upright: true };
}

export function buildDeck() {
  const deck = [];
  let id = 0;
  for (const type of COMMON_TYPES) {
    for (let i = 0; i < COMMON_COUNT; i++) deck.push(createCard(id++, type));
  }
  for (const type of SPECIALIST_TYPES) {
    for (let i = 0; i < SPECIALIST_COUNT; i++) deck.push(createCard(id++, type));
  }
  for (let i = 0; i < WIDGET_COUNT; i++) deck.push(createCard(id++, 'widget'));
  return deck;
}

export function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function createPlayerState() {
  return {
    hand: [],
    mechanism: {},
    blueprint: null,
    tolerance: 3,
    score: 0,
    blueprintsComplete: 0,
    cardsPlayedThisTurn: 0,
  };
}

export function createInitialState() {
  const deck = shuffle(buildDeck());
  const blueprintDeck = shuffle([...BLUEPRINTS]);

  return {
    deck,
    blueprintDeck,
    round: 0,
    phase: 'draft',
    player: createPlayerState(),
    ai: createPlayerState(),
    selectedHandCard: null,
    validPlacements: [],
    gameOver: false,
    log: [],
  };
}

export function dealStartingHands(state) {
  for (let i = 0; i < 4; i++) {
    state.player.hand.push(state.deck.shift());
    state.ai.hand.push(state.deck.shift());
  }
}

export function dealBlueprintChoices(state) {
  const playerChoices = [state.blueprintDeck.shift(), state.blueprintDeck.shift()];
  state.player.blueprintChoices = playerChoices;

  const aiChoices = [state.blueprintDeck.shift(), state.blueprintDeck.shift()];
  state.ai.blueprint = aiChoices[0].requires.length <= aiChoices[1].requires.length
    ? aiChoices[0]
    : aiChoices[1];
  state.blueprintDeck.push(aiChoices[0] === state.ai.blueprint ? aiChoices[1] : aiChoices[0]);
}
