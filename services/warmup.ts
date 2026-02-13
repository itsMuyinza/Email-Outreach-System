
import { spinText, WARMUP_TEMPLATES } from '../utils/spintax';

interface SimpleAccount {
  id: string;
  email: string;
  domain: string;
  firstName: string;
}

/**
 * Module 1: Generate safe warmup pairings
 * Rule: Never email accounts on the same domain.
 */
export function generateWarmupPairings(accounts: SimpleAccount[]) {
  const pairings: { sender: SimpleAccount; receiver: SimpleAccount }[] = [];
  const domains = [...new Set(accounts.map(a => a.domain))];
  
  if (domains.length < 2) {
    throw new Error("Warmup requires at least 2 distinct domains for safety.");
  }

  // Group accounts by domain
  const byDomain: Record<string, SimpleAccount[]> = {};
  accounts.forEach(acc => {
    if (!byDomain[acc.domain]) byDomain[acc.domain] = [];
    byDomain[acc.domain].push(acc);
  });

  // Simple rotation logic across domains
  for (let i = 0; i < accounts.length; i++) {
    const sender = accounts[i];
    
    // Find a receiver from a different domain
    const otherDomains = domains.filter(d => d !== sender.domain);
    const targetDomain = otherDomains[Math.floor(Math.random() * otherDomains.length)];
    const potentialReceivers = byDomain[targetDomain];
    const receiver = potentialReceivers[Math.floor(Math.random() * potentialReceivers.length)];
    
    pairings.push({ sender, receiver });
  }

  return pairings.map(pair => {
    const template = WARMUP_TEMPLATES[Math.floor(Math.random() * WARMUP_TEMPLATES.length)];
    return {
      senderId: pair.sender.id,
      receiverEmail: pair.receiver.email,
      subject: spinText(template.subject).replace('{FirstName}', pair.receiver.firstName),
      body: spinText(template.body)
        .replace('{FirstName}', pair.receiver.firstName)
        .replace('{YourName}', pair.sender.firstName)
    };
  });
}
