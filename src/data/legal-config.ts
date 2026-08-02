import type { LegalConfig } from '@/lib/types';

import { storeConfig } from '@/data/store-config';

/**
 * Legal policy content for the Homeiffy storefront.
 *
 * These documents describe how the store actually operates: Stripe handles all
 * card data, Resend sends transactional mail, browser storage holds the cart and
 * wishlist, and no advertising or analytics trackers are loaded. If any of those
 * operational facts change, update the matching section here at the same time.
 *
 * Homeiffy LLC should have counsel review this language against its final
 * fulfilment and carrier agreements before relying on it in a dispute.
 */

const EFFECTIVE_DATE = 'August 3, 2026';
const LAST_UPDATED = 'August 3, 2026';

const LEGAL_NAME = storeConfig.legalName;
const SUPPORT_EMAIL = storeConfig.supportEmail;
const PHONE = storeConfig.phoneDisplay;
const MAILING_ADDRESS = `${storeConfig.registeredAddress.line1}, ${storeConfig.registeredAddress.city}, ${storeConfig.registeredAddress.state} ${storeConfig.registeredAddress.postalCode}`;

const CONTACT_LINES = [
  LEGAL_NAME,
  MAILING_ADDRESS,
  `Email: ${SUPPORT_EMAIL}`,
  `Phone: ${PHONE}`,
];

