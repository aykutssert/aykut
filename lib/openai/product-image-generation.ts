import {
  PRODUCT_IMAGE_SIZE_MAP,
  type ProductImageQuality,
  type ProductImageSize,
} from '@/lib/product-image-sizes'

const OPENAI_IMAGE_EDIT_URL = 'https://api.openai.com/v1/images/edits'
const PRODUCT_IMAGE_MODEL = 'gpt-image-2'
const OUTPUT_FORMAT = 'webp'
const OUTPUT_COMPRESSION = '85'
const NO_USER_DIRECTION = 'No extra user direction.'

type GenerateProductImageInput = {
  productImage: Blob
  templateImage: Blob
  prompt: string
  imageSize: ProductImageSize
  imageQuality: ProductImageQuality
}

type OpenAIImageEditResponse = {
  data?: Array<{ b64_json?: string }>
  error?: { message?: string }
}

export async function generateProductImage({
  productImage,
  templateImage,
  prompt,
  imageSize,
  imageQuality,
}: GenerateProductImageInput): Promise<Buffer> {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is not configured')
  }

  const formData = new FormData()
  formData.append('model', PRODUCT_IMAGE_MODEL)
  formData.append('prompt', buildProductImagePrompt(prompt))
  formData.append('size', PRODUCT_IMAGE_SIZE_MAP[imageSize])
  formData.append('quality', imageQuality)
  formData.append('output_format', OUTPUT_FORMAT)
  formData.append('output_compression', OUTPUT_COMPRESSION)
  formData.append('image[]', productImage, 'product.webp')
  formData.append('image[]', templateImage, 'template.webp')

  const response = await fetch(OPENAI_IMAGE_EDIT_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
    body: formData,
  })

  const payload = await response.json().catch(() => null) as OpenAIImageEditResponse | null
  if (!response.ok) {
    throw new Error(payload?.error?.message ?? 'OpenAI image generation failed')
  }

  const imageBase64 = payload?.data?.[0]?.b64_json
  if (!imageBase64) {
    throw new Error('OpenAI image generation returned no image')
  }

  return Buffer.from(imageBase64, 'base64')
}

function buildProductImagePrompt(userPrompt: string) {
  const userDirection = userPrompt.trim() || NO_USER_DIRECTION

  return [
    'Create a realistic ecommerce product photo by placing the user product into the provided template scene.',
    '',
    'Input rules:',
    '- The first image is the source of truth for the product.',
    '- The second image is the source of truth for the scene.',
    '- Treat the template as a scene and style reference, not as a fixed placement mask.',
    '- Use the template scene for background, lighting, camera angle, composition, mood, surface, props, and visual style.',
    '',
    'Product preservation rules:',
    '- Preserve the product shape, packaging, material, label placement, colors, proportions, and visible text as accurately as possible.',
    '- Preserve the full product image without cropping, stretching, or distorting it unless the user explicitly asks for a crop.',
    '- Do not invent new brand names, logos, labels, readable text, or unrelated markings.',
    '- Do not add extra products unless they naturally exist as background props in the template scene.',
    '- If user direction asks to add or change readable text, follow it only when visually plausible and do not replace the product identity unless explicitly requested.',
    '',
    'Scene integration rules:',
    '- Replace the example product or main placeholder object in the template scene with the user product.',
    '- If the template placeholder does not fit the user product aspect ratio, adapt or create a suitable display area so the full product remains visible.',
    '- Do not force the user product into an unsuitable existing frame, crop, table, package, holder, or surface from the template.',
    '- Make the product look physically present in the scene with realistic shadows, contact points, reflections, perspective, and lighting.',
    '- Keep the result clean, commercial, and suitable for ecommerce or social media product marketing.',
    '',
    'User direction rules:',
    '- User direction is optional.',
    '- Follow user direction only if it does not conflict with product accuracy or scene realism.',
    '',
    `User direction:\n${userDirection}`,
  ].join('\n')
}
