import type { AppData } from '@/types'

const APP_VERSION = '1.0.0'

export function exportData(data: Omit<AppData, 'version'>): void {
  const exportData: AppData = {
    ...data,
    version: APP_VERSION,
  }

  const blob = new Blob([JSON.stringify(exportData, null, 2)], {
    type: 'application/json',
  })
  const url = URL.createObjectURL(blob)

  const date = new Date().toISOString().split('T')[0]
  const filename = `sag-tab-backup-${date}.json`

  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()

  URL.revokeObjectURL(url)
}

export async function importData(file: File): Promise<AppData> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (e) => {
      try {
        const content = e.target?.result as string
        const data = JSON.parse(content) as AppData

        if (!validateAppData(data)) {
          reject(new Error('无效的数据格式'))
          return
        }

        resolve(data)
      } catch {
        reject(new Error('文件解析失败'))
      }
    }

    reader.onerror = () => reject(new Error('文件读取失败'))
    reader.readAsText(file)
  })
}

function validateAppData(data: unknown): data is AppData {
  if (typeof data !== 'object' || data === null) return false

  const d = data as Record<string, unknown>

  return (
    Array.isArray(d.bookmarks) &&
    Array.isArray(d.folders) &&
    typeof d.settings === 'object' &&
    typeof d.version === 'string'
  )
}
