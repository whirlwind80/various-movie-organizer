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
        const promises = this._fileDataList.map(async (fileData) => {
            const type = fileData.type
            const product = fileData.product
            const fc2Scraper = new Fc2Scraper(this._settings)
            const visit = []

            if(this._visit.includes(product)) {
            } else if(type === ProductType.FC2) {
                this._visit.push(product)
                const scrapeData = await fc2Scraper.scrape(product)
                this._scrapeMap.set(product, scrapeData)

                console.debug(scrapeData)
            }
        })

        await Promise.all(promises)
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
        const scrapeData = await this.downloadText(product)
        await this.downloadImage(scrapeData.thumb, 'poster', product)
        
        return scrapeData
    }

    async downloadText(product) {
        const notFoundMsg = 'お探しの商品が見つかりません'
        const pattern = /\d{6,}/g
        const datePattern = /\d{4}(\/|-)\d{2}(\/|-)\d{2}/g
        const [keyword] = product.match(pattern)    
        
        const response = await this._request.get(`/article/${keyword}/`)
        
        const $ = cheerio.load(response.data)
        
        if($('title').text().indexOf(notFoundMsg) >= 0) {
            console.log('not found')
            return
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
    
        const scrapeData = new ScrapeData(product)
        scrapeData.title = title
        scrapeData.release = release.match(datePattern)[0]
        scrapeData.studio = studio
        scrapeData.runtime = runtime
        scrapeData.thumb = `http:${thumbUrl}`
        tagList.each((index, tag) => {
            scrapeData.addTag($(tag).text())
        })
        scrapeData.scrapped = true
    
        console.debug('scraped')

        return scrapeData
    }
    
    async downloadImage(url, product, suffix) {
        const response = await this._request.get(url, { responseType: 'stream' });
        const extname = url.substring(url.lastIndexOf('.'))

        const filePath = path.resolve(this._settings['target'], `${product}-${suffix}${extname}`)
        const writer = fs.createWriteStream(filePath)
        
        response.data.pipe(writer)        
    }
}



