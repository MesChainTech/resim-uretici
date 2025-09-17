// Client-side image validation utilities (browser-safe)

interface ImageValidationResult {
  isValid: boolean
  errors: string[]
}

// Client-side image validation (basic checks)
export async function validateImage(
  base64Image: string
): Promise<ImageValidationResult> {
  const errors: string[] = []

  try {
    // Check if it's a valid base64 data URL
    if (!base64Image.startsWith('data:image/')) {
      errors.push('Invalid image format')
      return { isValid: false, errors }
    }

    // Extract the image format
    const formatMatch = base64Image.match(/data:image\/([^;]+)/)
    if (!formatMatch) {
      errors.push('Could not determine image format')
      return { isValid: false, errors }
    }

    const format = formatMatch[1].toLowerCase()
    const supportedFormats = ['jpeg', 'jpg', 'png', 'webp']

    if (!supportedFormats.includes(format)) {
      errors.push(
        `Unsupported format: ${format}. Supported formats: ${supportedFormats.join(', ')}`
      )
    }

    // Estimate file size from base64 string
    const base64Data = base64Image.split(',')[1]
    const sizeInBytes = (base64Data.length * 3) / 4
    const maxSizeInBytes = 10 * 1024 * 1024 // 10MB

    if (sizeInBytes > maxSizeInBytes) {
      errors.push(
        `File too large: ${(sizeInBytes / 1024 / 1024).toFixed(1)}MB. Maximum size: 10MB`
      )
    }

    // Try to load the image to verify it's valid
    await new Promise<void>((resolve, reject) => {
      const img = new Image()
      img.onload = () => {
        // Check minimum dimensions
        if (img.width < 100 || img.height < 100) {
          errors.push(
            `Image too small: ${img.width}x${img.height}. Minimum size: 100x100`
          )
        }

        // Check maximum dimensions
        if (img.width > 4096 || img.height > 4096) {
          errors.push(
            `Image too large: ${img.width}x${img.height}. Maximum size: 4096x4096`
          )
        }

        resolve()
      }
      img.onerror = () => reject(new Error('Invalid image data'))
      img.src = base64Image
    })
  } catch (error) {
    errors.push('Invalid image data')
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

// Check if a string is a valid base64 image
export function isValidBase64Image(str: string): boolean {
  if (!str || typeof str !== 'string') return false

  // Check if it's a data URL
  if (!str.startsWith('data:image/')) return false

  // Check if it has base64 data
  const parts = str.split(',')
  if (parts.length !== 2) return false

  // Basic base64 validation
  const base64Part = parts[1]
  const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/

  return base64Regex.test(base64Part) && base64Part.length % 4 === 0
}

// Convert file to base64
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result)
      } else {
        reject(new Error('Failed to convert file to base64'))
      }
    }
    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.readAsDataURL(file)
  })
}
