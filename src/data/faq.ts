import type { FaqItem } from '@/lib/types';

export const faqItems: FaqItem[] = [
  {
    id: 'dimensions-accuracy',
    category: 'Dimensions',
    question: 'Are the product dimensions on the website final?',
    answer:
      'Dimensions shown in the catalog reflect the product titles and any fields that have been entered for development review. Height, depth, seat dimensions and package measurements marked as verification required are not final. Confirm all dimensions against verified product records before ordering.',
  },
  {
    id: 'dimension-diagram',
    category: 'Dimensions',
    question: 'Do you provide dimension diagrams for every product?',
    answer:
      'Dimension diagrams will be published when verified measurements and approved product photography are available. Until then, refer to the specification table on each product page and note any fields marked verification required.',
  },
  {
    id: 'fit-guarantee',
    category: 'Dimensions',
    question: 'Can Homeiffy guarantee that furniture will fit my room or doorway?',
    answer:
      'No. Homeiffy does not guarantee fit. Review product dimensions, package dimensions, doorway width, hallway clearance, stair access and elevator dimensions using the Measuring Guide before ordering.',
  },
  {
    id: 'shipping-calculation',
    category: 'Shipping',
    question: 'How is shipping calculated?',
    answer:
      'Shipping is calculated from destination, product weight, package dimensions, box count, quantity, shipping class and access information when carrier integration is configured. Staging shipping rates may appear during development and are clearly labeled. Final shipping policy terms require business review.',
  },
  {
    id: 'white-glove',
    category: 'Shipping',
    question: 'Do you offer white-glove delivery or room-of-choice delivery?',
    answer:
      'No. White-glove delivery, room-of-choice delivery, threshold delivery and furniture installation are not currently offered. These services remain disabled until explicitly configured and approved.',
  },
  {
    id: 'local-pickup',
    category: 'Shipping',
    question: 'Can I pick up furniture locally in Burkville?',
    answer:
      'No. Local pickup is not available. The registered business address is not presented as a public showroom, warehouse or customer pickup location.',
  },
  {
    id: 'assembly-service',
    category: 'Assembly',
    question: 'Does Homeiffy provide assembly or installation?',
    answer:
      'No. Paid assembly and installation services are not currently enabled. Assembly requirements, hardware included and tools required are listed on each product page when verified. Fields marked verification required are not yet confirmed.',
  },
  {
    id: 'assembly-time',
    category: 'Assembly',
    question: 'How long does assembly take?',
    answer:
      'Estimated assembly time is not published until verified instruction documentation is available. Do not rely on unstated assembly duration. Review assembly information on the product page and the Assembly Information page.',
  },
  {
    id: 'materials-verification',
    category: 'Materials',
    question: 'Are materials such as wood species and upholstery composition confirmed?',
    answer:
      'Not for all products. Material, wood species, wood construction, upholstery composition and foam specification fields marked verification required or pending are not confirmed. Homeiffy does not publish solid wood, certification or performance-fabric claims without verified documentation.',
  },
  {
    id: 'finish-variation',
    category: 'Materials',
    question: 'Will the finish or upholstery color match my screen exactly?',
    answer:
      'Screen colors can vary by device and lighting. Finish and upholstery swatches on the website are development references. Exact product photography and verified finish samples are required before live purchase.',
  },
  {
    id: 'production-ready',
    category: 'Ordering',
    question: 'Why can I browse products but not complete a live purchase for some items?',
    answer:
      'Initial catalog products are marked productionReady: false while images, specifications, safety information and pricing undergo verification. Live checkout blocks incomplete products. Staging mode allows interface testing with catalog pricing while purchase eligibility remains governed by verification status.',
  },
  {
    id: 'catalog-pricing',
    category: 'Ordering',
    question: 'Are the prices shown during development final?',
    answer:
      'Prices shown as prices are for development and interface testing. Final retail pricing requires business verification before live mode launch.',
  },
  {
    id: 'returns-policy',
    category: 'Returns',
    question: 'What is your return policy?',
    answer:
      'Return and refund terms require approved business policy language. Refer to the Return and Refund Policy page, which remains subject to business review until finalized.',
  },
  {
    id: 'damaged-items',
    category: 'Returns',
    question: 'What should I do if furniture arrives damaged?',
    answer:
      'Damaged-item procedures require approved business policy language. Contact Homeiffy using the phone number listed on the Contact page. Email support is available only after CONTACT_EMAIL has been configured.',
  },
  {
    id: 'quote-request',
    category: 'Quotes',
    question: 'Will submitting a quote request guarantee pricing or delivery timing?',
    answer:
      'No. Quote requests allow you to submit products, quantities and destination details for structured review. Homeiffy does not promise trade pricing, quantity discounts, delivery dates, installation or quote approval.',
  },
  {
    id: 'furniture-safety',
    category: 'Safety',
    question: 'Is weight capacity listed for seating and storage products?',
    answer:
      'Weight capacity, shelf load and seating load are shown only when verified. Fields marked verification required are not published as confirmed limits. Review the Furniture Safety page and individual product safety sections.',
  },
  {
    id: 'tip-over',
    category: 'Safety',
    question: 'Do your products include anti-tip hardware?',
    answer:
      'Anti-tip and wall-anchoring information is pending verification for applicable products. Homeiffy does not claim tip resistance or child safety without verified manufacturer documentation.',
  },
  {
    id: 'contact-email',
    category: 'Contact',
    question: 'Why is no email address shown on the website?',
    answer:
      'A business contact email has not been provided for public display. Email appears on the website only after the CONTACT_EMAIL environment variable has been configured for production.',
  },
  {
    id: 'business-address',
    category: 'Contact',
    question: 'Can I visit the Burkville address shown in business records?',
    answer:
      'The registered address is not presented as a walk-in store, showroom, warehouse or pickup location. Full address visibility is configurable and disabled by default. Public copy identifies Homeiffy as a Burkville, Alabama-based furniture retailer.',
  },
  {
    id: 'track-order',
    category: 'Orders',
    question: 'How do I track an order?',
    answer:
      'Use the Track Order page with your order reference and the email address used at checkout. Tracking details appear only when stored in the order record. Carrier and tracking numbers are not fabricated.',
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
