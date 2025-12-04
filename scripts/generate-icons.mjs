import sharp from 'sharp'
import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const projectRoot = resolve(__dirname, '..')
const svgPath = resolve(projectRoot, 'public/icons/icon.svg')
const svg = readFileSync(svgPath)

const sizes = [16, 32, 48, 128]

for (const size of sizes) {
  await sharp(svg)
    .resize(size, size)
    .png()
    .toFile(resolve(projectRoot, `public/icons/icon-${size}.png`))
  console.log(`Generated icon-${size}.png`)
}

console.log('All icons generated!')
