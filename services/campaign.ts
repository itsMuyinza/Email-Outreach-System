
interface AccountStatus {
  id: string;
  email: string;
  sentToday: number;
  dailyLimit: number;
}

interface CampaignConfig {
  id: string;
  smtpAccountIds: string[];
}

/**
 * Module 2: Inbox Rotation / Round-Robin
 * Selects the next available sender based on daily limits.
 */
let lastSelectedIndex = -1;

export function getNextAvailableSender(accounts: AccountStatus[]): AccountStatus | null {
  const activeAccounts = accounts.filter(a => a.sentToday < a.dailyLimit);
  
  if (activeAccounts.length === 0) return null;

  // Cycle through accounts to distribute load
  lastSelectedIndex = (lastSelectedIndex + 1) % accounts.length;
  
  // Find the next active one starting from the cycled index
  for (let i = 0; i < accounts.length; i++) {
    const idx = (lastSelectedIndex + i) % accounts.length;
    const candidate = accounts[idx];
    if (candidate.sentToday < candidate.dailyLimit) {
      lastSelectedIndex = idx;
      return candidate;
    }
  }

  return null;
}

/**
 * Ensures threaded replies go through the same account that started the conversation.
 * If the original account is unavailable, it finds an alternative from the same campaign group.
 */
export function getSenderForReply(
  originalSenderEmail: string, 
  allAccounts: AccountStatus[], 
  campaignSmtpIds: string[]
): AccountStatus | null {
  // 1. Try to find the exact account that sent the initial mail
  const original = allAccounts.find(a => a.email === originalSenderEmail);
  if (original && original.sentToday < original.dailyLimit) {
    return original;
  }

  // 2. Fallback: Find another account allowed for this campaign
  const campaignAccounts = allAccounts.filter(a => 
    campaignSmtpIds.includes(a.id) && 
    a.sentToday < a.dailyLimit
  );

  return campaignAccounts.length > 0 ? campaignAccounts[0] : null;
}
