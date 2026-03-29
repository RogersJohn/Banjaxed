// Tolerance dial, score, status, and general UI helpers

import { TYPES } from '../data/components.js';
import { countComponents, getUprightTypes, checkBlueprintSatisfied, getRetrievableKeys, getDestroyableKeys } from '../engine/rules.js';

export function renderPlayerInfo(state) {
  const p = state.players[0];
  document.getElementById('player-bp-count').textContent = `${p.blueprintsComplete}/2`;
  document.getElementById('player-score').textContent = p.score;

  const tol = p.tolerance;
  const pct = Math.min(100, (tol / 12) * 100);
  document.getElementById('player-tol-fill').style.width = pct + '%';
  document.getElementById('player-tol-num').textContent = tol;
  const tolDisplay = document.getElementById('player-tol-display');
  tolDisplay.className = 'tolerance-display ' + (tol <= 6 ? 'tol-safe' : tol <= 8 ? 'tol-warn' : 'tol-danger');

  const bpDiv = document.getElementById('player-blueprint');
  if (p.blueprint) {
    const bp = p.blueprint;
    const uprightTypes = getUprightTypes(p.mechanism);
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

  const counts = countComponents(p.mechanism);
  document.getElementById('player-upright-count').textContent = counts.upright;
  document.getElementById('player-flipped-count').textContent = counts.flipped;
  const compBadge = document.getElementById('player-comp-count');
  compBadge.textContent = `${counts.total}/13`;
  compBadge.className = 'comp-count-badge ' + (counts.total < 10 ? 'comp-count-ok' : counts.total < 12 ? 'comp-count-warn' : 'comp-count-crit');
}

export function renderOpponents(state) {
  const panel = document.getElementById('opponents-panel');
  let html = '';
  for (let i = 1; i < state.playerCount; i++) {
    const p = state.players[i];
    const tol = p.tolerance;
    const tolClass = tol <= 6 ? 'tol-safe' : tol <= 8 ? 'tol-warn' : 'tol-danger';
    const counts = countComponents(p.mechanism);
    const compClass = counts.total < 10 ? 'comp-count-ok' : counts.total < 12 ? 'comp-count-warn' : 'comp-count-crit';

    const mechKeys = Object.keys(p.mechanism);
    let mechHTML;
    if (mechKeys.length === 0) {
      mechHTML = '<span style="font-size:13px; color:var(--text-dim)">Empty</span>';
    } else {
      const isTarget = state.phase === 'spanner-target' && state._spannerTargetPlayerIndex === i && state.pendingSpanner;
      const destroyable = isTarget && state.pendingSpanner.action === 'destroy' ? getDestroyableKeys(p.mechanism) : [];

      mechHTML = `<div class="ai-mechanism-mini">${mechKeys.map(k => {
        const c = p.mechanism[k];
        let clickAttr = '';
        if (isTarget) {
          if (state.pendingSpanner.action === 'destroy' && destroyable.includes(k)) {
            clickAttr = `onclick="executeSpanner('${k}', ${i})" style="cursor:pointer; border-color:var(--danger);"`;
          } else if (state.pendingSpanner.action === 'fix' && !c.upright) {
            clickAttr = `onclick="executeSpanner('${k}', ${i})" style="cursor:pointer; border-color:var(--success);"`;
          }
        }
        return `<div class="ai-mini-card ${c.upright ? '' : 'upside-down'}" ${clickAttr} ${!clickAttr ? `style="background:${TYPES[c.type].color}33; border-color:${TYPES[c.type].color}66"` : ''} title="${TYPES[c.type].name}${c.upright ? '' : ' (flipped)'}">${TYPES[c.type].icon}</div>`;
      }).join('')}</div>`;
    }

    html += `<div class="panel-section" id="opponent-panel-${i}">
      <h3>Automaton ${i}</h3>
      <div class="score-row">
        <span class="score-label">Blueprints</span>
        <span class="bp-count" style="font-size:18px;">${p.blueprintsComplete}/2</span>
      </div>
      <div class="score-row">
        <span class="score-label">Score</span>
        <span class="score-value">${p.score}</span>
      </div>
      <div class="tolerance-display ${tolClass}" style="margin:4px 0;">
        <div class="tolerance-bar"><div class="tolerance-fill" style="width:${Math.min(100,(tol/12)*100)}%"></div></div>
        <div class="tolerance-num">${tol}</div>
      </div>
      <div class="score-row">
        <span class="score-label">Components</span>
        <span class="comp-count-badge ${compClass}">${counts.total}/13</span>
      </div>
      ${mechHTML}
      <div style="font-size:13px; color:var(--text-dim); margin-top:4px;">${p.hand.length} cards in hand</div>
    </div>`;
  }
  panel.innerHTML = html;
}

export function renderActionBar(state) {
  const bar = document.getElementById('action-bar');
  const human = state.players[0];
  let html = '';

  if (state.phase === 'build') {
    const canDeclare = checkBlueprintSatisfied(human.mechanism, human.blueprint);
    html += `<button class="btn btn-success" ${canDeclare ? '' : 'disabled'} onclick="playerDeclare()">Declare Complete</button>`;
    html += `<button class="btn btn-primary" onclick="endBuildPhase()">End Build (${human.cardsPlayedThisTurn}/3 played)</button>`;
  } else if (state.phase === 'repair') {
    html += `<span style="font-size:13px; color:var(--text-dim); margin-right:8px;">Repair: click a flipped card to repair, or:</span>`;
    if (human.hand.length > 0 && human.tolerance > 1) {
      html += `<button class="btn btn-secondary" onclick="repairTolerance()">−1 Tolerance</button>`;
    }
    html += `<button class="btn btn-primary" onclick="skipRepair()">Skip</button>`;
  } else if (state.phase === 'place-gift') {
    if (state._canDiscardGift) {
      html += `<button class="btn btn-danger" onclick="discardGift()">Discard Gift</button>`;
    }
    html += `<span style="font-size:13px; color:var(--text-dim);">Click a highlighted cell to place the gifted card</span>`;
  } else if (state.phase === 'banjax-choice') {
    html += `<span style="font-size:13px; color:var(--danger);">Click an upright component to flip it (Banjaxed!)</span>`;
  } else if (state.phase === 'draft') {
    if (human.hasRetrievedThisDraft === false && getRetrievableKeys(human.mechanism).length > 0) {
      html += `<button class="btn btn-secondary" onclick="startRetrieval()">Retrieve a Component</button>`;
    }
  } else if (state.phase === 'retrieve') {
    html += `<span style="font-size:13px; color:var(--accent);">Click a highlighted component to retrieve it to your hand</span>`;
    html += `<button class="btn btn-secondary" onclick="cancelRetrieval()" style="margin-left:8px;">Cancel</button>`;
  } else if (state.phase === 'spanner-target') {
    const actionName = state.pendingSpanner ? state.pendingSpanner.action.toUpperCase() : '';
    html += `<span style="font-size:13px; color:var(--spanner); margin-right:8px;">Spanner: ${actionName} — choose target:</span>`;
    for (let i = 0; i < state.playerCount; i++) {
      const label = i === 0 ? 'You' : `Automaton ${i}`;
      const active = state._spannerTargetPlayerIndex === i;
      html += `<button class="btn ${active ? 'btn-primary' : 'btn-secondary'}" onclick="setSpannerTarget(${i})" style="margin-left:4px;">${label}</button>`;
    }
    if (state.pendingSpanner && state.pendingSpanner.action === 'reduce') {
      const ti = state._spannerTargetPlayerIndex ?? 0;
      html += `<button class="btn btn-danger" onclick="executeSpanner(null, ${ti})" style="margin-left:8px;">Apply −2 Tolerance</button>`;
    }
    html += `<button class="btn btn-secondary" onclick="cancelSpanner()" style="margin-left:8px;">Cancel</button>`;
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
    'retrieve': { text: 'Retrieve', cls: 'phase-draft' },
    'spanner-target': { text: 'Spanner!', cls: 'phase-roll' },
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
