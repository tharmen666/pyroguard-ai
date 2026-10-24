/**
 * PYROGUARD AI - DETERMINISTIC STATUTORY ENGINE SMOKE TESTS
 * Imports the real engines (Node runs the .ts files directly) so a change to any
 * rule value or formula is caught here. Never re-implement engine maths in this file.
 *
 * The expected values encode the CURRENT working rules, which are still pending
 * verification against the SANS / NZS standards (see RULES_VERIFIED).
 */

import assert from 'node:assert';
import { calculateSANS10400TRequirements, RULES_VERIFIED } from '../src/lib/engines/sans10400TEngine.ts';
import { calculateNZS4503Requirements } from '../src/lib/engines/nzs4503Engine.ts';
import {
  calculateHydrostaticTestDueYear,
  evaluateExtinguisherCompliance,
  generateDynamicCommercialQuote,
  summarizeFleet,
} from '../src/lib/engines/sans1475Engine.ts';

console.log('🔥 Running PyroGuard AI Deterministic Smoke Tests...\n');

// 1. SANS 10400-T Spatial Specifier
function testSANS10400T() {
  console.log('--- TEST 1: SANS 10400-T Spatial Density ---');

  assert.strictEqual(calculateSANS10400TRequirements(1000, 'J1', 0, 0).extinguishersRequired, 10, 'J1 high-risk storage: 10 units for 1000m²');
  assert.strictEqual(calculateSANS10400TRequirements(1000, 'G1', 0, 0).extinguishersRequired, 5, 'G1 offices: 5 units for 1000m²');
  assert.strictEqual(calculateSANS10400TRequirements(1000, 'J3', 0, 0).extinguishersRequired, 4, 'J3 low-risk storage: 4 units for 1000m²');

  const r = calculateSANS10400TRequirements(1000, 'G1', 3, 1);
  assert.strictEqual(r.hoseReelsRequired, 2, '1000m² needs 2 hose reels (1 per 500m²)');
  assert.strictEqual(r.extinguisherShortfall, 2);
  assert.strictEqual(r.hoseReelShortfall, 1);
  assert.strictEqual(r.complianceClearance, false, 'A shortfall must never clear compliance');

  const ok = calculateSANS10400TRequirements(1000, 'G1', 5, 2);
  assert.strictEqual(ok.complianceClearance, true);
  assert.strictEqual(calculateSANS10400TRequirements(200, 'G1', 1, 0).hoseReelsRequired, 0, 'No hose reel at or below 250m²');
  assert.strictEqual(calculateSANS10400TRequirements(0, 'G1', 0, 0).complianceClearance, false, 'Zero area cannot be cleared');

  console.log(`✅ SANS 10400-T PASSED (rules verified by practitioner: ${RULES_VERIFIED})`);
}

// 2. NZS 4503
function testNZS4503() {
  console.log('--- TEST 2: NZS 4503 Hazard Density ---');

  assert.strictEqual(calculateNZS4503Requirements(1500, 'NZ_HIGH', 0, 0).extinguishersRequired, 15);
  assert.strictEqual(calculateNZS4503Requirements(1500, 'NZ_MEDIUM', 0, 0).extinguishersRequired, 10);
  assert.strictEqual(calculateNZS4503Requirements(1500, 'NZ_LOW', 0, 0).extinguishersRequired, 6);

  console.log('✅ NZS 4503 PASSED');
}

// 3. SANS 1475 cylinder lifecycle, condemnation and quote
function testSANS1475Lifecycle() {
  console.log('--- TEST 3: SANS 1475 Lifecycle & Condemnation ---');

  assert.strictEqual(calculateHydrostaticTestDueYear('CO2', 2021, 2026), 2026, 'CO2 made 2021 is due 2026');
  assert.strictEqual(calculateHydrostaticTestDueYear('DCP', 2018, 2026), 2028, 'DCP made 2018 is due 2028');

  const base = {
    id: 't1',
    serialNumber: 'TEST-1',
    locationTag: 'Test bay',
    cylinderType: 'DCP',
    capacityKg: 4.5,
    manufactureYear: 2022,
    lastServiceDate: new Date().toISOString().slice(0, 10),
    gaugePressureStatus: 'Normal',
    physicalCondition: 'Pass',
  };

  const rusted = evaluateExtinguisherCompliance({ ...base, physicalCondition: 'Rusted' }, 2026);
  assert.strictEqual(rusted.condemned, true, 'Rust must condemn');
  assert.strictEqual(rusted.serviceActionRequired, 'Condemn_Replace');

  const old = evaluateExtinguisherCompliance({ ...base, manufactureYear: 2004 }, 2026);
  assert.strictEqual(old.condemned, true, 'A DCP cylinder over 20 years must condemn');

  const low = evaluateExtinguisherCompliance({ ...base, gaugePressureStatus: 'Undercharged' }, 2026);
  assert.strictEqual(low.serviceActionRequired, 'Recharge');

  const good = evaluateExtinguisherCompliance(base, 2026);
  assert.strictEqual(good.condemned, false);
  assert.strictEqual(good.serviceActionRequired, 'None');

  const summary = summarizeFleet([rusted, good], []);
  assert.strictEqual(summary.condemnedUnits, 1);

  const quote = generateDynamicCommercialQuote('ZA_SANS', summary, 2, 0);
  assert.ok(quote.items.length > 0, 'Quote must have line items');
  assert.strictEqual(quote.currency, 'ZAR');
  const lineTotal = quote.items.reduce((s, i) => s + i.totalPrice, 0);
  assert.ok(quote.grandTotal >= lineTotal, 'Grand total must cover the line items');

  console.log('✅ SANS 1475 lifecycle, condemnation and quote PASSED');
}

testSANS10400T();
testNZS4503();
testSANS1475Lifecycle();

console.log('\n🚀 ALL STATUTORY ENGINE SMOKE TESTS PASSED (real engines)\n');
