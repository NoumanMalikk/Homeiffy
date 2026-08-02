import type { FaqItem } from '@/lib/types';

import { storeConfig } from '@/data/store-config';

const SUPPORT_EMAIL = storeConfig.supportEmail;
const PHONE = storeConfig.phoneDisplay;

export const faqItems: FaqItem[] = [
  // ── Dimensions ──
  {
    id: 'dimensions-accuracy',
    category: 'Dimensions',
    question: 'Are the dimensions on the website accurate?',
    answer:
      'Yes. Every product page lists overall width, height and depth in inches, measured at the widest, tallest and deepest points. Seating also lists seat height, seat depth and arm height, because those are the numbers that decide whether a chair works at your table. Furniture carries a manufacturing tolerance of up to one inch, which is normal and is not a defect.',
  },
  {
    id: 'dimension-diagram',
    category: 'Dimensions',
    question: 'Do you show a dimension diagram?',
    answer:
      'Yes. Each product page includes a labelled dimension diagram alongside the specification table. The same measurements are published as text as well, so a screen reader can read them out.',
  },
  {
    id: 'package-dimensions',
    category: 'Dimensions',
    question: 'How do I know it will fit through my door?',
    answer:
      'Check the carton size, not the assembled size, because the box is what has to get through the doorway. Carton dimensions and the number of cartons are listed under Packaging and delivery on every product page. Our Doorway Fit Checker will compare those figures against your measurements.',
  },
  {
    id: 'fit-guarantee',
    category: 'Dimensions',
    question: 'Can you guarantee a piece will fit my room or doorway?',
    answer:
      'No. We publish exact dimensions and give you tools to check, but we cannot guarantee fit because we cannot see your space. Measure your room, your doorway, your hallway turns, your stairwell and your elevator before ordering. If a piece will not fit, that is a change of mind return and return shipping applies.',
  },

  // ── Shipping ──
  {
    id: 'shipping-calculation',
    category: 'Shipping',
    question: 'How is shipping calculated?',
    answer:
      'By the size and handling requirements of each item, then adjusted for your destination. Rates run from $29 for a small parcel item to $149 for oversized furniture, with adjustments of 5 percent for California and 8 percent for the Northeast. The full amount is shown at checkout before you pay. The complete rate card is on our Shipping Policy page.',
  },
  {
    id: 'shipping-time',
    category: 'Shipping',
    question: 'How long will delivery take?',
    answer:
      'Orders are processed within 1 to 3 business days. After dispatch, parcel items typically take 3 to 7 business days, multi-box furniture 5 to 10 business days, and oversized or upholstered freight 7 to 21 business days. You will get tracking by email when the order leaves our fulfilment partner.',
  },
  {
    id: 'shipping-destinations',
    category: 'Shipping',
    question: 'Where do you ship?',
    answer:
      'To residential and business addresses in the 48 contiguous United States. We do not currently ship to Alaska, Hawaii, United States territories, PO boxes, APO or FPO addresses, or internationally. Contact us before ordering if you need one of those and we will tell you whether a freight quote is possible.',
  },
  {
    id: 'white-glove',
    category: 'Shipping',
    question: 'Do you offer white-glove or room-of-choice delivery?',
    answer:
      'Not at this time. Freight deliveries are threshold service: the carrier brings the item to the first dry, covered space at your entrance, such as a garage or just inside the front door. It does not include carrying items upstairs, unpacking, assembly or packaging removal.',
  },
  {
    id: 'local-pickup',
    category: 'Shipping',
    question: 'Can I pick up an order in person?',
    answer:
      'No. We ship direct and do not operate a public showroom, warehouse or pickup location. The registered business address is for correspondence only.',
  },

  // ── Assembly ──
  {
    id: 'assembly-required',
    category: 'Assembly',
    question: 'Does the furniture need assembling?',
    answer:
      'Most pieces need some assembly, and every product page states exactly what is involved: whether tools are required, what hardware is in the box and what the instructions cover. Several upholstered pieces need only the legs threading on by hand. All required hardware is supplied.',
  },
  {
    id: 'assembly-service',
    category: 'Assembly',
    question: 'Do you provide an assembly service?',
    answer:
      'No, we do not currently offer paid assembly or installation. Each product ships with illustrated instructions and all required fixings.',
  },
  {
    id: 'anchoring',
    category: 'Assembly',
    question: 'Do I really need to anchor tall furniture to the wall?',
    answer:
      'Yes, and this is the one instruction we ask you not to skip. Dressers, bookcases, wardrobes, hall trees, display cabinets and room dividers can tip over and kill a child. Every tall storage piece ships with an anti-tip restraint kit at no extra cost. Fit it into a wall stud before you load the piece. The supplied fixings suit timber studs, so buy fixings rated for your wall if you have masonry or metal studs.',
  },

  // ── Materials ──
  {
    id: 'materials-construction',
    category: 'Materials',
    question: 'What are your products made of?',
    answer:
      'Three constructions across the catalog: solid American white oak for dining tables, platform beds and bistro tables; engineered wood core with white oak veneer and solid oak edging for casegoods such as dressers and sideboards; and powder-coated steel with oak veneer where a slim profile matters. Upholstery is a woven polyester-blend performance fabric over high-resilience foam on a kiln-dried hardwood frame. Every product page states which applies.',
  },
  {
    id: 'veneer-question',
    category: 'Materials',
    question: 'Is veneer worse than solid wood?',
    answer:
      'Not for every application. On a wide dresser top, a veneered panel over a stable core stays flat where a solid slab of the same width will cup with seasonal humidity. We use solid wood where solid wood is the better engineering answer and veneer where it is, and we say which one you are getting on the product page.',
  },
  {
    id: 'finish-variation',
    category: 'Materials',
    question: 'Will the finish match the photograph exactly?',
    answer:
      'No, and no honest furniture retailer will tell you otherwise. Wood grain, colour and fabric texture vary between production batches, and screens render colour differently. The piece will be the finish you chose, but it will not be a pixel-perfect match to the studio photograph. That variation is a property of natural material rather than a fault. If you do not like it, the 30 day return window covers you.',
  },

  // ── Ordering ──
  {
    id: 'order-process',
    category: 'Ordering',
    question: 'How do I place an order?',
    answer:
      'Add items to your cart and check out. Payment is handled by Stripe, so your card details never touch our servers. You will receive an order confirmation email, which is the point at which the contract forms, and a shipping notification with tracking when the order dispatches.',
  },
  {
    id: 'pricing',
    category: 'Ordering',
    question: 'Are prices inclusive of shipping and tax?',
    answer:
      'No. Prices are shown in United States dollars and exclude shipping and sales tax, both of which are calculated at checkout based on your delivery address. You see the full total before you pay.',
  },
  {
    id: 'payment-methods',
    category: 'Ordering',
    question: 'What payment methods do you accept?',
    answer:
      'The card and wallet methods presented at Stripe Checkout. We do not store your card number, expiry date or security code at any point.',
  },
  {
    id: 'cancel-order',
    category: 'Ordering',
    question: 'Can I cancel or change an order?',
    answer:
      'Free of charge at any point before dispatch. Contact us as soon as possible with your order reference. Once an item has dispatched, cancellation is handled as a standard return and return shipping applies.',
  },

  // ── Returns ──
  {
    id: 'returns-policy',
    category: 'Returns',
    question: 'What is your return policy?',
    answer:
      'You have 30 days from delivery to return most furniture in its original condition and packaging. Contact us for a return authorisation before shipping anything back. For a change of mind return you pay return shipping, which on large items is genuinely expensive, and we tell you the amount in writing before you commit. There is no restocking fee on items returned in original, resaleable condition.',
  },
  {
    id: 'damaged-items',
    category: 'Returns',
    question: 'What if my furniture arrives damaged?',
    answer:
      `Inspect every carton before you sign. If anything looks damaged, write "damaged" or "subject to inspection" on the delivery receipt before signing, because a clean signature makes a transit damage claim much harder. Report visible damage to us within 72 hours with photographs, at ${SUPPORT_EMAIL} or ${PHONE}. We will arrange a replacement part, a replacement item, a repair or a full refund at our cost. You never pay return shipping on a damaged or defective item.`,
  },
  {
    id: 'refund-timing',
    category: 'Returns',
    question: 'How long does a refund take?',
    answer:
      'Once we receive and inspect the return, approved refunds are issued to the original payment method within 5 to 10 business days. How quickly it shows on your statement depends on your bank or card issuer.',
  },
  {
    id: 'warranty',
    category: 'Returns',
    question: 'Is there a warranty?',
    answer:
      'Yes. One year from delivery against defects in materials and workmanship under normal residential use, to the original purchaser. It does not cover normal wear, natural material variation, misuse, improper assembly, modification, commercial use or failure to follow the care instructions.',
  },

  // ── Safety ──
  {
    id: 'furniture-safety',
    category: 'Safety',
    question: 'Do you publish weight capacity for seating and shelving?',
    answer:
      'We publish a load rating only where the supplier documents one, and it appears in the safety section of the product page. If a product page does not show a weight capacity, we have not published a figure and you should not assume one. We would rather leave it blank than print a number we cannot stand behind.',
  },
  {
    id: 'tip-over',
    category: 'Safety',
    question: 'Do your products include anti-tip hardware?',
    answer:
      'Every tall storage product ships with an anti-tip restraint kit in the carton at no extra charge, and the product page states that anchoring is required. Wall-mounted pieces ship with a French cleat or equivalent bracket plus a drilling template.',
  },

  // ── Quotes ──
  {
    id: 'quote-request',
    category: 'Quotes',
    question: 'Can I request a quote for a large order?',
    answer:
      'Yes. Submit products, quantities and destination details through the quote request form and we will review it. A quote request is not a guarantee of trade pricing, a quantity discount, a delivery date or approval.',
  },

  // ── Orders and contact ──
  {
    id: 'track-order',
    category: 'Orders',
    question: 'How do I track my order?',
    answer:
      'Use the Track Order page with your order reference and the email address you used at checkout. Tracking details appear as soon as the carrier provides them. We do not display a tracking number before one exists.',
  },
  {
    id: 'contact-us',
    category: 'Contact',
    question: 'How do I get in touch?',
    answer:
      `Email ${SUPPORT_EMAIL} or call ${PHONE}. You can also use the contact form, which routes to the same inbox. We aim to respond within one business day.`,
  },
  {
    id: 'business-address',
    category: 'Contact',
    question: 'Can I visit your address?',
    answer:
      'No. The address in our business records is a registered and correspondence address, not a showroom, warehouse or pickup location. Homeiffy is a Burkville, Alabama based furniture retailer shipping direct to customers.',
  },
  {
    id: 'privacy',
    category: 'Contact',
    question: 'What do you do with my personal information?',
    answer:
      'We use it to process your order, deliver it, and answer your questions. We do not sell it, and this site runs no advertising pixels, analytics trackers or session recording. Your cart and wishlist are stored in your own browser and are not sent to us until you place an order. Full detail is in our Privacy Policy.',
  },
];

export const faqByCategory = faqItems.reduce<Record<string, FaqItem[]>>(
  (acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  },
  {},
);
