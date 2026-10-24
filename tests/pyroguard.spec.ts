import { test, expect } from '@playwright/test';

test.describe('PyroGuard AI - End-to-End Field Audit Suite', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
  });

  test('should load PyroGuard AI with dual regulatory switch and Rob avatar', async ({ page }) => {
    // 1. Verify title & brand
    await expect(page).toHaveTitle(/PyroGuard AI/i);
    await expect(page.getByRole('heading', { name: /PYROGUARD/i })).toBeVisible();

    // 2. Verify Rob AI Inspector Avatar
    await expect(page.locator('text=ROB').first()).toBeVisible();
    await expect(page.locator('button:has-text("GREET")')).toBeVisible();
    await expect(page.locator('button:has-text("TEST VOICE")')).toBeVisible();

    // 3. Verify Standard Switcher
    const zaSwitch = page.locator('button:has-text("🇿🇦 SANS 10400-T")');
    const nzSwitch = page.locator('button:has-text("🇳🇿 NZS 4503")');
    await expect(zaSwitch).toBeVisible();
    await expect(nzSwitch).toBeVisible();

    // Toggle to NZ
    await nzSwitch.click();
    await expect(page.locator('text=NZS 4503 SPECIFIER')).toBeVisible();

    // Toggle back to ZA
    await zaSwitch.click();
    await expect(page.locator('text=SANS 10400-T SPECIFIER')).toBeVisible();
  });

  test('should compute SANS 10400-T spatial density and travel distance rules', async ({ page }) => {
    await page.click('button:has-text("Agent 1: Spatial Specifier")');

    // Adjust floor space
    const areaInput = page.locator('input[type="number"]');
    await areaInput.fill('2000');

    // Confirm deterministic output card updates
    await expect(page.locator('text=Deterministic Output Matrix')).toBeVisible();
    await expect(page.locator('text=Max Travel to Extinguisher:')).toBeVisible();
  });

  test('should log cylinders and display SANS 1475 status badges', async ({ page }) => {
    await page.click('button:has-text("Agent 2: Asset Logger")');

    // Click load sample fleet
    const loadFleetBtn = page.locator('button:has-text("Load Live 6-Unit Sample Fleet")');
    await loadFleetBtn.click();

    // Check for color-coded status badges in the register table
    await expect(page.locator('span:has-text("PASS / ACTIVE")').first()).toBeVisible();
    await expect(page.locator('span:has-text("CONDEMNED")').first()).toBeVisible();
    await expect(page.locator('span:has-text("HYDRO TEST DUE")').first()).toBeVisible();
  });

  test('should render dynamic commercial quote and cryptographic dossier', async ({ page }) => {
    // View Up-Sell Quote Matrix
    await page.click('button:has-text("Up-Sell Quote Matrix")');
    await expect(page.locator('text=Live Compliance Up-Sell & Condemnation Quote')).toBeVisible();
    await expect(page.locator('text=Total Inspected')).toBeVisible();

    // View Legal Dossier
    await page.click('button:has-text("Cryptographic Legal Dossier")');
    await expect(page.locator('text=Insurer-Defensible Audit Dossier')).toBeVisible();
    await expect(page.locator('text=CLIENT-SIDE SHA-256 AUDIT FOOTPRINT')).toBeVisible();
    await expect(page.locator('text=Ron (SAQCC 1475 Registered)').first()).toBeVisible();
    await expect(page.locator('text=Desigan Tharmen').first()).toBeVisible();
  });
});
