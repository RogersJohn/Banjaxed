// Immutable game state model — pure functions, no DOM, no side effects

import { TYPES, COMMON_TYPES, SPECIALIST_TYPES, COMMON_COUNT, SPECIALIST_COUNT, WIDGET_COUNT, SPANNER_COUNT } from '../data/components.js';
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
  const edges = (type === 'widget')
    ? ['star', 'star', 'star', 'star']
    : (type === 'spanner')
      ? [null, null, null, null]
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
  for (let i = 0; i < SPANNER_COUNT; i++) deck.push(createCard(id++, 'spanner'));
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

export function createInitialState(playerCount = 2) {
  const deck = shuffle(buildDeck());
  const blueprintDeck = shuffle([...BLUEPRINTS]);

  return {
    deck,
    blueprintDeck,
    round: 0,
    phase: 'draft',
    playerCount,
    players: Array.from({ length: playerCount }, () => createPlayerState()),
    selectedHandCard: null,
    validPlacements: [],
    gameOver: false,
    log: [],
  };
}

export function dealStartingHands(state) {
  for (let i = 0; i < state.playerCount; i++) {
    let dealt = 0;
    while (dealt < 4 && state.deck.length > 0) {
      const card = state.deck.shift();
      if (card.type === 'spanner') {
        state.deck.push(card);
      } else {
        state.players[i].hand.push(card);
        dealt++;
      }
    }
  }
}

export function dealBlueprintChoices(state) {
  // Human player gets a choice
  state.players[0].blueprintChoices = [
    state.blueprintDeck.shift(),
    state.blueprintDeck.shift(),
  ];

  // Each AI picks the shorter blueprint from 2 options
  for (let i = 1; i < state.playerCount; i++) {
    const choices = [state.blueprintDeck.shift(), state.blueprintDeck.shift()];
    const chosen = choices[0].requires.length <= choices[1].requires.length ? choices[0] : choices[1];
    state.players[i].blueprint = chosen;
    state.blueprintDeck.push(choices[0] === chosen ? choices[1] : choices[0]);
  }
}

export function playerLabel(state, index) {
  if (index === 0) return 'You';
  return `Automaton ${index}`;
}