export const legalConfig: LegalConfig = {
  productionLaunchBlocked: false,
  addressVerificationRequired: false,
  addressVerificationNote: storeConfig.registeredAddress.verificationNote,
  launchBlockers: [],
  policies: [
    // ─── Privacy Policy ──────────────────────────────────────────────────
    {
      id: 'privacy-policy',
      slug: 'privacy-policy',
      title: 'Privacy Policy',
      summary:
        'We collect only what we need to take your order, ship your furniture and answer your questions. We do not sell your personal information, and we do not run advertising or analytics trackers on this site.',
      effectiveDate: EFFECTIVE_DATE,
      lastUpdated: LAST_UPDATED,
      sections: [
        {
          heading: 'Who we are',
          body: [
            `${LEGAL_NAME} ("Homeiffy", "we", "us" or "our") operates this website and sells furniture directly to customers in the United States. This policy explains what personal information we collect, why we collect it, who we share it with, and the choices you have.`,
            'This policy applies to this website and to email we send you about your orders. It does not apply to third-party websites we link to.',
          ],
        },
        {
          heading: 'Information you give us',
          body: [
            'We collect the following directly from you, only when you choose to provide it:',
          ],
          bullets: [
            'Order information: name, shipping address, billing address, email address and phone number, so we can process and deliver your order.',
            'Delivery details: apartment or unit number, floor, access notes and any delivery instructions you add at checkout.',
            'Contact and quote requests: your name, email, phone number and the content of your message.',
            'Newsletter signup: your email address, if you subscribe.',
            'Order lookup: the order reference and email address you enter on the order tracking page.',
          ],
        },
        {
          heading: 'Payment information',
          body: [
            'We do not collect, process or store your card number, expiry date or security code. Payments are handled entirely by Stripe, Inc., a PCI-DSS Level 1 certified payment processor. Your card details are sent directly to Stripe and never pass through or rest on Homeiffy servers.',
            'We receive from Stripe only a confirmation of payment status, the last four digits of the card, the card brand, and the billing address associated with the payment. Stripe processes your payment information under its own privacy policy, available at stripe.com/privacy.',
          ],
        },
        {
          heading: 'Information collected automatically',
          body: [
            'We deliberately keep this minimal. This site does not load Google Analytics, advertising pixels, social media trackers, session recording tools or cross-site behavioural profiling of any kind.',
            'Our servers record the IP address of requests to our contact, quote, newsletter and checkout endpoints. We use this solely for rate limiting, to stop automated abuse and spam submissions. These records are short-lived and are not used to build a profile of you.',
          ],
        },
        {
          heading: 'Browser storage and cookies',
          body: [
            'Your shopping cart, wishlist, compare list and saved room layouts are stored in your own browser using local storage. That information stays on your device. It is not transmitted to us until you actually place an order, and we cannot read it before then.',
            'You can clear this at any time through your browser settings. Doing so empties your cart and wishlist.',
            'Stripe sets its own cookies on the hosted checkout page for fraud prevention and to keep your payment session working. Those cookies are strictly necessary to take a payment securely.',
          ],
        },
        {
          heading: 'How we use your information',
          bullets: [
            'To process your order, take payment, and arrange delivery.',
            'To send transactional email: order confirmation, shipping notifications, delivery updates and return authorisations.',
            'To respond to contact form messages, quote requests and customer service questions.',
            'To send marketing email, only if you have subscribed to our newsletter.',
            'To detect and prevent fraud, abuse and automated attacks.',
            'To meet our legal, tax and accounting obligations.',
          ],
        },
        {
          heading: 'Who we share information with',
          body: [
            'We do not sell your personal information. We do not share it for cross-context behavioural advertising. We disclose it only to the service providers who make the store work, and only to the extent they need it:',
          ],
          table: {
            columns: ['Recipient', 'Purpose', 'What they receive'],
            rows: [
              [
                'Stripe, Inc.',
                'Payment processing and fraud prevention',
                'Payment details, billing address, email, order total',
              ],
              [
                'Resend',
                'Sending transactional and newsletter email',
                'Your email address and message content',
              ],
              [
                'Shipping and freight carriers',
                'Delivering your order',
                'Name, delivery address, phone number, access notes',
              ],
              [
                'Hosting and infrastructure providers',
                'Running the website and storing order records',
                'Order and account data at rest',
              ],
            ],
          },
        },
        {
          heading: 'Other disclosures',
          body: [
            'We may disclose personal information where we are legally required to do so, in response to lawful requests by public authorities, to enforce our Terms and Conditions, or to protect the rights, property or safety of Homeiffy, our customers or others.',
            'If Homeiffy is involved in a merger, acquisition or sale of assets, customer information may be transferred as part of that transaction. We will notify you before your information becomes subject to a materially different privacy policy.',
          ],
        },
        {
          heading: 'How long we keep it',
          bullets: [
            'Order records: retained for seven years to satisfy tax, accounting and warranty obligations.',
            'Contact and quote messages: retained for up to two years after the enquiry is resolved.',
            'Newsletter subscriptions: retained until you unsubscribe.',
            'Rate limiting records: retained for a short rolling window measured in hours, then discarded.',
          ],
        },
        {
          heading: 'Your privacy rights',
          body: [
            'Depending on where you live, you may have the right to request access to the personal information we hold about you, correction of inaccurate information, deletion of your information, a portable copy of it, and the right not to be discriminated against for exercising these rights.',
            `Residents of California, Virginia, Colorado, Connecticut, Utah, Texas, Oregon, Montana and other states with comprehensive privacy laws have these rights under their state statutes. To exercise any of them, email ${SUPPORT_EMAIL} or write to us at the address below. We will verify your request using the email address associated with your order, and we will respond within the timeframe your state law requires, generally 45 days.`,
            'We do not sell personal information and we do not share it for targeted advertising, so there is nothing for you to opt out of on those grounds. We do not use personal information for automated decision-making or profiling.',
            'If we decline your request, you may appeal by replying to our response. Where your state provides one, you also retain the right to complain to your state Attorney General.',
          ],
        },
        {
          heading: 'Marketing email',
          body: [
            'If you subscribe to our newsletter, you can unsubscribe at any time using the link at the bottom of any marketing email, or by contacting us directly. Unsubscribing from marketing does not stop transactional email about an order you have already placed, since we need to be able to tell you where your furniture is.',
          ],
        },
        {
          heading: "Children's privacy",
          body: [
            'This store is intended for adults. We do not knowingly collect personal information from anyone under 16. If you believe a child has provided us with personal information, contact us and we will delete it.',
          ],
        },
        {
          heading: 'Security',
          body: [
            'All traffic to this site is encrypted in transit using TLS. Payment card data is isolated with Stripe and never reaches our systems. Access to order records is restricted to personnel who need it to fulfil orders and provide support.',
            'No method of transmission or storage is completely secure, and we cannot guarantee absolute security. If we become aware of a breach affecting your personal information, we will notify you and the relevant authorities as required by law.',
          ],
        },
        {
          heading: 'Where your information is processed',
          body: [
            'Homeiffy operates in the United States and our service providers process personal information in the United States. We sell and ship domestically within the United States.',
          ],
        },
        {
          heading: 'Changes to this policy',
          body: [
            'If we change this policy we will update the "Last updated" date at the top of this page. Material changes will be communicated by email to customers with an active order or newsletter subscription.',
          ],
        },
        {
          heading: 'Contact us about privacy',
          body: [
            'For any question about this policy or to exercise your privacy rights, reach us at:',
          ],
          bullets: CONTACT_LINES,
        },
      ],
    },

    // ─── Terms and Conditions ────────────────────────────────────────────
    {
      id: 'terms-conditions',
      slug: 'terms-conditions',
      title: 'Terms and Conditions',
      summary:
        'These terms govern your use of this website and any order you place with Homeiffy. Placing an order means you accept them.',
      effectiveDate: EFFECTIVE_DATE,
      lastUpdated: LAST_UPDATED,
      sections: [
        {
          heading: 'Agreement to these terms',
          body: [
            `These Terms and Conditions form a binding agreement between you and ${LEGAL_NAME}. By browsing this website, creating a cart or placing an order, you accept these terms. If you do not accept them, please do not use the site.`,
            'You must be at least 18 years old and able to form a binding contract to place an order.',
          ],
        },
        {
          heading: 'Products, dimensions and images',
          body: [
            'We publish dimensions for every product because furniture only works if it fits. Dimensions are listed in inches and are measured at the widest, tallest and deepest points unless the product page states otherwise. Manufacturing tolerance of up to one inch is normal for furniture and is not a defect.',
            'Product photography is taken under studio lighting. Wood grain, colour and upholstery texture vary between production batches and between screens, so the piece that arrives will not be a pixel-perfect match to the photograph. Natural variation in wood and fabric is a characteristic of the material, not a fault.',
            'Before ordering, please measure your room and your delivery route. Our measuring guide and doorway fit checker are provided to help with this.',
          ],
        },
        {
          heading: 'Pricing and availability',
          body: [
            'All prices are shown in United States dollars and exclude shipping and applicable sales tax, which are calculated at checkout.',
            'We try to keep pricing and stock accurate, but errors happen. If we discover a material pricing error or an item is unavailable after you order, we will contact you to confirm whether you want to proceed at the correct price or cancel. If we cannot reach you, we will cancel and refund in full. We reserve the right to change prices at any time before an order is accepted.',
            'We may limit or cancel quantities purchased per person, per household or per order.',
          ],
        },
        {
          heading: 'Orders and acceptance',
          body: [
            'Your order is an offer to buy. Submitting payment does not by itself create a contract. A contract forms when we send you an order confirmation email. We may decline an order for reasons including suspected fraud, an address we cannot deliver to, a pricing error, or stock unavailability.',
          ],
        },
        {
          heading: 'Payment',
          body: [
            'We accept the payment methods presented at checkout, processed by Stripe. By submitting payment you confirm you are authorised to use the payment method. Sales tax is calculated based on your delivery address and applicable state and local rates.',
          ],
        },
        {
          heading: 'Shipping and risk of loss',
          body: [
            'Shipping terms, transit expectations and inspection requirements are set out in our Shipping Policy, which forms part of these terms. Title and risk of loss pass to you on delivery to the address you provided.',
            'You are responsible for giving us an accurate delivery address and for telling us about access constraints such as narrow stairwells, elevator restrictions or gated entry. Redelivery charges caused by an incorrect address or a missed delivery appointment are your responsibility.',
          ],
        },
        {
          heading: 'Returns',
          body: [
            'Returns and refunds are governed by our Return and Refund Policy, which forms part of these terms.',
          ],
        },
        {
          heading: 'Assembly and safe use',
          body: [
            'Some products require assembly. Follow the supplied instructions and use the supplied hardware. Do not modify structural components or substitute hardware.',
            'Tall storage furniture including dressers, bookcases and wardrobes must be anchored to a wall to reduce the risk of tip-over, which can cause serious injury or death, particularly to children. Where anchoring hardware is supplied, use it. Where it is not supplied, obtain hardware appropriate to your wall construction before use.',
            'Do not exceed stated weight limits. Do not stand or sit on surfaces not designed to bear that load. Keep children from climbing on drawers, shelves or open cabinet doors.',
          ],
        },
        {
          heading: 'Warranty',
          body: [
            'We warrant that products will be free from defects in materials and workmanship under normal residential use for one year from delivery. This warranty runs to the original purchaser and is not transferable.',
            'It does not cover normal wear, natural variation in wood or fabric, damage from misuse, improper assembly, modification, commercial use, exposure to moisture or direct sunlight, or failure to follow care instructions.',
            'Your remedy under this warranty is repair, replacement of the affected part, or refund, at our option. To make a claim, contact us with your order reference and photographs of the issue.',
          ],
        },
        {
          heading: 'Disclaimer',
          body: [
            'Except for the express warranty above and any rights you have under applicable consumer protection law which cannot be waived, products and this website are provided "as is". To the fullest extent permitted by law we disclaim all implied warranties, including implied warranties of merchantability and fitness for a particular purpose.',
            'Room planning tools, fit checkers and measuring guides on this site are provided to assist your own planning. They are estimates based on the figures you enter. They are not a guarantee that a product will fit your space or pass through your delivery route. You remain responsible for confirming your own measurements.',
          ],
        },
        {
          heading: 'Limitation of liability',
          body: [
            'To the fullest extent permitted by law, Homeiffy will not be liable for indirect, incidental, special, consequential or punitive damages, or for lost profits, arising from your use of this website or any product purchased from us.',
            'Our total aggregate liability arising out of any order is limited to the amount you paid for the product giving rise to the claim.',
            'Some states do not allow the exclusion or limitation of certain damages, so parts of this section may not apply to you. Nothing in these terms limits liability for death or personal injury caused by our negligence, or for fraud.',
          ],
        },
        {
          heading: 'Intellectual property',
          body: [
            'The content of this website, including text, product photography, page design, the Homeiffy name and the Homeiffy logo, is owned by Homeiffy or its licensors and is protected by copyright and trademark law. You may not reproduce, distribute or create derivative works from it without our written permission.',
          ],
        },
        {
          heading: 'Acceptable use',
          bullets: [
            'Do not use this site for any unlawful purpose or in breach of these terms.',
            'Do not attempt to gain unauthorised access to our systems, accounts or data.',
            'Do not scrape, harvest or systematically extract content or pricing from this site.',
            'Do not submit false, fraudulent or abusive orders or enquiries.',
            'Do not interfere with the operation of the site, including by automated request flooding.',
          ],
        },
        {
          heading: 'Governing law and disputes',
          body: [
            'These terms are governed by the laws of the State of Alabama, without regard to its conflict of law rules. You and Homeiffy agree to the exclusive jurisdiction of the state and federal courts located in Alabama for any dispute that is not resolved informally.',
            `Before filing a claim, please contact us at ${SUPPORT_EMAIL} so we can try to resolve the matter directly. Most issues are settled quickly this way.`,
          ],
        },
        {
          heading: 'General',
          body: [
            'If any provision of these terms is found unenforceable, the remaining provisions stay in force. Our failure to enforce a provision is not a waiver of it. These terms, together with our Privacy Policy, Shipping Policy and Return and Refund Policy, are the entire agreement between you and Homeiffy regarding this website and your order.',
            'We may update these terms from time to time. The version in effect when you place your order governs that order.',
          ],
        },
        {
          heading: 'Contact',
          bullets: CONTACT_LINES,
        },
      ],
    },

    // ─── Shipping Policy ─────────────────────────────────────────────────
    {
      id: 'shipping-policy',
      slug: 'shipping-policy',
      title: 'Shipping Policy',
      summary:
        'We ship furniture across the contiguous United States. Shipping is calculated by item size and destination, and is shown in full at checkout before you pay.',
      effectiveDate: EFFECTIVE_DATE,
      lastUpdated: LAST_UPDATED,
      sections: [
        {
          heading: 'Where we ship',
          body: [
            'We currently ship to residential and business addresses in the 48 contiguous United States.',
            'We do not ship to Alaska, Hawaii, United States territories, PO boxes, APO or FPO addresses, or international destinations. If you need delivery to one of these, contact us before ordering and we will tell you whether we can arrange a freight quote.',
          ],
        },
        {
          heading: 'How shipping is calculated',
          body: [
            'Furniture does not ship at one flat rate, because a nesting table set and a queen platform bed are completely different problems for a carrier. We price shipping by the size and handling requirements of each item, then adjust for your destination. The full amount is shown at checkout before you pay.',
          ],
          table: {
            columns: ['Shipping class', 'Typical items', 'Base rate'],
            rows: [
              [
                'Small Furniture Parcel',
                'Desk chairs, nesting tables, small accents',
                '$29',
              ],
              [
                'Standard Furniture Parcel',
                'Nightstands, consoles, dining chairs',
                '$49',
              ],
              ['Fragile Surface', 'Finish-sensitive surfaces', '$69'],
              ['Glass Component', 'Products with glass panels or inserts', '$79'],
              [
                'Multi-Box Furniture',
                'Dressers, sideboards, hall trees, sets',
                '$89',
              ],
              [
                'Upholstered Furniture',
                'Sofas, loveseats, upholstered storage',
                '$129',
              ],
              [
                'Oversized Furniture',
                'Platform beds, bookcases, media consoles',
                '$149',
              ],
              [
                'Freight Review Required',
                'Large combined orders or restricted access',
                'Quoted individually',
              ],
            ],
          },
        },
        {
          heading: 'Destination adjustments',
          bullets: [
            'Orders delivering to the Northeast corridor carry an 8 percent regional adjustment.',
            'Orders delivering to California carry a 5 percent regional adjustment.',
            'Multi-item orders are priced per item and per carton, since each piece is handled separately by the carrier.',
          ],
        },
        {
          heading: 'Processing and transit times',
          body: [
            'Orders are processed within 1 to 3 business days. You will receive tracking information by email once your order leaves our fulfilment partner.',
          ],
          table: {
            columns: ['Service', 'Typical transit after dispatch'],
            rows: [
              ['Parcel classes', '3 to 7 business days'],
              ['Multi-box furniture', '5 to 10 business days'],
              ['Oversized and upholstered freight', '7 to 21 business days'],
            ],
          },
        },
        {
          heading: 'Freight deliveries',
          body: [
            'Larger pieces ship by freight rather than parcel carrier. The freight company will call you to schedule a delivery appointment, usually within a four-hour window. Someone aged 18 or over must be present to receive and sign for the delivery.',
            'Standard freight service is threshold delivery: the carrier brings the item to the first dry, covered space at your entrance, such as a garage or just inside the front door. It does not include carrying items upstairs, unpacking, assembly or packaging removal.',
            'Tell us at checkout about stairs, narrow doorways, elevator restrictions or gated access. Carriers may refuse a delivery they cannot complete safely, and a redelivery fee may apply.',
          ],
        },
        {
          heading: 'Inspect your delivery before you sign',
          body: [
            'This matters, and it is the one step customers most often skip. Once you sign a clean delivery receipt, it becomes much harder to claim transit damage.',
          ],
          bullets: [
            'Check every carton for crushing, punctures, water staining or a rattling sound before signing.',
            'If a carton looks damaged, write "damaged" or "subject to inspection" on the delivery receipt before you sign it.',
            'Photograph the packaging and the item before and during unpacking.',
            'Report visible transit damage to us within 72 hours of delivery, with photographs.',
            'Do not refuse a whole delivery for minor packaging scuffs. Note it, accept it, and contact us.',
          ],
        },
        {
          heading: 'Missed deliveries and address changes',
          body: [
            'If you miss a scheduled freight appointment, the carrier will attempt to reschedule and a redelivery fee may be passed on to you. If we cannot deliver after repeated attempts, the order may be returned to us and refunded less the outbound and return shipping cost.',
            'We can change a delivery address only before the order is dispatched. Contact us immediately if you need to change it.',
          ],
        },
        {
          heading: 'Split shipments',
          body: [
            'Items in one order may ship separately if they come from different fulfilment points or belong to different shipping classes. You are not charged twice for this. Each shipment gets its own tracking notification.',
          ],
        },
        {
          heading: 'Delays outside our control',
          body: [
            'Severe weather, carrier network disruption, natural disasters and other events beyond our reasonable control can delay delivery. We will keep you informed and will not treat those delays as a breach of these terms.',
          ],
        },
        {
          heading: 'Questions about a shipment',
          bullets: CONTACT_LINES,
        },
      ],
    },

    // ─── Return and Refund Policy ────────────────────────────────────────
    {
      id: 'return-refund-policy',
      slug: 'return-refund-policy',
      title: 'Return and Refund Policy',
      summary:
        'You have 30 days from delivery to return most furniture in its original condition and packaging. Damaged or defective items are always our problem to fix, at no cost to you.',
      effectiveDate: EFFECTIVE_DATE,
      lastUpdated: LAST_UPDATED,
      sections: [
        {
          heading: 'The 30 day window',
          body: [
            'You may request a return within 30 days of delivery. The item must be unused, in its original condition, and repacked in its original packaging with all hardware and documentation included.',
            'Furniture that has been assembled and then disassembled is usually not resaleable. Please dry-fit and check dimensions before you fully assemble a piece if you are unsure about keeping it.',
          ],
        },
        {
          heading: 'How to start a return',
          body: [
            'Returns sent back without an authorisation may be refused or may not be refundable, because we have no way to match them to your order.',
          ],
          bullets: [
            `Email ${SUPPORT_EMAIL} or call ${PHONE} with your order reference.`,
            'Tell us which item you are returning and why. Photographs help, especially for damage.',
            'We will send you a return authorisation and instructions. Do not ship anything back before you have this.',
            'Repack the item in its original carton and attach the return label or booking details we provide.',
          ],
        },
        {
          heading: 'Return shipping costs',
          body: [
            'For a change of mind return, you are responsible for return shipping. We will either provide a prepaid label and deduct the actual cost from your refund, or let you arrange your own carrier.',
            'Return freight on large items is genuinely expensive, often comparable to the outbound cost shown in our Shipping Policy. We tell you the amount in writing before you commit to the return, so there are no surprises.',
            'If the item is damaged, defective or not what you ordered, return shipping is free and we cover it in full.',
          ],
        },
        {
          heading: 'Damaged, defective or incorrect items',
          body: [
            'If your furniture arrives damaged, has a manufacturing defect, or is simply not the item you ordered, contact us within 72 hours of delivery for transit damage, or as soon as you find it for a defect.',
            'Send us photographs of the item, the damage and the packaging. We will arrange, at our cost and at your choice where practical: a replacement part, a replacement item, a repair, or a full refund including original shipping.',
            'You will never pay return shipping for an item that arrived damaged or defective.',
          ],
        },
        {
          heading: 'Restocking',
          body: [
            'We do not charge a restocking fee on items returned in original, resaleable condition within the 30 day window.',
            'A deduction of up to 25 percent may apply where an item is returned assembled, without its original packaging, or with damage caused after delivery. We will always tell you the amount and the reason before processing the refund.',
          ],
        },
        {
          heading: 'Items we cannot accept back',
          bullets: [
            'Items returned more than 30 days after delivery.',
            'Items damaged by misuse, improper assembly, modification or accident after delivery.',
            'Items returned without their original packaging where that packaging was required to ship safely.',
            'Products made or modified to your custom specification.',
            'Clearance or final sale items, which are marked as such on the product page before purchase.',
          ],
        },
        {
          heading: 'Cancelling an order',
          body: [
            'You can cancel free of charge at any point before your order is dispatched. Contact us as soon as possible with your order reference.',
            'Once an item has been dispatched, cancellation is handled as a standard return and return shipping applies.',
          ],
        },
        {
          heading: 'Refunds',
          body: [
            'Once we receive and inspect your return we will email you to confirm the outcome. Approved refunds are issued to the original payment method within 5 to 10 business days. How quickly it appears on your statement depends on your bank or card issuer.',
            'Refunds include the price of the item and any sales tax paid on it. Original outbound shipping is refunded when the return is due to damage, a defect or our error, and is not refunded on a change of mind return.',
          ],
        },
        {
          heading: 'Exchanges',
          body: [
            'The fastest way to exchange an item, including for a different finish or upholstery, is to return the original for a refund and place a new order. This avoids waiting for the return to arrive before the replacement ships.',
          ],
        },
        {
          heading: 'Warranty claims',
          body: [
            'Defects appearing after the 30 day return window are handled under the one year warranty set out in our Terms and Conditions. Contact us with your order reference and photographs.',
          ],
        },
        {
          heading: 'Contact us about a return',
          bullets: CONTACT_LINES,
        },
      ],
    },

    // ─── Accessibility Statement ─────────────────────────────────────────
    {
      id: 'accessibility',
      slug: 'accessibility',
      title: 'Accessibility Statement',
      summary:
        'We aim to meet WCAG 2.1 Level AA across this website. If anything here is hard to use with assistive technology, tell us and we will fix it.',
      effectiveDate: EFFECTIVE_DATE,
      lastUpdated: LAST_UPDATED,
      sections: [
        {
          heading: 'Our commitment',
          body: [
            `${LEGAL_NAME} is committed to making this website usable by everyone, including people who browse with screen readers, keyboard navigation, screen magnification, speech input or reduced motion settings.`,
            'We measure ourselves against the Web Content Accessibility Guidelines (WCAG) 2.1 at Level AA, and we treat accessibility defects as ordinary bugs to be fixed rather than optional extras.',
          ],
        },
        {
          heading: 'What we have built in',
          bullets: [
            'Semantic HTML landmarks and a logical heading order on every page.',
            'A visible keyboard focus indicator, and a skip link to jump straight to main content.',
            'Full keyboard operation for menus, dialogs, the cart drawer and the search overlay, including focus trapping and Escape to close.',
            'Descriptive alternative text on product photography.',
            'Form labels tied to their inputs, with errors announced and summarised rather than shown by colour alone.',
            'Colour contrast checked against WCAG AA thresholds for body text and interface controls.',
            'Touch targets sized to at least 44 by 44 pixels.',
            'Support for the operating system reduced motion setting, which disables non-essential animation.',
            'Text that reflows without horizontal scrolling when zoomed to 200 percent.',
          ],
        },
        {
          heading: 'Accessibility of furniture information',
          body: [
            'Product dimensions are published as text, not only inside images or diagrams, so a screen reader can read them out. Where we show a dimension diagram, the same measurements are available in the specification table beside it.',
            'Finish and upholstery options are labelled by name as well as by colour swatch, so colour is never the only way to tell options apart.',
          ],
        },
        {
          heading: 'Known limitations',
          body: ['We are honest about where we are still working:'],
          bullets: [
            'Some room planning and layout tools are visual by nature. Where a tool is difficult to use non-visually, contact us and we will walk you through the same information and help you place an order directly.',
            'Third-party checkout pages hosted by Stripe are subject to the accessibility conformance of Stripe, which we do not control.',
          ],
        },
        {
          heading: 'Tell us about a barrier',
          body: [
            'If you hit something on this site you cannot use, we want to hear about it. Please tell us the page, what you were trying to do, and the assistive technology and browser you were using. We aim to respond within 3 business days.',
            'If you would rather place an order by phone than through the website, call us and we will take the order for you.',
          ],
          bullets: CONTACT_LINES,
        },
        {
          heading: 'Formal complaints',
          body: [
            'If our response does not resolve the issue to your satisfaction, you may escalate it by writing to us at the postal address above marked for the attention of the accessibility coordinator.',
          ],
        },
      ],
    },
  ],
};

export function isProductionLaunchAllowed(): boolean {
  return (
    !legalConfig.productionLaunchBlocked &&
    !legalConfig.addressVerificationRequired &&
    legalConfig.launchBlockers.length === 0
  );
}

export function getPolicyBySlug(slug: string) {
  return legalConfig.policies.find((policy) => policy.slug === slug);
}
