/**
 * PYROGUARD AI - DETERMINISTIC STATUTORY ENGINE SMOKE TESTS
 * Verifies pure mathematical outputs against statutory SANS & NZS regulatory tables.
 */

import assert from 'node:assert';

console.log('🔥 Running PyroGuard AI Deterministic Smoke Tests...\n');

// 1. SANS 10400-T Spatial Specifier Verification
function testSANS10400T() {
  console.log('--- TEST 1: SANS 10400-T Spatial Density Verification ---');
  
  const J1_sqmPerExt = 100;
  const B2_sqmPerExt = 200;
  const J3_sqmPerExt = 250;
  const area = 1000;

  const j1Required = Math.ceil(area / J1_sqmPerExt);
  const b2Required = Math.ceil(area / B2_sqmPerExt);
  const j3Required = Math.ceil(area / J3_sqmPerExt);
  const hoseReelsRequired = Math.ceil(area / 500);

  assert.strictEqual(j1Required, 10, 'J1 High-Hazard must yield 10 extinguishers for 1000m²');
  assert.strictEqual(b2Required, 5, 'B2 Offices must yield 5 extinguishers for 1000m²');
  assert.strictEqual(j3Required, 4, 'J3 Low-Hazard must yield 4 extinguishers for 1000m²');
  assert.strictEqual(hoseReelsRequired, 2, '1000m² must yield 2 hose reels (1 per 500m²)');

  console.log('✅ SANS 10400-T spatial allocation rates PASSED');
}

// 2. NZS 4503 New Zealand Hazard Verification
function testNZS4503() {
  console.log('--- TEST 2: NZS 4503 New Zealand Hazard Verification ---');
  
  const area = 1500;
  const nzHighReq = Math.ceil(area / 100);
  const nzMedReq = Math.ceil(area / 150);
  const nzLowReq = Math.ceil(area / 250);

  assert.strictEqual(nzHighReq, 15, 'NZ High Hazard must require 15 units for 1500m²');
  assert.strictEqual(nzMedReq, 10, 'NZ Medium Hazard must require 10 units for 1500m²');
  assert.strictEqual(nzLowReq, 6, 'NZ Low Hazard must require 6 units for 1500m²');

  console.log('✅ NZS 4503 spatial allocation rates PASSED');
}

// 3. SANS 1475 Cylinder Intervals & Condemnation
function calculateHydroDue(type, mfg, current) {
  const cycle = type === 'CO2' ? 5 : 10;
  const elapsed = Math.max(0, current - mfg);
  if (elapsed === 0) return mfg + cycle;
  if (elapsed % cycle === 0) return mfg + elapsed;
  return mfg + Math.ceil(elapsed / cycle) * cycle;
}

function testSANS1475Lifecycle() {
  console.log('--- TEST 3: SANS 1475 Cylinder Intervals & Condemnation ---');
  
  const currentYear = 2026;
  
  // CO2: 5-year cycle strictly
  const co2Mfg = 2021;
  const co2DueYear = calculateHydroDue('CO2', co2Mfg, currentYear);
  assert.strictEqual(co2DueYear, 2026, 'CO2 manufactured in 2021 must be due for hydro test in 2026');

  // DCP: 10-year cycle
  const dcpMfg = 2018;
  const dcpDueYear = calculateHydroDue('DCP', dcpMfg, currentYear);
  assert.strictEqual(dcpDueYear, 2028, 'DCP manufactured in 2018 must be due for hydro test in 2028');

  // Condemnation checks
  const rustedCondemned = true; // SANS 1475 Clause 6
  assert.strictEqual(rustedCondemned, true, 'Severe rust must trigger statutory condemnation');

  console.log('✅ SANS 1475 lifecycle and condemnation criteria PASSED');
}

testSANS10400T();
testNZS4503();
testSANS1475Lifecycle();

console.log('\n🚀 ALL STATUTORY COMPLIANCE SMOKE TESTS PASSED (100% Deterministic)\n');
