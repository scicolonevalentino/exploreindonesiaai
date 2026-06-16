// Batch-upload every media file in a month folder to Sanity as socialAsset docs.
//
// - Recurses the folder (week subfolders etc. are flattened/ignored).
// - Sorts files by CREATION date (macOS birthtime), ascending.
// - Assigns postNumber 1..N in that order (one document per file).
// - Original filename is preserved on the asset (kept exactly as on disk).
// - Deterministic _id (socialAsset-<account>-<year>-<month>-<post>) → re-running
//   the same folder updates in place instead of duplicating.
//
// Usage:
//   node scripts/sync-month.mjs \
//     --dir "/path/to/Nusaexploresindonesia/Instagram/June" \
//     --account nusa_explores --year 2026 --month 6 [--platform instagram] [--dry]
//
// --dry prints the plan without uploading.

import {readFileSync, readdirSync, statSync} from 'node:fs'
import {fileURLToPath} from 'node:url'
import {dirname, join, basename, extname} from 'node:path'
import {createClient} from '@sanity/client'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')

const PROJECT_ID = 'u4ah1ore'
const DATASET = 'production'
const API_VERSION = '2021-06-07'

const IMAGE_EXTS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif'])
const VIDEO_EXTS = new Set(['.mp4', '.mov', '.webm', '.m4v'])
const CONTENT_TYPES = {
  '.mp4': 'video/mp4', '.mov': 'video/quicktime', '.webm': 'video/webm', '.m4v': 'video/x-m4v',
}

const flag = (n) => {
  const argv = process.argv.slice(2)
  const eq = argv.find((a) => a.startsWith(`--${n}=`))
  if (eq) return eq.split('=').slice(1).join('=')
  const i = argv.indexOf(`--${n}`)
  return i !== -1 ? argv[i + 1] : undefined
}
const DRY = process.argv.includes('--dry')

const dir = flag('dir')
const account = flag('account')
const year = Number(flag('year'))
const month = Number(flag('month'))
const platform = (flag('platform') || 'instagram').split(',').map((p) => p.trim()).filter(Boolean)

if (!dir || !account || !year || !month) {
  console.error('Usage: node scripts/sync-month.mjs --dir <folder> --account <acc> --year <y> --month <m> [--platform ..] [--dry]')
  process.exit(1)
}
if (!['nusa_explores', 'exploreindonesia_ai'].includes(account)) {
  console.error(`--account must be nusa_explores or exploreindonesia_ai`)
  process.exit(1)
}

// --- token ---
const env = readFileSync(join(ROOT, '.env.local'), 'utf8')
const TOKEN = (env.match(/^SANITY_API_WRITE_TOKEN=(.+)$/m) || [])[1]?.trim()
if (!TOKEN) {
  console.error('No SANITY_API_WRITE_TOKEN in .env.local')
  process.exit(1)
}

// --- gather media files recursively ---
function walk(d) {
  const out = []
  for (const entry of readdirSync(d, {withFileTypes: true})) {
    if (entry.name.startsWith('.')) continue
    const full = join(d, entry.name)
    if (entry.isDirectory()) out.push(...walk(full))
    else {
      const ext = extname(entry.name).toLowerCase()
      if (IMAGE_EXTS.has(ext) || VIDEO_EXTS.has(ext)) {
        out.push({path: full, name: entry.name, ext, birth: statSync(full).birthtimeMs})
      }
    }
  }
  return out
}

const files = walk(dir).sort((a, b) => a.birth - b.birth || a.name.localeCompare(b.name))

if (!files.length) {
  console.log(`No media files found in ${dir}`)
  process.exit(0)
}

console.log(`\n${DRY ? '[DRY RUN] ' : ''}${account} · ${year}-${String(month).padStart(2, '0')} · ${files.length} files (by creation date):\n`)
files.forEach((f, i) => {
  const kind = VIDEO_EXTS.has(f.ext) ? 'video' : 'image'
  console.log(`  ${String(i + 1).padStart(2)}. [${kind}] ${f.name}`)
})

if (DRY) {
  console.log('\n(dry run — nothing uploaded)\n')
  process.exit(0)
}

const client = createClient({projectId: PROJECT_ID, dataset: DATASET, apiVersion: API_VERSION, token: TOKEN, useCdn: false})

let ok = 0
for (let i = 0; i < files.length; i++) {
  const f = files[i]
  const postNumber = i + 1
  const isVideo = VIDEO_EXTS.has(f.ext)
  const bytes = readFileSync(f.path)
  try {
    const doc = {
      _id: `socialAsset-${account}-${year}-${month}-${postNumber}`,
      _type: 'socialAsset',
      account,
      platform,
      year,
      month,
      postNumber,
    }
    if (isVideo) {
      const a = await client.assets.upload('file', bytes, {
        filename: f.name,
        contentType: CONTENT_TYPES[f.ext] || 'application/octet-stream',
      })
      doc.video = {_type: 'file', asset: {_type: 'reference', _ref: a._id}}
    } else {
      const a = await client.assets.upload('image', bytes, {filename: f.name})
      doc.image = {_type: 'image', asset: {_type: 'reference', _ref: a._id}}
    }
    await client.createOrReplace(doc)
    // Read back: a write can occasionally report success without persisting.
    let exists = await client.getDocument(doc._id)
    if (!exists) {
      await client.createOrReplace(doc)
      exists = await client.getDocument(doc._id)
    }
    if (!exists) throw new Error('document did not persist after retry')
    ok++
    console.log(`  ✓ #${postNumber} ${f.name}`)
  } catch (err) {
    console.error(`  ✗ #${postNumber} ${f.name} — ${err.message}`)
  }
}

console.log(`\nDone: ${ok}/${files.length} uploaded to ${account} ${year}-${String(month).padStart(2, '0')}.\n`)
