export const brandColors = {
  roomInk: '#252D32',
  homeiffyTeal: '#456C6A',
  deepOlive: '#65705B',
  clayEmber: '#B76D55',
  warmMustard: '#C69E51',
  softPlum: '#766275',
  naturalOak: '#BCA98C',
  canvasCream: '#F6F1E8',
  galleryWhite: '#FFFFFF',
  softGraphite: '#656A6C',
  borderSand: '#D9D1C5',
} as const;

export type BrandColorName = keyof typeof brandColors;
