/* eslint-disable no-console */
const fs = require('fs')
const path = require('path')
const sharp = require('sharp')

const ROOT = path.resolve(__dirname, '..')
const ASSETS_DIR = path.join(ROOT, 'src', 'assets')
const OUT_DIR = path.join(ASSETS_DIR, 'thumbs')

const SIZES = {
  circle: 96, // good for 44-48px display on high-dpi screens
}

const ensureDir = (dir) => fs.mkdirSync(dir, { recursive: true })

const listJpgs = (dir) => {
  if (!fs.existsSync(dir)) return []
  return fs
    .readdirSync(dir)
    .filter((name) => name.toLowerCase().endsWith('.jpg') || name.toLowerCase().endsWith('.jpeg'))
    .map((name) => path.join(dir, name))
}

const toOutPath = (srcPath) => {
  const rel = path.relative(ASSETS_DIR, srcPath)
  const parsed = path.parse(rel)
  return path.join(OUT_DIR, parsed.dir, `${parsed.name}.webp`)
}

async function main() {
  const male = listJpgs(path.join(ASSETS_DIR, 'male'))
  const female = listJpgs(path.join(ASSETS_DIR, 'female'))

  const all = [...male, ...female]
  if (all.length === 0) {
    console.log('No JPG/JPEG avatars found under src/assets/{male,female}.')
    return
  }

  ensureDir(OUT_DIR)

  let wrote = 0
  for (const input of all) {
    const output = toOutPath(input)
    ensureDir(path.dirname(output))

    // Only rewrite if missing; keep git diffs stable.
    if (fs.existsSync(output)) continue

    // 96x96 WebP, cover-crop for consistent circles.
    await sharp(input)
      .resize(SIZES.circle, SIZES.circle, {
        fit: 'cover',
        position: 'attention',
        withoutEnlargement: true,
      })
      .webp({ quality: 62, effort: 4 })
      .toFile(output)

    wrote += 1
  }

  console.log(`Generated ${wrote} avatar thumbnails into ${path.relative(ROOT, OUT_DIR)}`)
}

main().catch((err) => {
  console.error(err)
  process.exitCode = 1
})

