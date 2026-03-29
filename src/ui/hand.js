// Hand / card display — DOM rendering for the player's hand

import { renderCardHTML } from './board.js';

export function renderHand(state) {
  const hand = document.getElementById('player-hand');
  const human = state.players[0];

  if (state.phase === 'build') {
    hand.innerHTML = human.hand.map(card =>
      renderCardHTML(card, state.selectedHandCard === card.id, `selectHandCard(${card.id})`)
    ).join('');
  } else if (state.phase === 'repair') {
    hand.innerHTML = human.hand.map(card =>
      renderCardHTML(card, state.selectedRepairCard === card.id, `selectRepairCard(${card.id})`)
    ).join('');
  } else {
    hand.innerHTML = human.hand.map(card => {
      const spannerClick = card.type === 'spanner' ? `selectHandCard(${card.id})` : '';
      return renderCardHTML(card, false, spannerClick);
    }).join('');
  }
}
