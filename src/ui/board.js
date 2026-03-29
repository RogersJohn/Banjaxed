// Blueprint grid rendering — DOM rendering for the mechanism board

import { TYPES } from '../data/components.js';
import { getMechanismBounds, posKey, getDestroyableKeys } from '../engine/rules.js';

export function renderEdgeSymbols(card) {
  const dirs = ['top', 'right', 'bottom', 'left'];
  return dirs.map((dir, i) => {
    const edge = card.edges[i];
    let cls, label;
    if (edge === null) { cls = 'edge-blank'; label = ''; }
    else if (edge === '+') { cls = 'edge-plus'; label = '+'; }
    else if (edge === '-') { cls = 'edge-minus'; label = '\u2212'; }
    else if (edge === 'blank') { cls = 'edge-blank'; label = '\u25CB'; }
    else { cls = 'edge-star'; label = '\u2605'; }
    return `<div class="edge-symbol ${dir} ${cls}">${label}</div>`;
  }).join('');
}

export function renderCardHTML(card, selected, onclick) {
  const t = TYPES[card.type];

  if (card.type === 'spanner') {
    return `<div class="component-card spanner-card ${selected ? 'selected' : ''}" onclick="${onclick}" style="border-color:var(--spanner); background:linear-gradient(135deg, #3d2e18, #2a2218);">
      <div class="card-type-icon" style="font-size:28px;">${t.icon}</div>
      <div class="card-type-name" style="color:var(--spanner); font-weight:600;">SPANNER</div>
      <div style="font-size:8px; color:var(--text-dim); line-height:1.3; margin-top:2px;">DESTROY / FIX / REDUCE TOL</div>
    </div>`;
  }

  return `<div class="component-card ${selected ? 'selected' : ''}" onclick="${onclick}">
    ${renderEdgeSymbols(card)}
    <div class="card-type-icon">${t.icon}</div>
    <div class="card-type-name" style="color:${t.color}">${t.name}</div>
    <div class="card-tol">${t.tol > 0 ? '+' + t.tol : ''}</div>
  </div>`;
}

function renderCardInGrid(card, onclick) {
  const t = TYPES[card.type];
  const cls = card.upright ? '' : 'upside-down';
  const clickAttr = onclick
    ? `onclick="${onclick}" style="cursor:pointer; border-color:${card.upright ? 'var(--danger)' : 'var(--success)'}"`
    : '';

  return `<div class="component-card ${cls}" ${clickAttr}>
    ${renderEdgeSymbols(card)}
    <div class="card-type-icon">${t.icon}</div>
    <div class="card-type-name" style="color:${t.color}">${t.name}</div>
    <div class="card-tol">${t.tol > 0 ? '+' + t.tol : ''}</div>
  </div>`;
}

export function renderMechanism(state) {
  const container = document.getElementById('player-mechanism');
  const mech = state.players[0].mechanism;
  const keys = Object.keys(mech);

  let bounds;
  if (keys.length === 0) {
    bounds = { minR: 2, maxR: 4, minC: 4, maxC: 6 };
  } else {
    bounds = getMechanismBounds(mech);
    bounds.minR -= 1; bounds.maxR += 1;
    bounds.minC -= 1; bounds.maxC += 1;
  }

  const rows = bounds.maxR - bounds.minR + 1;
  const cols = bounds.maxC - bounds.minC + 1;

  let html = `<div class="mechanism-grid" style="grid-template-columns: repeat(${cols}, 82px); grid-template-rows: repeat(${rows}, 102px);">`;

  for (let r = bounds.minR; r <= bounds.maxR; r++) {
    for (let c = bounds.minC; c <= bounds.maxC; c++) {
      const key = posKey(r, c);
      const card = mech[key];

      if (card) {
        const isClickable = state.phase === 'banjax-choice' && card.upright;
        const isRepairable = state.phase === 'repair' && !card.upright;
        const isRetrievable = state.phase === 'retrieve' && state.validRetrievals && state.validRetrievals.includes(key);
        const isSpannerTarget = state.phase === 'spanner-target' && state._spannerTargetPlayerIndex === 0 && state.pendingSpanner && (
          (state.pendingSpanner.action === 'destroy' && getDestroyableKeys(mech).includes(key)) ||
          (state.pendingSpanner.action === 'fix' && !card.upright)
        );
        let onclick = null;
        if (isClickable) onclick = `chooseBanjaxTarget('${key}')`;
        else if (isRepairable) onclick = `repairFlip('${key}')`;
        else if (isRetrievable) onclick = `retrieveCard('${key}')`;
        else if (isSpannerTarget) onclick = `executeSpanner('${key}', 0)`;
        html += `<div class="grid-cell occupied">
          <div class="placed-card">
            ${renderCardInGrid(card, onclick)}
          </div>
        </div>`;
      } else {
        let placementClass = '';
        let onclick = '';

        if (state.phase === 'build' && state.selectedHandCard !== null) {
          const p = state.validPlacements.find(p => p.row === r && p.col === c);
          if (p) {
            placementClass = p.bodge ? 'bodge-placement' : 'valid-placement';
            onclick = `placeCardAtPosition(${r}, ${c})`;
          }
        } else if (state.phase === 'place-gift' && state._giftPlacements) {
          const p = state._giftPlacements.find(p => p.row === r && p.col === c);
          if (p) {
            placementClass = p.bodge ? 'bodge-placement' : 'valid-placement';
            onclick = `placeGiftAtPosition(${r}, ${c})`;
          }
        }

        html += `<div class="grid-cell ${placementClass}" ${onclick ? `onclick="${onclick}"` : ''}></div>`;
      }
    }
  }

  html += '</div>';
  container.innerHTML = html;
}
