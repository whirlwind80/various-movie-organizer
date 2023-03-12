'use strict'

import ProductProcessor from "./src/product.js"
import Scraper from "./src/Scraper.js"
import ScrapWriter from "./src/metaWriter.js"
import { readSettings } from "./src/settings.js"

const settings = readSettings()
console.log(settings)

const productProcess = new ProductProcessor(settings)
productProcess.process()

const fileDataList = productProcess.fileDataList
const scrapper = new Scraper(fileDataList, settings)
scrapper.scrape()
.then(() => {
    const scrapWriter = new ScrapWriter(fileDataList, scrapper.scrapMap, settings)
    scrapWriter.write()
})

