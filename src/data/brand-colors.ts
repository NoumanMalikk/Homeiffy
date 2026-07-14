export const brandColors = {
  roomInk: '#12161C',
  homeiffyTeal: '#0F6B63',
  deepOlive: '#3D5548',
  clayEmber: '#E85D4C',
  warmMustard: '#B8793A',
  softPlum: '#554E5C',
  naturalOak: '#C4B7A0',
  canvasCream: '#ECEAE4',
  galleryWhite: '#FFFFFF',
  softGraphite: '#5C6369',
  borderSand: '#CFCBC3',
} as const;

export type BrandColorName = keyof typeof brandColors;
