import axios from 'axios'
import cheerio from 'cheerio'
import { ScrapData, ProductType } from './meta.js'


export default class Scrapper {
    constructor (fileDataList, settings) {
        this._fileDataList = fileDataList
        this._settings = settings
        this._scrapMap = new Map()
    }

    get scrapMap() {
        return this._scrapMap
    }

    scrap() {
        this._fileDataList.forEach((fileData) => {
            const type = fileData.type
            const product = fileData.product

            if(this._scrapMap.has(product)) {                
            } else if(type === ProductType.FC2) {
                const scrapData = scrapFc2(product)
                this._scrapMap.set(product, scrapData)
            }
        })
    }
}

function scrapFc2(product) {
    const notFoundMsg = 'お探しの商品が見つかりません'
    const pattern = /\d{6,}/
    const [keyword] = product.match(pattern)    
    const httpOptions = {
        baseURL: 'https://adult.contents.fc2.com'
    }
    const request = axios.create(httpOptions)
    request.get(`/article/${keyword}/`, httpOptions)
    .then((response) => {
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

        const scrapData = new ScrapData(product)
        scrapData.title = title
        scrapData.release = release
        scrapData.studio = studio
        scrapData.runtime =
        scrapData.thumb = thumbUrl
        tagList.forEach((tag) => {
            scrapData.addTag(tag)
        })

        console.debug(scrapData)
        
        return scrapData
    })
}

