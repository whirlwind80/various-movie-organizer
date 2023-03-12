import cheerio from 'cheerio'
import fs from 'fs'
import path from 'path'
import html from 'html'

export default class metaWriter {
    constructor(fileDataList, scrapeDataMap, settings) {
        this._fileDataList = fileDataList
        this._scrapeDataMap = scrapeDataMap
        this._settings = settings
    }

    write() {
        this._fileDataList.forEach((fileData) => {
            const nfo = this.createNfo(fileData)
        })
    }

    createNfo(fileData) {
        const scrapeData = this._scrapeDataMap.get(fileData.product)
        const $ = cheerio.load('<movie>', { xmlMode: true,decodeEntities: false })
        
        if(scrapeData === undefined || scrapeData.scrapped === false) {
            return
        }

        $('<title>').text(scrapeData.title).appendTo('movie')
        $('<originaltitle>').text(scrapeData.title).appendTo('movie')
        $('<id>').text(scrapeData.id).appendTo('movie')
        
        $('<releasedate>').text(scrapeData.release).appendTo('movie')
        $('<year>').text(scrapeData.year).appendTo('movie')
        $('<director>').text(scrapeData.director).appendTo('movie')
        $('<studio>').text(scrapeData.studio).appendTo('movie')
        $('<plot>').text(scrapeData.plot).appendTo('movie')
        $('<runtime>').text(scrapeData.runtime).appendTo('movie')
        $('<thumb>').text(scrapeData.thumb).appendTo('movie')

        scrapeData.actor.forEach(actor => {
            const actorTag = $('<actor>')
            $(actorTag).appendTo('movie')
            $('<name>').text(actor.name).appendTo($(actorTag))
            $('<altname>').text(actor.altName).appendTo($(actorTag))
            $('<thumb>').text(actor.thumb).appendTo($(actorTag))
        })
        
        scrapeData.tag.forEach(tag => {
            $('<genre>').text(tag).appendTo('movie')
        })

        scrapeData.tag.forEach(tag => {
            $('<tag>').text(tag).appendTo('movie')
        })

        const filename = path.join(this._settings.target, `${fileData.original}.nfo`)
        const fileStream = fs.createWriteStream(filename, { encoding: 'utf8' })
        
        fileStream.write(html.prettyPrint($.html()))
        fileStream.end()
    }
}