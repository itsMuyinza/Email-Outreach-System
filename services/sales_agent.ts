
/**
 * Phase 8: The Sales Agent (Autopilot)
 * Handles incoming leads autonomously.
 */

import { analyzeSentimentAndDraft } from './ai';
import { getSenderForReply } from './campaign';

interface IncomingMessage {
  threadId: string;
  leadId: string;
  senderEmail: string; // The lead's email
  receiverEmail: string; // Our sender account email
  subject: string;
  body: string;
  campaignId: string;
}

/**
 * Autonomous logic for the Sales Reply Agent.
 */
export async function processLeadReply(msg: IncomingMessage, agentConfig: any) {
  console.log(`[SalesAgent] Processing reply from ${msg.senderEmail}...`);

  // 1. Categorize & Draft using Gemini
  const aiResult = await analyzeSentimentAndDraft(msg.body);
  
  if (!aiResult || aiResult.sentiment === 'Negative' || aiResult.sentiment === 'Unsubscribe') {
    console.log(`[SalesAgent] Sentiment: ${aiResult?.sentiment || 'Unknown'}. Lead marked as inactive.`);
    // Update CRM Status to 'INACTIVE' or 'UNSUBSCRIBED' here
    return;
  }

  // 2. Filter based on Agent Config
  if (aiResult.sentiment === 'OOO' && !agentConfig.handleOOO) {
    console.log(`[SalesAgent] OOO detected but agent is not configured to handle it.`);
    return;
  }

  if (aiResult.sentiment === 'Positive' && agentConfig.autopilot) {
    // 3. Human-like randomized delay (Thinking Time)
    const thinkingTime = Math.floor(Math.random() * (15 - 5 + 1) + 5); // 5 to 15 mins
    console.log(`[SalesAgent] Positive intent detected. Initiating ${thinkingTime}min thinking delay...`);

    // In a real system, this would be a scheduled task via BullMQ or a timeout
    // setTimeout(async () => {
    //   // 4. Dispatch Reply
    //   // const sender = getSenderForReply(msg.receiverEmail, allAccounts, campaignSmtpIds);
    //   // if (sender) {
    //   //   await sendMail(sender, msg.senderEmail, `Re: ${msg.subject}`, aiResult.draft);
    //   //   console.log(`[SalesAgent] Autopilot reply dispatched to ${msg.senderEmail}`);
    //   // }
    // }, thinkingTime * 60 * 1000);
  } else {
    console.log(`[SalesAgent] Agent is in Draft mode. Reply saved to Unibox.`);
    // Store aiResult.draft in DB for user to review in Unibox
  }
}
