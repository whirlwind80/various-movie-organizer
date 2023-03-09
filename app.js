'use strict'

import ProductProcessor from "./src/product.js"
import Scrapper from "./src/Scrapper.js"
import ScrapWriter from "./src/ScrapWriter.js"
import { readSettings } from "./src/settings.js"

const settings = readSettings()
console.log(settings)

const productProcess = new ProductProcessor(settings)
productProcess.process()

const fileDataList = productProcess.fileDataList
const scrapper = new Scrapper(fileDataList)
scrapper.scrap()

const scrapWriter = new ScrapWriter(fileDataList, scrapper.scrapMap, settings)
scrapWriter.write()