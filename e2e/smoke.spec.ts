import { test, expect, type Page, type Route } from '@playwright/test';

// Six critical-path smoke tests. Kept intentionally shallow — each
// one asserts the "did the page load and does the main thing work"
// signal, not deep functional correctness. Deeper checks would slow
// the suite and add maintenance burden without meaningfully more
// coverage; if a critical bug appears that this suite misses, add a
// targeted test then.

test.describe('Marketing pages render', () => {
  test('homepage loads with tagline + at least one article', async ({
    page
  }) => {
    await page.goto('/');
    // Header + hero shell.
    await expect(page.locator('h1', { hasText: 'Hard Problems' })).toBeVisible();
    // Article grid should have at least the hero card rendered.
    await expect(
      page.locator('[class*="articleCardTitle"]').first()
    ).toBeVisible();
  });

  test('an article page renders body content', async ({ page }) => {
    // Navigate from the homepage to whichever article is currently
    // the hero — decoupling the test from any specific article slug
    // means content changes don't break the suite.
    await page.goto('/');
    const firstArticleLink = page
      .locator('a[href^="/articles/"]')
      .first();
    await firstArticleLink.waitFor();
    const href = await firstArticleLink.getAttribute('href');
    expect(href).toMatch(/^\/articles\//);
    await page.goto(href!);
    // Every article renders its title as an h1 and a body wrapper.
    await expect(page.locator('h1').first()).toBeVisible();
    await expect(page.locator('[class*="body"]').first()).toBeVisible();
  });
});

test.describe('Job board', () => {
  test('board renders + at least one job card + filter click updates URL', async ({
    page
  }) => {
    await page.goto('/jobs');
    // Board heading + at least one job in the list.
    await expect(page.getByRole('heading', { name: /job board/i })).toBeVisible();
    await expect(page.locator('[class*="job"]').first()).toBeVisible();

    // Toggle the "Our pick" filter and verify the URL picked it up.
    // (The board rewrites the URL to `?pick=1` when the checkbox
    // is checked, which triggers filtering.)
    const pickCheckbox = page.getByRole('checkbox', { name: /our pick/i });
    if (await pickCheckbox.isVisible()) {
      await pickCheckbox.check();
      await expect(page).toHaveURL(/[?&]pick=1/);
    }
  });
});

test.describe('Subscribe forms roundtrip (mocked backends)', () => {
  test('newsletter subscribe: shows success modal after 200 from /api/subscribe', async ({
    page
  }) => {
    await mockJsonResponse(page, '**/api/subscribe', { ok: true });
    await page.goto('/');
    // The newsletter form lives in the footer on every page.
    const footerEmail = page
      .locator('input[name="email"][type="email"]')
      .last();
    await footerEmail.scrollIntoViewIfNeeded();
    await footerEmail.fill('e2e-test@example.com');
    await footerEmail.press('Enter');
    // Success modal has a "Thank you" title.
    await expect(page.getByText(/thank you/i)).toBeVisible({ timeout: 5000 });
  });

  test('alerts subscribe: modal opens, form submits, "Check your inbox" shows', async ({
    page
  }) => {
    await mockJsonResponse(page, '**/api/alerts/subscribe', { ok: true });
    await page.goto('/jobs');
    await page.getByRole('button', { name: /get email alerts/i }).click();
    // Modal should mount into document.body via portal.
    const modalHeading = page.getByRole('heading', {
      name: /custom daily alerts/i
    });
    // Modal title is a <strong>, not a heading — fall back to text.
    if (!(await modalHeading.isVisible().catch(() => false))) {
      await expect(page.getByText(/custom daily alerts/i)).toBeVisible();
    }
    const modalEmail = page.locator('input[type="email"]').last();
    await modalEmail.fill('e2e-alerts@example.com');
    await page.getByRole('button', { name: /subscribe/i }).click();
    await expect(page.getByText(/check your inbox/i)).toBeVisible({
      timeout: 5000
    });
  });
});

test.describe('Error boundaries', () => {
  test('unknown route renders the 404 page', async ({ page }) => {
    const res = await page.goto('/definitely-not-a-real-route-e2e');
    expect(res?.status()).toBe(404);
    await expect(page.getByRole('heading', { name: /page not found/i })).toBeVisible();
  });
});

// Utility — intercept a URL pattern and return a canned JSON payload
// so subscribe-flow tests don't hit Beehiiv / Resend / Supabase.
async function mockJsonResponse(
  page: Page,
  urlPattern: string,
  body: Record<string, unknown>
): Promise<void> {
  await page.route(urlPattern, async (route: Route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(body)
    });
  });
}
