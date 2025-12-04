export type Theme = 'light' | 'dark'
export type SearchEngine = 'google' | 'baidu'
export type BackgroundType = 'solid' | 'gradient'

export interface Background {
  type: BackgroundType
  value: string
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
