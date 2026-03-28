// Tolerance dial, score, status, and general UI helpers

import { TYPES } from '../data/components.js';
import { countComponents, getUprightTypes, checkBlueprintSatisfied } from '../engine/rules.js';

export function renderPlayerInfo(state) {
  document.getElementById('player-bp-count').textContent = `${state.player.blueprintsComplete}/2`;
  document.getElementById('player-score').textContent = state.player.score;

  const tol = state.player.tolerance;
  const pct = Math.min(100, (tol / 12) * 100);
  document.getElementById('player-tol-fill').style.width = pct + '%';
  document.getElementById('player-tol-num').textContent = tol;
  const tolDisplay = document.getElementById('player-tol-display');
  tolDisplay.className = 'tolerance-display ' + (tol <= 6 ? 'tol-safe' : tol <= 8 ? 'tol-warn' : 'tol-danger');

  const bpDiv = document.getElementById('player-blueprint');
  if (state.player.blueprint) {
    const bp = state.player.blueprint;
    const uprightTypes = getUprightTypes(state.player.mechanism);
    const available = [...uprightTypes];
    const fulfilled = bp.requires.map(req => {
      let idx = available.indexOf(req);
      if (idx !== -1) { available.splice(idx, 1); return true; }
      idx = available.indexOf('widget');
      if (idx !== -1) { available.splice(idx, 1); return true; }
      return false;
    });

    bpDiv.innerHTML = `
      <div class="blueprint-card">
        <div class="bp-name">${bp.name}</div>
        <div class="bp-requirements">
          ${bp.requires.map((r, i) => `<span class="bp-req ${fulfilled[i] ? 'fulfilled' : 'missing'}">${TYPES[r].name}</span>`).join('')}
        </div>
      </div>`;
  }

  const counts = countComponents(state.player.mechanism);
  document.getElementById('player-upright-count').textContent = counts.upright;
  document.getElementById('player-flipped-count').textContent = counts.flipped;
  const compBadge = document.getElementById('player-comp-count');
  compBadge.textContent = `${counts.total}/13`;
  compBadge.className = 'comp-count-badge ' + (counts.total < 10 ? 'comp-count-ok' : counts.total < 12 ? 'comp-count-warn' : 'comp-count-crit');
}

export function renderAIInfo(state) {
  document.getElementById('ai-bp-count').textContent = `${state.ai.blueprintsComplete}/2`;
  document.getElementById('ai-score').textContent = state.ai.score;

  const tol = state.ai.tolerance;
  const pct = Math.min(100, (tol / 12) * 100);
  document.getElementById('ai-tol-fill').style.width = pct + '%';
  document.getElementById('ai-tol-num').textContent = tol;
  const tolDisplay = document.getElementById('ai-tol-display');
  tolDisplay.className = 'tolerance-display ' + (tol <= 6 ? 'tol-safe' : tol <= 8 ? 'tol-warn' : 'tol-danger');

  const counts = countComponents(state.ai.mechanism);
  document.getElementById('ai-comp-count').textContent = `${counts.total}/13`;
  document.getElementById('ai-comp-count').className = 'comp-count-badge ' + (counts.total < 10 ? 'comp-count-ok' : counts.total < 12 ? 'comp-count-warn' : 'comp-count-crit');

  document.getElementById('ai-hand-count').textContent = `${state.ai.hand.length} cards`;

  const display = document.getElementById('ai-mechanism-display');
  const keys = Object.keys(state.ai.mechanism);
  if (keys.length === 0) {
    display.innerHTML = '<span style="font-size:11px; color:var(--text-dim)">Empty</span>';
  } else {
    display.innerHTML = `<div class="ai-mechanism-mini">
      ${keys.map(k => {
        const c = state.ai.mechanism[k];
        return `<div class="ai-mini-card ${c.upright ? '' : 'upside-down'}" style="background:${TYPES[c.type].color}33; border-color:${TYPES[c.type].color}66" title="${TYPES[c.type].name}${c.upright ? '' : ' (flipped)'}">${TYPES[c.type].icon}</div>`;
      }).join('')}
    </div>`;
  }
}

export function renderActionBar(state) {
  const bar = document.getElementById('action-bar');
  let html = '';

  if (state.phase === 'build') {
    const canDeclare = checkBlueprintSatisfied(state.player.mechanism, state.player.blueprint);
    html += `<button class="btn btn-success" ${canDeclare ? '' : 'disabled'} onclick="playerDeclare()">Declare Complete</button>`;
    html += `<button class="btn btn-primary" onclick="endBuildPhase()">End Build (${state.player.cardsPlayedThisTurn}/3 played)</button>`;
  } else if (state.phase === 'repair') {
    html += `<span style="font-size:11px; color:var(--text-dim); margin-right:8px;">Repair: click a flipped card to repair, or:</span>`;
    if (state.player.hand.length > 0 && state.player.tolerance > 1) {
      html += `<button class="btn btn-secondary" onclick="repairTolerance()">−1 Tolerance</button>`;
    }
    html += `<button class="btn btn-primary" onclick="skipRepair()">Skip</button>`;
  } else if (state.phase === 'place-gift') {
    if (state._canDiscardGift) {
      html += `<button class="btn btn-danger" onclick="discardGift()">Discard Gift</button>`;
    }
    html += `<span style="font-size:11px; color:var(--text-dim);">Click a highlighted cell to place the gifted card</span>`;
  } else if (state.phase === 'banjax-choice') {
    html += `<span style="font-size:11px; color:var(--danger);">Click an upright component to flip it (Banjaxed!)</span>`;
  }

  bar.innerHTML = html;
}

export function renderDrawPile(state) {
  document.getElementById('draw-pile-count').textContent = state.deck.length;
}

export function setPhase(state, phase) {
  state.phase = phase;
  const phaseMap = {
    draft: { text: 'Draft', cls: 'phase-draft' },
    build: { text: 'Build', cls: 'phase-build' },
    roll: { text: 'Banjax Roll', cls: 'phase-roll' },
    repair: { text: 'Repair', cls: 'phase-repair' },
    'place-gift': { text: 'Place Gift', cls: 'phase-build' },
    'banjax-choice': { text: 'Banjaxed!', cls: 'phase-roll' },
  };
  const p = phaseMap[phase] || { text: phase, cls: 'phase-draft' };
  document.getElementById('phase-display').innerHTML = `<span class="phase-indicator ${p.cls}">${p.text}</span>`;
}

export function addLog(state, msg) {
  state.log.push(msg);
  const logDiv = document.getElementById('game-log');
  logDiv.innerHTML += `<div class="log-entry">${msg}</div>`;
  logDiv.scrollTop = logDiv.scrollHeight;
}

export function showModal(title, desc, content, buttons) {
  const root = document.getElementById('modal-root');
  const btnHTML = buttons.map(b => `<button class="btn ${b.class}" onclick="${b.action}">${b.text}</button>`).join('');
  root.innerHTML = `<div class="modal-overlay"><div class="modal">
    <h2>${title}</h2>
    <p>${desc}</p>
    ${content}
    <div style="margin-top:16px">${btnHTML}</div>
  </div></div>`;
}

export function closeModal() {
  document.getElementById('modal-root').innerHTML = '';
}
