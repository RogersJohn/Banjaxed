// Hand / card display — DOM rendering for the player's hand

import { renderCardHTML } from './board.js';

export function renderHand(state) {
  const hand = document.getElementById('player-hand');
  if (state.phase === 'build' || state.phase === 'repair') {
    hand.innerHTML = state.player.hand.map(card =>
      renderCardHTML(card, state.selectedHandCard === card.id, `selectHandCard(${card.id})`)
    ).join('');
  } else {
    hand.innerHTML = state.player.hand.map(card =>
      renderCardHTML(card, false, '')
    ).join('');
  }
}
