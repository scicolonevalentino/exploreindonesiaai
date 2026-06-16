// Upload an image/video to Sanity and (optionally) create a `socialAsset` document.
//
// The Sanity Studio (project u4ah1ore) defines a `socialAsset` doc type with:
//   account, platform[], year, month, postNumber, image, video
// This script can both upload raw assets AND populate that document.
//
// Modes
// -----
// 1) Bare asset (back-compat) — just upload a file and print its public CDN URL:
//      node scripts/upload-asset.mjs ./photo.jpg
//
// 2) socialAsset document — upload image (and/or video) and create the doc:
//      node scripts/upload-asset.mjs "./Day 1 - Airport.png" \
//        --account nusa_explores --platform instagram,tiktok \
//        --year 2026 --month 6 --post 1 --video "./Day 1 - Airport.mp4"
//
//    Or a video-only post (pass the video as the primary file, no image):
//      node scripts/upload-asset.mjs "./Day 1 - Airport.mp4" \
//        --account nusa_explores --platform instagram --year 2026 --month 6 --post 1
//
// account:   nusa_explores | exploreindonesia_ai
// platform:  instagram, tiktok, facebook  (comma-separated, defaults to instagram)
//
// The document _id is deterministic (socialAsset-<account>-<year>-<month>-<post>),
// so re-running with the same coordinates UPDATES the post instead of duplicating.
// Reads SANITY_API_WRITE_TOKEN from .env.local.

import {readFileSync} from 'node:fs'
import {fileURLToPath} from 'node:url'
import {dirname, join, basename, extname} from 'node:path'
import {createClient} from '@sanity/client'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')

const PROJECT_ID = 'u4ah1ore'
const DATASET = 'production'
const API_VERSION = '2021-06-07'

const VIDEO_EXTS = new Set(['.mp4', '.mov', '.webm', '.m4v'])
const IMAGE_EXTS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif'])
const CONTENT_TYPES = {
  '.mp4': 'video/mp4', '.mov': 'video/quicktime', '.webm': 'video/webm', '.m4v': 'video/x-m4v',
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp', '.gif': 'image/gif',
}

// --- token ---
const env = readFileSync(join(ROOT, '.env.local'), 'utf8')
const TOKEN = (env.match(/^SANITY_API_WRITE_TOKEN=(.+)$/m) || [])[1]?.trim()
if (!TOKEN) {
  console.error('No SANITY_API_WRITE_TOKEN in .env.local')
  process.exit(1)
}

// --- args ---
const argv = process.argv.slice(2)
const positional = argv.filter((a) => !a.startsWith('--'))
const flag = (name) => {
  const eq = argv.find((a) => a.startsWith(`--${name}=`))
  if (eq) return eq.split('=').slice(1).join('=')
  const i = argv.indexOf(`--${name}`)
  return i !== -1 ? argv[i + 1] : undefined
}

const primary = positional[0]
if (!primary) {
  console.error('Usage: node scripts/upload-asset.mjs <file> [--account .. --platform .. --year .. --month .. --post .. --video ..]')
  process.exit(1)
}

const account = flag('account')
const year = flag('year') ? Number(flag('year')) : undefined
const month = flag('month') ? Number(flag('month')) : undefined
const post = flag('post') ? Number(flag('post')) : undefined
const platform = (flag('platform') || 'instagram').split(',').map((p) => p.trim()).filter(Boolean)
const explicitVideo = flag('video')

const wantsDocument = account || year || month || post
if (wantsDocument) {
  const missing = ['account', 'year', 'month', 'post'].filter((k) => ({account, year, month, post})[k] == null)
  if (missing.length) {
    console.error(`To create a socialAsset document you must pass: --account --year --month --post (missing: ${missing.join(', ')})`)
    process.exit(1)
  }
  if (!['nusa_explores', 'exploreindonesia_ai'].includes(account)) {
    console.error(`--account must be nusa_explores or exploreindonesia_ai (got "${account}")`)
    process.exit(1)
  }
}

const client = createClient({projectId: PROJECT_ID, dataset: DATASET, apiVersion: API_VERSION, token: TOKEN, useCdn: false})

async function loadBytes(src) {
  if (/^https?:\/\//i.test(src)) {
    const res = await fetch(src)
    if (!res.ok) throw new Error(`Fetch failed ${res.status} for ${src}`)
    return Buffer.from(await res.arrayBuffer())
  }
  return readFileSync(src)
}

async function uploadImage(src) {
  const bytes = await loadBytes(src)
  return client.assets.upload('image', bytes, {filename: basename(src.split('?')[0])})
}

async function uploadFile(src) {
  const bytes = await loadBytes(src)
  const ext = extname(src.split('?')[0]).toLowerCase()
  return client.assets.upload('file', bytes, {
    filename: basename(src.split('?')[0]),
    contentType: CONTENT_TYPES[ext] || 'application/octet-stream',
  })
}

try {
  // Figure out which inputs are image vs video.
  const primaryExt = extname(primary.split('?')[0]).toLowerCase()
  const primaryIsVideo = VIDEO_EXTS.has(primaryExt)

  let imageSrc = primaryIsVideo ? undefined : primary
  let videoSrc = explicitVideo || (primaryIsVideo ? primary : undefined)
  if (explicitVideo && !primaryIsVideo) imageSrc = primary // image primary + explicit video

  // --- bare asset mode ---
  if (!wantsDocument) {
    if (imageSrc && IMAGE_EXTS.has(primaryExt)) {
      const a = await uploadImage(imageSrc)
      console.log('\n✅ Uploaded image asset')
      console.log('Public URL: ', a.url, '\n(append ?fm=jpg for a JPEG version)\n')
    } else {
      const a = await uploadFile(primary)
      console.log('\n✅ Uploaded file asset')
      console.log('Public URL: ', a.url, '\n')
    }
    process.exit(0)
  }

  // --- socialAsset document mode ---
  const doc = {
    _id: `socialAsset-${account}-${year}-${month}-${post}`,
    _type: 'socialAsset',
    account,
    platform,
    year,
    month,
    postNumber: post,
  }
  let imageUrl
  if (imageSrc) {
    const imgAsset = await uploadImage(imageSrc)
    imageUrl = imgAsset.url
    doc.image = {_type: 'image', asset: {_type: 'reference', _ref: imgAsset._id}}
  }
  if (videoSrc) {
    const vidAsset = await uploadFile(videoSrc)
    doc.video = {_type: 'file', asset: {_type: 'reference', _ref: vidAsset._id}}
  }

  const saved = await client.createOrReplace(doc)
  console.log('\n✅ socialAsset saved')
  console.log('Document ID:', saved._id)
  console.log('Coordinates:', `${account} · ${year}-${String(month).padStart(2, '0')} · post ${post} · [${platform.join(', ')}]`)
  if (imageUrl) {
    console.log('Image URL:  ', imageUrl)
    console.log('  → for IG/Buffer (JPEG):', `${imageUrl}?fm=jpg&w=1080&q=80`)
  }
  if (doc.video) console.log('Video:      ', 'uploaded (file asset attached)')
  console.log('')
} catch (err) {
  console.error('Failed:', err.message)
  process.exit(1)
}
