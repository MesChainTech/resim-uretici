import sharp from 'sharp'

// Supported image formats for input
export const SUPPORTED_INPUT_FORMATS = [
  'jpeg',
  'jpg',
  'png',
  'webp',
  'gif',
  'svg',
  'tiff',
] as const

// Output format for processed images
export const OUTPUT_FORMAT = 'png' as const

// Maximum file size: 10MB
export const MAX_FILE_SIZE = 10 * 1024 * 1024

// Maximum dimensions
export const MAX_WIDTH = 2048
export const MAX_HEIGHT = 2048

// Minimum dimensions
export const MIN_WIDTH = 64
export const MIN_HEIGHT = 64

export type SupportedInputFormat = (typeof SUPPORTED_INPUT_FORMATS)[number]

export interface ImageMetadata {
  width: number
  height: number
  format: string
  size: number
  hasAlpha: boolean
}

export interface ProcessedImage {
  buffer: Buffer
  base64: string
  metadata: ImageMetadata
}

/**
 * Validate if the file format is supported
 */
export function isSupportedFormat(
  format: string
): format is SupportedInputFormat {
  return SUPPORTED_INPUT_FORMATS.includes(
    format.toLowerCase() as SupportedInputFormat
  )
}

/**
 * Convert base64 string to buffer
 */
export function base64ToBuffer(base64: string): Buffer {
  // Remove data URL prefix if present
  const base64Data = base64.replace(/^data:image\/[a-z]+;base64,/, '')
  return Buffer.from(base64Data, 'base64')
}

/**
 * Extract raw base64 data without data URL prefix
 */
export function extractBase64Data(base64: string): string {
  // Remove data URL prefix if present
  return base64.replace(/^data:image\/[a-z]+;base64,/, '')
}

/**
 * Convert buffer to base64 string with data URL prefix
 */
export function bufferToBase64(
  buffer: Buffer,
  format: string = OUTPUT_FORMAT
): string {
  return `data:image/${format};base64,${buffer.toString('base64')}`
}

/**
 * Get image metadata using Sharp
 */
export async function getImageMetadata(
  input: Buffer | string
): Promise<ImageMetadata> {
  try {
    let buffer: Buffer

    if (typeof input === 'string') {
      buffer = base64ToBuffer(input)
    } else {
      buffer = input
    }

    const image = sharp(buffer)
    const metadata = await image.metadata()

    if (!metadata.width || !metadata.height || !metadata.format) {
      throw new Error('Unable to read image metadata')
    }

    return {
      width: metadata.width,
      height: metadata.height,
      format: metadata.format,
      size: buffer.length,
      hasAlpha: metadata.hasAlpha || false,
    }
  } catch (error) {
    throw new Error(
      `Failed to read image metadata: ${error instanceof Error ? error.message : 'Unknown error'}`
    )
  }
}

/**
 * Validate image constraints
 */
export async function validateImage(
  input: Buffer | string
): Promise<{ isValid: boolean; errors: string[] }> {
  const errors: string[] = []

  try {
    const metadata = await getImageMetadata(input)

    // Check file size
    if (metadata.size > MAX_FILE_SIZE) {
      errors.push(
        `File size ${Math.round(metadata.size / 1024 / 1024)}MB exceeds maximum of ${MAX_FILE_SIZE / 1024 / 1024}MB`
      )
    }

    // Check format
    if (!isSupportedFormat(metadata.format)) {
      errors.push(
        `Format ${metadata.format} is not supported. Supported formats: ${SUPPORTED_INPUT_FORMATS.join(', ')}`
      )
    }

    // Check dimensions
    if (metadata.width > MAX_WIDTH || metadata.height > MAX_HEIGHT) {
      errors.push(
        `Image dimensions ${metadata.width}x${metadata.height} exceed maximum of ${MAX_WIDTH}x${MAX_HEIGHT}`
      )
    }

    if (metadata.width < MIN_WIDTH || metadata.height < MIN_HEIGHT) {
      errors.push(
        `Image dimensions ${metadata.width}x${metadata.height} are below minimum of ${MIN_WIDTH}x${MIN_HEIGHT}`
      )
    }

    return {
      isValid: errors.length === 0,
      errors,
    }
  } catch (error) {
    errors.push(
      error instanceof Error ? error.message : 'Unknown validation error'
    )
    return {
      isValid: false,
      errors,
    }
  }
}

/**
 * Resize image while maintaining aspect ratio
 */
