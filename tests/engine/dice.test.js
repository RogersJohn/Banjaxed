import { describe, test, expect } from '@jest/globals';
import { rollBanjaxDice } from '../../src/engine/dice.js';

describe('rollBanjaxDice', () => {
  test('returns correct number of results', () => {
    expect(rollBanjaxDice(0, 3)).toHaveLength(0);
    expect(rollBanjaxDice(5, 3)).toHaveLength(5);
    expect(rollBanjaxDice(1, 3)).toHaveLength(1);
  });

  test('results are valid face values at normal tolerance', () => {
    const results = rollBanjaxDice(100, 3);
    for (const face of results) {
      expect(['blank', 'wobble', 'eureka']).toContain(face);
    }
  });

  test('no banjax results at tolerance 0-6', () => {
    // Run many times to verify statistically
    for (let i = 0; i < 10; i++) {
      const results = rollBanjaxDice(50, 5);
      expect(results.filter(r => r === 'banjax')).toHaveLength(0);
    }
  });

  test('disadvantage at tolerance 7-8: blanks become wobbles', () => {
    // At tolerance 7-8, blanks become wobbles, so only wobble and eureka should appear
    const results = rollBanjaxDice(200, 7);
    expect(results.filter(r => r === 'blank')).toHaveLength(0);
    for (const face of results) {
      expect(['wobble', 'eureka']).toContain(face);
    }
  });

  test('escalation at tolerance 9-11: wobbles become banjax', () => {
    // At tolerance 9-11, wobbles become banjax
    // Blanks are still blanks (disadvantage only applies at 7-8)
    const results = rollBanjaxDice(200, 9);
    expect(results.filter(r => r === 'wobble')).toHaveLength(0);
    for (const face of results) {
      expect(['blank', 'banjax', 'eureka']).toContain(face);
    }
  });
});
