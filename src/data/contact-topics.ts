export const contactTopics = [
  { value: 'Product question', label: 'Product question' },
  { value: 'Dimensions question', label: 'Dimensions question' },
  { value: 'Materials or finish', label: 'Materials or finish' },
  { value: 'Upholstery', label: 'Upholstery' },
  { value: 'Assembly', label: 'Assembly' },
  { value: 'Furniture safety', label: 'Furniture safety' },
  { value: 'Existing order', label: 'Existing order' },
  { value: 'Shipping', label: 'Shipping' },
  { value: 'Returns', label: 'Returns' },
  { value: 'Quote request', label: 'Quote request' },
  { value: 'Website support', label: 'Website support' },
  { value: 'Other', label: 'Other' },
] as const;

export type ContactTopicValue = (typeof contactTopics)[number]['value'];
