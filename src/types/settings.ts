export type Theme = 'light' | 'dark'
export type SearchEngine = 'google' | 'baidu'
export type BackgroundType = 'solid' | 'image'
export type ImageDisplayMode = 'cover' | 'contain' | 'fill' | 'tile' | 'center'

export interface ImageConfig {
  displayMode: ImageDisplayMode
  overlay: boolean
  overlayColor: string
  overlayOpacity: number // 0-100
  blur: number // 0-20px
}

export const defaultImageConfig: ImageConfig = {
  displayMode: 'cover',
  overlay: true,
  overlayColor: '#000000',
  overlayOpacity: 30,
  blur: 0,
}

export interface Background {
  type: BackgroundType
  value: string
  imageConfig?: ImageConfig
}

export interface Settings {
  theme: Theme
  background: Background
  searchEngine: SearchEngine
}

export const defaultSettings: Settings = {
  theme: 'light',
  background: {
    type: 'solid',
    value: '#f5f5f5',
  },
  searchEngine: 'google',
}
