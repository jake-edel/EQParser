import fs from 'fs'

const fileNames: string[] = []
for (let i = 65; i < 91; i++) {
  const char = String.fromCharCode(i)
  fileNames.push(`Spellicon_${char}.png`)
}

const domain = 'https://wiki.project1999.com'
const requests: Promise<Response>[] = []

for (const fileName of fileNames) {
  const iconRequest = fetch(domain + `/images/${fileName}` , {
    headers: {
      'Content-Type': `image/png`
    }
  })
   requests.push(iconRequest)
}

const responses = await Promise.all(requests)
const images = await Promise.all(responses.map(response => response.blob()))
const imageBuffers = await Promise.all(images.map(blob => blob.arrayBuffer()))

const fileWrites: Promise<void>[] = []
imageBuffers.forEach((buffer, index) => {
  const fileWrite = fs.promises.writeFile(
    `./scripts/download_icons/icons/${fileNames[index]}`,
    Buffer.from(buffer)
  )
  fileWrites.push(fileWrite)
})

await Promise.all(fileWrites)

