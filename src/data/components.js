// Component type definitions for the Banjaxed card game

export const TYPES = {
  spring:     { name: 'Spring',     icon: '🔩', tol: 0, category: 'common', color: 'var(--spring)' },
  gear:       { name: 'Gear',       icon: '⚙️', tol: 0, category: 'common', color: 'var(--gear)' },
  piston:     { name: 'Piston',     icon: '🔧', tol: 0, category: 'common', color: 'var(--piston)' },
  cable:      { name: 'Cable',      icon: '🔗', tol: 0, category: 'common', color: 'var(--cable)' },
  wheel:      { name: 'Wheel',      icon: '☸️', tol: 0, category: 'common', color: 'var(--wheel)' },
  lever:      { name: 'Lever',      icon: '🔀', tol: 1, category: 'specialist', color: 'var(--lever)' },
  pulley:     { name: 'Pulley',     icon: '🎡', tol: 1, category: 'specialist', color: 'var(--pulley)' },
  flywheel:   { name: 'Flywheel',   icon: '💫', tol: 1, category: 'specialist', color: 'var(--flywheel)' },
  bellows:    { name: 'Bellows',    icon: '🌬️', tol: 1, category: 'specialist', color: 'var(--bellows)' },
  pin:        { name: 'Pin',        icon: '📌', tol: 1, category: 'specialist', color: 'var(--pin)' },
  cam:        { name: 'Cam',        icon: '🎯', tol: 1, category: 'specialist', color: 'var(--cam)' },
  ratchet:    { name: 'Ratchet',    icon: '🔒', tol: 1, category: 'specialist', color: 'var(--ratchet)' },
  wormgear:   { name: 'Worm Gear',  icon: '🐛', tol: 1, category: 'specialist', color: 'var(--wormgear)' },
  escapement: { name: 'Escapement', icon: '⏱️', tol: 1, category: 'specialist', color: 'var(--escapement)' },
  crank:      { name: 'Crank',      icon: '🔄', tol: 1, category: 'specialist', color: 'var(--crank)' },
  widget:     { name: 'Widget',     icon: '★',  tol: 0, category: 'wildcard', color: 'var(--widget)' },
  spanner:    { name: 'Spanner',    icon: '🪛', tol: 0, category: 'spanner', color: 'var(--spanner)' },
};

export const COMMON_TYPES = ['spring', 'gear', 'piston', 'cable', 'wheel'];
export const SPECIALIST_TYPES = ['lever', 'pulley', 'flywheel', 'bellows', 'pin', 'cam', 'ratchet', 'wormgear', 'escapement', 'crank'];
export const COMMON_COUNT = 10;
export const SPECIALIST_COUNT = 5;
export const WIDGET_COUNT = 10;
export const SPANNER_COUNT = 10;
