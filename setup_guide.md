# Setup Guide: MyOutreach

## 1. Google Workspace App Passwords
Since this is an internal tool, we avoid complex OAuth flows by using App Passwords.

1. Log in to your Google Workspace account.
2. Go to **Manage your Google Account** > **Security**.
3. Ensure **2-Step Verification** is turned ON.
4. Search for **App Passwords** at the top.
5. Select "Mail" and "Custom Name" (e.g., MyOutreach).
6. Copy the 16-character code. This is the password you use in MyOutreach settings.

## 2. Outlook/Office365
1. Go to your Microsoft Account Security page.
2. Select **Advanced security options**.
3. Under **App passwords**, select **Create a new app password**.
4. Use this password in the system.

## 3. IMAP Strategy (Unified Inbox)
To handle 30+ accounts without crashing:
- **Do not poll every 1 second.** 
- Use the `IDLE` command in IMAP to receive real-time notifications.
- Maintain a pool of connections (persistent Node.js process).
- Reconnect exponentially on failure.

## 4. Organic Engagement (Phase 7)
The system uses a headless browser (Playwright) via a dedicated `browserless` container to simulate human behavior.

1. **Browserless Endpoint**: Ensure `BROWSER_WS_ENDPOINT` points to your `browser` container (default: `ws://browser:3000`).
2. **Newsletter Farm**: The system periodically signs up accounts for newsletters like *Morning Brew* or *Substack* to build "good traffic" history.
3. **Rescue from Spam**: The agent will automatically check Spam/Promotions folders and move verified emails to the Primary inbox to signal domain health to ESPs.
4. **Human Sessions**: Sessions are randomized. Never run more than 3 sessions per day per account to avoid looking like a scraper.

## 5. Environment Variables
Ensure the following are set in your deployment:
- `DATABASE_URL`: Postgres connection string.
- `REDIS_URL`: Redis connection string for BullMQ.
- `API_KEY`: Your Google Gemini API Key.
- `APP_SECRET`: For encrypting stored App Passwords.
- `BROWSER_WS_ENDPOINT`: WebSocket URL for the Playwright agent.