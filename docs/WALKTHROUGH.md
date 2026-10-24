# PYROGUARD AI: COMPLETE SYSTEM WALKTHROUGH

## Dual scope: South African SANS 10400-T / SANS 1475 and New Zealand NZS 4503 / FENZ

> **Status (October 2026): working demo.** The rule values in this app are working defaults that are
> **pending verification** against the current SANS and NZS editions by a registered practitioner.
> Do not use PyroGuard output on paying jobs until that sign-off is recorded.

---

## PART 1: THE SIMPLE WALKTHROUGH

Target audience: building owners, fire technicians, facilities managers and sales partners.

```text
 [1: ARRIVE ON SITE] ──► [2: COVERAGE CHECK] ──► [3: LOG EQUIPMENT] ──► [4: QUOTE & DOSSIER]
 Enter floor area (m²)    Agent 1 works out the    Agent 2 logs each        Itemised quote and a
 Pick the occupancy       extinguishers and hose   cylinder and flags       sealed audit dossier,
 class (e.g. J1, G1)      reels the site needs     rust, tests, recharges   ready before you leave
```

### The problem PyroGuard solves

Many fire equipment technicians still work from paper job cards: they estimate coverage on site,
write notes by hand, and type up the quote back at the office days later. By then the client has
moved on, follow-up work is delayed, and quotes get lost.

### What PyroGuard does in 4 steps

1. **Check coverage (Agent 1 – Spatial Specifier)**
   - The technician enters the floor area (e.g. `1,450 m²`) and selects the occupancy class
     (e.g. *J1 – High-risk storage* or *G1 – Offices*).
   - The app works out the requirement instantly. In the demo: *"15 extinguishers and 3 hose reels
     required. 6 extinguishers and 2 hose reels installed, so 9 extinguishers and 1 hose reel short."*

2. **Log equipment (Agent 2 – Rapid Asset Logger)**
   - Walking the site, the technician logs each cylinder in a few taps: serial number, type
     (`DCP`, `CO2`, `Water`) and condition.
   - **Green:** passes the routine annual service.
   - **Amber:** due for its hydrostatic pressure test (the app currently uses 5 years for CO₂ and
     10 years for DCP, water and foam; *pending verification*) or needs a recharge.
   - **Red:** rust, dents or age past the service-life limit. The app flags it as **condemned under
     SANS 1475**, and the technician confirms the decision.

3. **Listen to "Rob" (voice assistant)**
   - Rob reads out results so the technician doesn't have to keep looking at the screen. Voices:
     South African English, New Zealand English, isiZulu, isiXhosa and Afrikaans.
   - Example: *"Spatial shortfall detected! 9 extinguishers short of the required density."*

4. **Leave with a quote and a sealed audit dossier**
   - The app builds an itemised quote automatically. In the demo: a replacement for the condemned
     cylinder, a workshop pressure test, a recharge, routine services, and units to cover the shortfall.
   - The dossier is sealed with a **SHA-256 fingerprint**: if anything in it changes, the fingerprint
     changes.
   - The technician prints it or saves it as a PDF, and the technician and client sign the sign-off blocks.

---

## PART 2: THE TECHNICAL WALKTHROUGH

Target audience: engineers, systems architects, insurers and fire safety officers.

```text
┌──────────────────────────────┬──────────────────────────────┬──────────────────────────────┐
│     RULE-BASED ENGINES       │     VOICE & DEVICE LAYER     │      AUDIT FINGERPRINT       │
│        (no AI involved)      │                              │   (Web Crypto, FIPS 180-4)   │
├──────────────────────────────┼──────────────────────────────┼──────────────────────────────┤
│ • sans10400TEngine.ts        │ • Web Audio alert chime      │ • SubtleCrypto SHA-256       │
│   (density, travel, reels)   │   (880 Hz → 1320 Hz)         │ • Computed on the device     │
│ • nzs4503Engine.ts           │ • Speech synthesis with      │ • 3-way sign-off blocks      │
│   (NZ hazard classes)        │   queue-freeze workarounds   │ • Print / save as PDF        │
│ • sans1475Engine.ts          │ • Installable web-app        │                              │
│   (tests, condemnation, quote)│   manifest                  │                              │
└──────────────────────────────┴──────────────────────────────┴──────────────────────────────┘
```

