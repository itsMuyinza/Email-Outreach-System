
/**
 * Recursively parses a Spintax string to select random variations.
 * Handles nested spintax like {A|{B|C}}
 */
export function spinText(text: string): string {
  const pattern = /\{([^{}]+)\}/;
  let currentText = text;
  while (pattern.test(currentText)) {
    currentText = currentText.replace(pattern, (_, content) => {
      const options = content.split('|');
      return options[Math.floor(Math.random() * options.length)];
    });
  }
  return currentText;
}

export const WARMUP_TEMPLATES = [
  {
    subject: "{Quick question|Question for you|Hi {FirstName}|Update|Touching base|{Just|Simply} checking in|Regarding our {chat|discussion}}",
    body: "{Hi|Hello|Hey} {FirstName},\n\n{I hope you are doing well.|Hope you're having a {great|good|productive} week.|How are things {over there|going}?}\n\n{I wanted to|Just wanted to|I'm writing to} {ask about|check on|follow up on} the {project|documents|files|proposal} we {discussed|talked about|mentioned} {last week|recently|the other day}.\n\n{Do you have|Have you had} {a moment|time|a chance} to {review|look at|check} {them|it}? {I'd love to|I want to|Let's} {get this moving|move forward|finalize this} {soon|asap|this week}.\n\n{Let me know.|Thanks,|Best regards,|Talk soon,} {YourName}"
  },
  {
    subject: "{{Meeting|Call} request|Time to {chat|talk}?|Calendar invite|{Sync|Connect} next week?|{Tuesday|Wednesday|Thursday} meeting}",
    body: "{Hi|Hey} {FirstName},\n\n{Are you free|Are you available|Do you have time} {next week|this week|in the coming days} for a {quick|brief|short} {call|chat|sync}?\n\nI want to {go over|discuss|review} the {Q3 plans|marketing strategy|new updates|budget|timeline}. {It shouldn't take long.|It will only take {10|15} mins.|We can keep it short.}\n\n{Let me know what works.|Send me your calendar.|When are you free?} {Cheers,|Best,|Thanks,} {YourName}"
  }
];
