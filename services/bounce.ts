
/**
 * Module 4: Automated Bounce & Unsubscribe Handling
 */

const BOUNCE_KEYWORDS = [
  /550\s/i,
  /delivery\sstatus\snotification\s\(failure\)/i,
  /message\snot\sdelivered/i,
  /permanent\sfailure/i,
  /undeliverable/i
];

const UNSUBSCRIBE_KEYWORDS = [
  /stop/i,
  /unsubscribe/i,
  /remove\sme/i,
  /not\sinterested/i,
  /please\sstop/i
];

export function analyzeEmailType(subject: string, body: string): 'BOUNCE' | 'UNSUBSCRIBE' | 'REGULAR' {
  const fullText = `${subject} ${body}`.toLowerCase();
  
  if (BOUNCE_KEYWORDS.some(regex => regex.test(fullText))) {
    return 'BOUNCE';
  }
  
  if (UNSUBSCRIBE_KEYWORDS.some(regex => regex.test(fullText))) {
    return 'UNSUBSCRIBE';
  }
  
  return 'REGULAR';
}
