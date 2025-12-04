export function useFavicon() {
  function getFaviconUrl(url: string): string {
    try {
      const urlObj = new URL(url)
      return `https://www.google.com/s2/favicons?domain=${urlObj.hostname}&sz=64`
    } catch {
      return ''
    }
  }

  return {
    getFaviconUrl,
  }
}
