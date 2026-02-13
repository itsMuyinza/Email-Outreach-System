/**
 * Phase 7: The Organic Engagement Engine
 * Uses Playwright to simulate human-like behavior in the browser.
 */

// Note: In a real environment, you'd install 'playwright-extra' and 'puppeteer-extra-plugin-stealth'
// We'll use the core playwright API with stealthy behavior patterns.
import { chromium, Browser, Page } from 'playwright';

const BROWSER_WS_ENDPOINT = process.env.BROWSER_WS_ENDPOINT || 'ws://localhost:3001';

/**
 * Helper for randomized human-like delays
 */
const humanDelay = (min = 1000, max = 3000) => 
  new Promise(resolve => setTimeout(resolve, Math.floor(Math.random() * (max - min + 1) + min)));

/**
 * Module 1: The Engagement Agent (The Reader)
 * Simulates a human checking their inbox, reading, and clicking.
 */
export async function runEngagementSession(email: string, cookies: any[]) {
  let browser: Browser | null = null;
  try {
    // Connect to the dedicated browserless instance
    browser = await chromium.connectOverCDP(BROWSER_WS_ENDPOINT);
    const context = await browser.newContext({
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      viewport: { width: 1280, height: 720 }
    });
    
    // Load existing session cookies to avoid 2FA/Login loops
    if (cookies.length) {
      await context.addCookies(cookies);
    }

    const page = await context.newPage();
    
    // 1. Navigate to Gmail (or Outlook)
    console.log(`[BrowserAgent] Starting engagement for ${email}`);
    await page.goto('https://mail.google.com/mail/u/0/#inbox', { waitUntil: 'networkidle' });
    await humanDelay(2000, 5000);

    // 2. Inbox Scroll - Look active
    console.log(`[BrowserAgent] Scrolling inbox...`);
    for (let i = 0; i < 3; i++) {
      await page.mouse.wheel(0, Math.random() * 500 + 200);
      await humanDelay(1000, 2500);
    }

    // 3. Find and open an email (prioritizing certain keywords or unread)
    const emails = await page.$$('tr.zA');
    if (emails.length > 0) {
      const targetEmail = emails[Math.floor(Math.random() * Math.min(emails.length, 5))];
      await targetEmail.click();
      await humanDelay(3000, 6000);

      // 4. "Read" the email - Scroll down and up
      console.log(`[BrowserAgent] Reading email content...`);
      await page.mouse.wheel(0, 400);
      await humanDelay(15000, 30000); // Sit on page like a human
      await page.mouse.wheel(0, -200);
      await humanDelay(5000, 10000);

      // 5. Occasionally click a link
      if (Math.random() > 0.7) {
        console.log(`[BrowserAgent] Clicking organic link...`);
        const links = await page.$$('a');
        // Filter for organic-looking links (not unsubscribe, not settings)
        for (const link of links) {
          const href = await link.getAttribute('href');
          const text = await link.innerText();
          if (href && href.startsWith('http') && !text.toLowerCase().includes('unsubscribe')) {
            await link.click({ modifiers: ['Control'] }); // Open in new tab
            await humanDelay(5000, 15000);
            break;
          }
        }
      }
    }

    // Return current cookies to persist session
    return await context.cookies();
  } catch (error) {
    console.error(`[BrowserAgent] Session failed for ${email}:`, error);
    return null;
  } finally {
    if (browser) await browser.close();
  }
}

/**
 * Module 2: The Newsletter Farm (The Subscriber)
 * Subscribes the account to high-authority newsletters.
 */
export async function subscribeToNewsletter(email: string, newsletterUrl: string, inputSelector: string) {
  let browser: Browser | null = null;
  try {
    browser = await chromium.connectOverCDP(BROWSER_WS_ENDPOINT);
    const context = await browser.newContext();
    const page = await context.newPage();

    console.log(`[NewsletterFarm] Subscribing ${email} to ${newsletterUrl}`);
    await page.goto(newsletterUrl, { waitUntil: 'domcontentloaded' });
    await humanDelay(3000, 5000);

    // Human-like typing
    await page.type(inputSelector, email, { delay: Math.random() * 100 + 50 });
    await humanDelay(1000, 2000);
    await page.keyboard.press('Enter');
    
    await humanDelay(5000, 8000);
    console.log(`[NewsletterFarm] Subscription submitted for ${email}`);
    return true;
  } catch (error) {
    console.error(`[NewsletterFarm] Failed to subscribe ${email}:`, error);
    return false;
  } finally {
    if (browser) await browser.close();
  }
}

/**
 * Categorization Script: Proves reputation by moving from Spam/Promo to Primary
 */
export async function rescueFromSpam(email: string, cookies: any[]) {
  let browser: Browser | null = null;
  try {
    browser = await chromium.connectOverCDP(BROWSER_WS_ENDPOINT);
    const context = await browser.newContext();
    await context.addCookies(cookies);
    const page = await context.newPage();

    // Go to Spam
    await page.goto('https://mail.google.com/mail/u/0/#spam');
    await humanDelay(3000, 5000);

    // Look for legitimate-looking emails or our own warmup mails
    // This is simplified; real logic would use specific selectors
    const spamMails = await page.$$('tr.zA');
    if (spamMails.length > 0) {
      await spamMails[0].click();
      await humanDelay(2000, 4000);
      
      // Click "Not Spam"
      const notSpamBtn = await page.getByText('Not spam', { exact: false });
      if (await notSpamBtn.isVisible()) {
        await notSpamBtn.click();
        console.log(`[BrowserAgent] Rescued email from spam for ${email}`);
      }
    }
  } finally {
    if (browser) await browser.close();
  }
}
