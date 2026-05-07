export const PRODUCT_IMAGE_SIZE_MAP = {
  '1:1': '1024x1024',
  '4:5': '1024x1280',
  '16:9': '1536x864',
} as const

export type ProductImageSize = keyof typeof PRODUCT_IMAGE_SIZE_MAP

export const PRODUCT_IMAGE_SIZE_OPTIONS: Array<{
  value: ProductImageSize
  label: string
  detail: ProductImageSize
  output: string
}> = [
  { value: '1:1', label: 'Square', detail: '1:1', output: PRODUCT_IMAGE_SIZE_MAP['1:1'] },
  { value: '4:5', label: 'Portrait', detail: '4:5', output: PRODUCT_IMAGE_SIZE_MAP['4:5'] },
  { value: '16:9', label: 'Landscape', detail: '16:9', output: PRODUCT_IMAGE_SIZE_MAP['16:9'] },
]

export function isProductImageSize(value: string): value is ProductImageSize {
  return value in PRODUCT_IMAGE_SIZE_MAP
}
