import axios from 'axios'
import cheerio from 'cheerio'
import fs from 'fs'
import path from 'path'
import { ScrapeData, ProductType } from './meta.js'


export default class Scraper {
    constructor (fileDataList, settings) {
        this._fileDataList = fileDataList
        this._settings = settings
        this._scrapeMap = new Map()
        this._visit = []
    }

    get scrapMap() {
        return this._scrapeMap
    }

    async scrape() {
        let index = 0
        while (index < this._fileDataList.length) {
            index = await this.scrapeBatch(index)
            await new Promise(r => setTimeout(r, 1000));
        }
    }

    async scrapeBatch(index) {
        const batchSize = 5
        const promises = this._fileDataList.slice(index, index + batchSize).map(async (fileData, index) => {            

            const type = fileData.type
            const product = fileData.product
            const fc2Scraper = new Fc2Scraper(this._settings)

            if(this._visit.includes(product)) {
            } else if(type === ProductType.FC2) {
                this._visit.push(product)
                const scrapeData = await fc2Scraper.scrape(product)
                this._scrapeMap.set(product, scrapeData)

                //console.debug(scrapeData)
            }
        })

        await Promise.all(promises)

        return index + batchSize
    }
}

class Fc2Scraper {
    constructor(settings) {
        const httpOptions = {
            baseURL: 'https://adult.contents.fc2.com'
        }
        this._request = axios.create(httpOptions)
        this._settings = settings
    }

    async scrape(product) {
        console.debug(`scraping: ${product}`)
        const scrapeData = await this.downloadText(product)

        if (scrapeData.scrapped) {
            await this.downloadImage(scrapeData.thumb, product, 'poster')
        }
        
        console.debug(`scraping done: ${product}`)
        return scrapeData
    }

    async downloadText(product) {
        const notFoundMsg = 'お探しの商品が見つかりません'
        const pattern = /\d{6,}/g
        const datePattern = /\d{4}(\/|-)\d{2}(\/|-)\d{2}/g
        const [keyword] = product.match(pattern)    
        
        const response = await this._request.get(`/article/${keyword}/`)
        
        const $ = cheerio.load(response.data)
        const scrapeData = new ScrapeData(product)
        
        if($('title').text().indexOf(notFoundMsg) >= 0) {
            console.log(`not found: ${product}`)
            scrapeData.scrapped = false
            return scrapeData
        }
    
        const info = $('.items_article_headerInfo')
        const title = $(info).children('h3').eq(0).text()
        const subInfo = $(info).children('ul').children('li')
        const studio = $(subInfo).filter((index, element) => {
            return $(element).text().startsWith('by ')
        }).text().substring(3)
        
        const release = $(info)
                .find('.items_article_Releasedate')
                .children()
                .eq(0)
                .text()
        const tagList = $(info)
                .find('.items_article_TagArea')
                .find('.tagTag')
        const thumbUrl = $('.items_article_MainitemThumb')
                .find('img').attr('src')
        const runtime = $('.items_article_info').text()
            
        scrapeData.title = title
        scrapeData.release = release.match(datePattern)[0]
        scrapeData.studio = studio
        scrapeData.runtime = runtime
        scrapeData.thumb = `http:${thumbUrl}`
        tagList.each((index, tag) => {
            scrapeData.addTag($(tag).text())
        })
        scrapeData.scrapped = true

        return scrapeData
    }
    
    async downloadImage(url, product, suffix) {
        const response = await this._request.get(url, { responseType: 'stream' });
        const extname = url.substring(url.lastIndexOf('.'))

        const filePath = path.resolve(this._settings['temp'], `${product}-${suffix}${extname}`)
        const writer = fs.createWriteStream(filePath)

        try {
            return await new Promise(function(resolve, reject) {
                writer.on('error', reject);
                writer.on('finish', resolve);
                response.data.pipe(writer);                
              });
        } catch(error) {
            writer.end();
            throw error;
        }
    }
}



