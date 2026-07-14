export const brandColors = {
  roomInk: '#F4F4F4',
  homeiffyTeal: '#E8A24B',
  deepOlive: '#9A8B6D',
  clayEmber: '#E85D4C',
  warmMustard: '#E8A24B',
  softPlum: '#C4B8C8',
  naturalOak: '#A89070',
  canvasCream: '#0B0B0B',
  galleryWhite: '#161616',
  softGraphite: '#9A9A9A',
  borderSand: '#2A2A2A',
} as const;

export type BrandColorName = keyof typeof brandColors;
