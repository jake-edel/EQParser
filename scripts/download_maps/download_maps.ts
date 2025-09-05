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

const zoneRequests: Promise<Response>[] = []
for (const zone of zoneUrls) {
  zone.images = []
  console.log('Fetching DOM for', zone.url)
  const request = fetch(zone.url, {
    headers: {
      'Content-Type': 'text'
    }
  })
  zoneRequests.push(request)
}
const zoneResponses = await Promise.all(zoneRequests)
const domStrings = await Promise.all(zoneResponses.map(response => response.text()))

let index = 0
domStrings.forEach((dom, i) => {
  const zoneDom = new JSDOM(dom)
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
      zoneUrls[i].images.push(url)
      imageFound = true
    }
  })
  if (!imageFound) console.log(`${index} - No image found for zone ${zoneUrls[i].id}`)
  index++
})


const jsonString = JSON.stringify(zoneUrls, null, 2)
await fs.promises.writeFile(`./scripts/download_maps/zone_urls.json`, jsonString)
// let buffer = await fs.promises.readFile('./scripts/download_maps/zone_image_urls.json')
// const zones: zone[] = JSON.parse(buffer.toString())

const imageRequests: Promise<Response>[] = []
const fileNames: string[] = []

for (const zone of zoneUrls) {
  let imageIndex = 1
  for (const image of zone.images) {
    const imageCount = imageIndex > 1 ? imageIndex : ''

    console.log(image + imageCount)
    const imageType = image.endsWith('.jpg') ? 'jpg' : 'png'
    const request = fetch(image, {
      headers: {
        'Content-Type': `image/${imageType}`
      }
    })
    const fileName = `${zone.id + imageCount}.${imageType}`
    imageRequests.push(request)
    fileNames.push(fileName)
    imageIndex++
  }
}
const responses = await Promise.all(imageRequests)
const blobs = await Promise.all(responses.map(response => response.blob()))
const imageBuffers = await Promise.all(blobs.map(blob => blob.arrayBuffer()))

const fileWrites: Promise<void>[] = []
imageBuffers.forEach((buffer, index) => {
  const fileWrite = fs.promises.writeFile(
    `./scripts/download_maps/maps/${fileNames[index]}`,
    Buffer.from(buffer)
  )
  fileWrites.push(fileWrite)
})

await Promise.all(fileWrites)

