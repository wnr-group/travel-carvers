/**
"Additional Information" section.
 */

export interface CancellationRule {
  window: string;
  refund: string;
}

export const DEFAULT_CANCELLATION_POLICY: CancellationRule[] = [
  { window: '30+ days before departure', refund: '90% refund' },
  { window: '15–29 days before departure', refund: '50% refund' },
  { window: '7–14 days before departure', refund: '25% refund' },
  { window: 'Within 7 days', refund: 'No refund' },
];

export const DEFAULT_REQUIRED_DOCUMENTS: string[] = [
  'Government-issued photo ID (passport for international travel)',
  '2 recent passport-size photographs',
  'Valid travel insurance certificate (recommended)',
  'Any visas or permits required for the destination',
];
