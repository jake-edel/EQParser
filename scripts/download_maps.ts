import { JSDOM } from 'jsdom'

const domain = 'https://wiki.project1999.com'


const request = await fetch(`${domain}/Zones`, {
  headers: {
    'Content-Type': 'text'
  }
})
const domString = await request.text()

const zonesDom = new JSDOM(domString)

type zoneUrl = {
  id: string,
  url: string
}

const zoneUrls: zoneUrl[] = []
zonesDom.window.document.querySelectorAll('a').forEach((element, index) => {
  if (index < 19 || index > 132) return;
  const zone: zoneUrl = { id: '', url: '' }
  const zoneId = element.getAttribute('href').replace('/', '')
  zone.id = zoneId
  
  const url = domain + element
  zone.url = url

  zoneUrls.push(zone)
})

console.log(zoneUrls)


const mapUrls = []

for (const zone of zoneUrls) {
  const request = await fetch(zone.url, {
    headers: {
      'Content-Type': 'text'
    }
  })
  const domString = await request.text()

  const zoneDom = new JSDOM(domString)
  zoneDom.window.document.querySelectorAll('img').forEach(element => {
    const src = element.getAttribute('src')
    if (src.includes('/Map_') && !src.includes('/thumb')) console.log(domain + src)
  })
}
// const request = await fetch('https://wiki.project1999.com/Everfrost_Peaks', {
//   headers: {
//     'Content-Type': 'text'
//   }
// })
// const domString = await request.text()

// const zoneDom = new JSDOM(domString)
// zoneDom.window.document.querySelectorAll('img').forEach(element => {
//   const src = element.getAttribute('src')
//   if (src.includes('/Map_')) console.log(domain + src)
// })