export async function resizeImage(
  input: Buffer | string,
  maxWidth: number = MAX_WIDTH,
  maxHeight: number = MAX_HEIGHT
): Promise<Buffer> {
  try {
    let buffer: Buffer

    if (typeof input === 'string') {
      buffer = base64ToBuffer(input)
    } else {
      buffer = input
    }

    const image = sharp(buffer)
    const metadata = await image.metadata()

    if (!metadata.width || !metadata.height) {
      throw new Error('Unable to read image dimensions')
    }

    // Calculate new dimensions maintaining aspect ratio
    const aspectRatio = metadata.width / metadata.height
    let newWidth = metadata.width
    let newHeight = metadata.height

    if (newWidth > maxWidth) {
      newWidth = maxWidth
      newHeight = Math.round(newWidth / aspectRatio)
    }

    if (newHeight > maxHeight) {
      newHeight = maxHeight
      newWidth = Math.round(newHeight * aspectRatio)
    }

    // Only resize if dimensions changed
    if (newWidth !== metadata.width || newHeight !== metadata.height) {
      return await image
        .resize(newWidth, newHeight, {
          fit: 'inside',
          withoutEnlargement: true,
        })
        .png({ quality: 90 })
        .toBuffer()
    }

    // Convert to PNG if not already
    if (metadata.format !== 'png') {
      return await image.png({ quality: 90 }).toBuffer()
    }

    return buffer
  } catch (error) {
    throw new Error(
      `Failed to resize image: ${error instanceof Error ? error.message : 'Unknown error'}`
    )
  }
}

/**
 * Optimize image for web delivery
 */
export async function optimizeImage(
  input: Buffer | string
): Promise<ProcessedImage> {
  try {
    let buffer: Buffer

    if (typeof input === 'string') {
      buffer = base64ToBuffer(input)
    } else {
      buffer = input
    }

    // Resize and optimize
    const optimizedBuffer = await resizeImage(buffer)

    // Get metadata of optimized image
    const metadata = await getImageMetadata(optimizedBuffer)

    // Convert to base64
    const base64 = bufferToBase64(optimizedBuffer)

    return {
      buffer: optimizedBuffer,
      base64,
      metadata,
    }
  } catch (error) {
    throw new Error(
      `Failed to optimize image: ${error instanceof Error ? error.message : 'Unknown error'}`
    )
  }
}

/**
 * Create thumbnail from image
 */
export async function createThumbnail(
  input: Buffer | string,
  size: number = 200
): Promise<ProcessedImage> {
  try {
    let buffer: Buffer

    if (typeof input === 'string') {
      buffer = base64ToBuffer(input)
    } else {
      buffer = input
    }

    const thumbnailBuffer = await sharp(buffer)
      .resize(size, size, {
        fit: 'cover',
        position: 'center',
      })
      .png({ quality: 80 })
      .toBuffer()

    const metadata = await getImageMetadata(thumbnailBuffer)
    const base64 = bufferToBase64(thumbnailBuffer)

    return {
      buffer: thumbnailBuffer,
      base64,
      metadata,
    }
  } catch (error) {
    throw new Error(
      `Failed to create thumbnail: ${error instanceof Error ? error.message : 'Unknown error'}`
    )
  }
}

/**
 * Extract dominant colors from image
 */
export async function extractColors(
  input: Buffer | string,
  count: number = 5
): Promise<string[]> {
  try {
    let buffer: Buffer

    if (typeof input === 'string') {
      buffer = base64ToBuffer(input)
    } else {
      buffer = input
    }

    // Create a small thumbnail for color analysis
    const thumbnail = await sharp(buffer)
      .resize(50, 50, { fit: 'cover' })
      .raw()
      .toBuffer({ resolveWithObject: true })

    const pixels = thumbnail.data
    const colorMap = new Map<string, number>()

    // Sample pixels and count colors
    for (let i = 0; i < pixels.length; i += 3) {
      const r = pixels[i]
      const g = pixels[i + 1]
      const b = pixels[i + 2]

      // Round to reduce color variations
      const roundedR = Math.round(r / 16) * 16
      const roundedG = Math.round(g / 16) * 16
      const roundedB = Math.round(b / 16) * 16

      const color = `#${roundedR.toString(16).padStart(2, '0')}${roundedG.toString(16).padStart(2, '0')}${roundedB.toString(16).padStart(2, '0')}`
      colorMap.set(color, (colorMap.get(color) || 0) + 1)
    }

    // Sort by frequency and return top colors
    return Array.from(colorMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, count)
      .map(([color]) => color)
  } catch (error) {
    console.error('Failed to extract colors:', error)
    // Return some default colors if extraction fails
    return ['#000000', '#ffffff', '#808080']
  }
}

/**
 * Validate base64 image string
 */
export function isValidBase64Image(base64: string): boolean {
  try {
    // Check if it's a valid data URL
    const dataUrlPattern =
      /^data:image\/(jpeg|jpg|png|webp|gif|svg\+xml|tiff);base64,/
    if (!dataUrlPattern.test(base64)) {
      return false
    }

    // Try to decode the base64 part
    const base64Data = base64.split(',')[1]
    if (!base64Data) {
      return false
    }

    Buffer.from(base64Data, 'base64')
    return true
  } catch {
    return false
  }
}
