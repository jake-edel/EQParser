import fs from 'fs'
import { JSDOM } from 'jsdom'

const domain = 'https://wiki.project1999.com'

const zonesRequest = await fetch(`${domain}/Zones`, {
  headers: {
    'Content-Type': 'text'
  }
})
let domString = await zonesRequest.text()

const zonesDom = new JSDOM(domString)

type zone = {
  id: string,
  url: string,
  images: string[]
}

const zoneUrls: zone[] = []
zonesDom.window.document.querySelectorAll('a').forEach((element, index) => {
  if (index < 19 || index > 132) return;
  const zone: zone = { id: '', url: '', images: [] }
  const zoneId = element.getAttribute('href')?.replace('/', '').toLowerCase() || ''
  zone.id = decodeURI(zoneId)
  
  const url = domain + element
  zone.url = url

  zoneUrls.push(zone)
})

// const jsonString = JSON.stringify(zoneUrls, null, 2)
// await fs.promises.writeFile('./scripts/download_maps/zones.json', jsonString)
// const zones = await fs.promises.readFile('./scripts/download_maps/zones.json')
// const zoneUrls = JSON.parse(zones.toString())

// Zones with irregular image patterns
// HHK - 35
// Splitpaw - 42
// Chardok - 81

let index = 0
for (const zone of zoneUrls) {
  zone.images = []
  console.log('Fetching images urls for', zone.id)
  const request = await fetch(zone.url, {
    headers: {
      'Content-Type': 'text'
    }
  })
  const domString = await request.text()

  const zoneDom = new JSDOM(domString)
  let imageFound = false
  zoneDom.window.document.querySelectorAll('img').forEach(element => {
    const src = element.getAttribute('src') || ''
    const url = domain + src
    if (
      (src.includes('/Map_') || src.includes('_Map') || src.includes('/Zone_') || src.endsWith('.jpg'))
      && !src.includes('/thumb')
      && !src.includes('poweredby_mediawiki')
    ) {
      console.log('Pushing image URL:', url)
      zone.images.push(url)
      imageFound = true
    }
  })
  if (!imageFound) console.log(`${index} - No image found for zone ${zone.id}`)
  index++
}

const jsonString = JSON.stringify(zoneUrls, null, 2)
await fs.promises.writeFile(`./scripts/download_maps/zone_urls.json`, jsonString)
// let buffer = await fs.promises.readFile('./scripts/download_maps/zone_image_urls.json')
// const zones: zone[] = JSON.parse(buffer.toString())

for (const zone of zoneUrls) {
  let imageIndex = 1
  for (const image of zone.images) {
    const imageCount = imageIndex > 1 ? imageIndex : ''

    console.log(image + imageCount)
    const imageType = image.endsWith('.jpg') ? 'jpg' : 'png'
    const imageRequest = await fetch(image, {
      headers: {
        'Content-Type': `image/${imageType}`
      }
    })
    const blob = await imageRequest.blob()
    const imageBuffer = await blob.arrayBuffer()
    await fs.promises.writeFile(
      `./scripts/download_maps/maps/${zone.id + imageCount}.${imageType}`,
      Buffer.from(imageBuffer)
    )
    imageIndex++
  }
}

