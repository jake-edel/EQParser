import fs from 'fs'
import { JSDOM } from 'jsdom'
import * as prettier from 'prettier'
import zoneUrls from '../download_maps/zone_urls.json' with { type: 'json' }

const domain = 'https://wiki.project1999.com'

zoneUrls.forEach(async (zone, index) => {
  if (index !== 19) return
  
  const zoneRequest = await fetch(zone.url, {
    headers: {
      'Content-Type': 'text'
    }
  })
  
  let domString = await zoneRequest.text()
  
  console.log('Zone:', zone.id)
  
  const zoneDom = new JSDOM(domString)
  const lists = zoneDom.window.document.querySelectorAll('ul')
  
  let htmlString
  console.clear()
  lists.values().forEach((element: HTMLUListElement, index: number) => {
    if (index > 3) return
    console.log(`${index}:`)
    console.log(element.textContent)
    const zoneDataIndex = 0
    if (index !== zoneDataIndex) return
    Array.from(element.children).forEach((li)  => {
      const anchorTags = li.querySelectorAll('a')
      Array.from(anchorTags.values()).forEach(element => {
        const href = element.getAttribute('href')
        element.href = domain + href
        element.target = '_blank'
      });
    })
    htmlString = element.outerHTML
  });
  
  if (!htmlString) {
    console.log('No HTML string, something went wrong');
    process.exit()
  }
  
  htmlString = await prettier.format(htmlString, { parser: 'html' })
  
  await fs.promises.writeFile(`./scripts/download_zone_data/zone_data/${zone.id}.html`, htmlString)

})