### 1. Rule-based engines (`src/lib/engines/`)

**No AI model ever calculates a fire-safety requirement or a pass/fail verdict.** Every result
comes from plain, rule-based code, so the same inputs always give the same, auditable answer.
`RULES_VERIFIED` stays `false`, and the app shows a "pending verification" note, until a registered
practitioner signs off the values below.

- **SANS 10400-T Spatial Specifier (`sans10400TEngine.ts`)**
  - Occupancy classes follow SANS 10400-A: **J1–J3 storage**, **G1 offices**, **A1/A2 assembly**.
  - Current working densities: 1 extinguisher per 100 m² (J1, A1, A2), 200 m² (J2, G1), 250 m² (J3).
  - Maximum travel distance to an extinguisher: 30 m.
  - Hose reels: 1 per 500 m² where the floor area exceeds 250 m², with a 35 m reach (30 m hose + 5 m throw).

- **NZS 4503 New Zealand engine (`nzs4503Engine.ts`)**
  - One toggle switches to NZ hazard classes: high (1 per 100 m², 20 m travel), medium
    (1 per 150 m², 25 m), low (1 per 250 m², 30 m), with prices in NZD.

- **SANS 1475 lifecycle & condemnation (`sans1475Engine.ts`)**
  - Hydrostatic test due year: currently a 5-year cycle for CO₂ and 10 years for DCP, water and foam.
  - Condemnation is flagged for shell corrosion, pitting, dents, or a non-CO₂ cylinder older than 20 years.
  - Known gap: the test due date is calculated from the manufacture year, because the app doesn't
    yet record a "last pressure test" date. A missed test is not flagged as overdue yet.

*All values above are pending verification against the current standards.*

### 2. Audit fingerprint (`cryptoService.ts`)

- Uses the browser's built-in **Web Crypto API** (`crypto.subtle.digest('SHA-256', …)`).
- Hashes the whole audit record: facility, coordinates, auditor registration, every asset's status,
  shortfalls and the quote.
- Produces a 64-character fingerprint printed in the dossier footer. It's calculated on the device,
  so client floor areas and asset data are not sent to any server.
- **What it proves:** if any detail in the dossier changes, the fingerprint no longer matches.
  To make tampering detectable by a third party, the fingerprint must also be stored somewhere
  independent (for example, emailed to the client or logged on a server). That's on the roadmap.

### 3. Voice assistant ("Rob")

- **Alert chime:** the Web Audio API plays a short 880 Hz → 1320 Hz chirp. This also unlocks
  browser audio before speech starts.
- **Speech:** browser speech synthesis, with workarounds for Chromium's frozen-queue bug
  (`speechSynthesis.resume()`) and for utterances being garbage-collected mid-sentence.
- **Languages:** SA English, NZ English, isiZulu, isiXhosa, Afrikaans. The voice quality depends on
  the voices installed on the device.

### 4. Corrective works quote

- Turns findings into priced line items: replacement cylinders, workshop pressure tests, powder and
  CO₂ recharges, routine services, tamper seals, photoluminescent signage and units for any shortfall.
- Two price lists: **South African Rand (ZAR)** and **New Zealand Dollars (NZD)**. Current prices are
  placeholders for the business to set.

### 5. Testing

- **Engine tests (`npm test`):** run the real engine code against known cases, including a check
  that a site with a shortfall can never be marked compliant.
- **Browser tests (`npm run test:e2e`):** 4 Playwright tests covering the main screens, toggles,
  badges and the dossier.

---

## ROADMAP (not built yet)

- On-screen client signature and emailing the dossier to the client.
- Storing each dossier fingerprint independently, so third parties can check for tampering.
- Offline mode for the hosted app (service worker). Today, offline use needs the local launcher below.
- A "last pressure test" date per cylinder.
- Practitioner sign-off of all rule values (`RULES_VERIFIED = true`).

---

## WHERE TO ACCESS IT

- **Live demo:** <https://pyroguard-ai-live.vercel.app>
- **GitHub repository:** <https://github.com/tharmen666/pyroguard-ai>
- **Local launcher:** `launch-pyroguard.bat` runs the app on a laptop without internet. It needs
  Node.js, and you must run `npm install` and `npm run build` once while online.
