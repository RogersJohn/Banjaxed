// Banjax roll logic — pure functions, no DOM, no side effects

export function rollBanjaxDice(numDice, tolerance) {
  const results = [];
  for (let i = 0; i < numDice; i++) {
    const roll = Math.random();
    let face;
    if (roll < 0.5) face = 'blank';        // 3/6
    else if (roll < 5 / 6) face = 'wobble'; // 2/6
    else face = 'eureka';                    // 1/6

    // Tolerance thresholds modify results
    if (tolerance >= 7 && tolerance <= 8 && face === 'blank') {
      face = 'wobble'; // disadvantage: blanks become wobbles
    }
    if (tolerance >= 9 && tolerance <= 11 && face === 'wobble') {
      face = 'banjax'; // wobbles become banjaxes
    }

    results.push(face);
  }
  return results;
}
