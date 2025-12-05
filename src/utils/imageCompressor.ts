export interface CompressionOptions {
  maxWidth: number
  maxHeight: number
  quality: number // 0-1
  maxSizeKB: number
  mimeType: 'image/jpeg' | 'image/webp'
}

export const defaultCompressionOptions: CompressionOptions = {
  maxWidth: 1920,
  maxHeight: 1080,
  quality: 0.8,
  maxSizeKB: 500,
  mimeType: 'image/webp',
}

export interface CompressionResult {
  dataUrl: string
  originalSize: number
  compressedSize: number
  width: number
  height: number
}

/**
 * 压缩图片
 */
export async function compressImage(
  file: File,
  options: Partial<CompressionOptions> = {}
): Promise<CompressionResult> {
  const opts = { ...defaultCompressionOptions, ...options }

  if (!file.type.startsWith('image/')) {
    throw new Error('请选择图片文件')
  }

  const maxOriginalSize = 10 * 1024 * 1024
  if (file.size > maxOriginalSize) {
    throw new Error('图片文件不能超过 10MB')
  }

  return new Promise((resolve, reject) => {
    const img = new Image()
    const reader = new FileReader()

    reader.onload = (e) => {
      img.src = e.target?.result as string
    }

    reader.onerror = () => reject(new Error('读取图片失败'))

    img.onload = () => {
      try {
        const result = processImage(img, file.size, opts)
        resolve(result)
      } catch (err) {
        reject(err)
      }
    }

    img.onerror = () => reject(new Error('加载图片失败'))

    reader.readAsDataURL(file)
  })
}

function processImage(
  img: HTMLImageElement,
  originalSize: number,
  options: CompressionOptions
): CompressionResult {
  let { width, height } = img
  const aspectRatio = width / height

  if (width > options.maxWidth) {
    width = options.maxWidth
    height = width / aspectRatio
  }

  if (height > options.maxHeight) {
    height = options.maxHeight
    width = height * aspectRatio
  }

  const canvas = document.createElement('canvas')
  canvas.width = Math.round(width)
  canvas.height = Math.round(height)

  const ctx = canvas.getContext('2d')
  if (!ctx) {
    throw new Error('无法创建 Canvas 上下文')
  }

  ctx.imageSmoothingEnabled = true
  ctx.imageSmoothingQuality = 'high'
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

  let quality = options.quality
  let dataUrl = canvas.toDataURL(options.mimeType, quality)
  let compressedSize = getBase64Size(dataUrl)

  const targetSize = options.maxSizeKB * 1024

  while (compressedSize > targetSize && quality > 0.1) {
    quality -= 0.1
    dataUrl = canvas.toDataURL(options.mimeType, quality)
    compressedSize = getBase64Size(dataUrl)
  }

  if (compressedSize > targetSize) {
    const scale = Math.sqrt(targetSize / compressedSize) * 0.9
    canvas.width = Math.round(canvas.width * scale)
    canvas.height = Math.round(canvas.height * scale)

    const newCtx = canvas.getContext('2d')
    if (newCtx) {
      newCtx.imageSmoothingEnabled = true
      newCtx.imageSmoothingQuality = 'high'
      newCtx.drawImage(img, 0, 0, canvas.width, canvas.height)
      dataUrl = canvas.toDataURL(options.mimeType, 0.7)
      compressedSize = getBase64Size(dataUrl)
    }
  }

  return {
    dataUrl,
    originalSize,
    compressedSize,
    width: canvas.width,
    height: canvas.height,
  }
}

function getBase64Size(dataUrl: string): number {
  const base64 = dataUrl.split(',')[1] || ''
  const padding = (base64.match(/=/g) || []).length
  return (base64.length * 3) / 4 - padding
}

/**
 * 验证图片文件
 */
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']

  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: '仅支持 JPG、PNG、GIF、WebP 格式的图片',
    }
  }

  const maxSize = 10 * 1024 * 1024
  if (file.size > maxSize) {
    return {
      valid: false,
      error: '图片文件大小不能超过 10MB',
    }
  }

  return { valid: true }
}
