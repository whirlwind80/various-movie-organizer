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
            const scrapeData = this._scrapeDataMap.get(fileData.product)

            if(scrapeData === undefined || scrapeData.scrapped === false) {
                return
            }

            const nfo = this.createNfo(scrapeData)
            const metaFilename = path.basename(fileData.original, path.extname(fileData.original))

            this.writeNfo(metaFilename, nfo)
            this.copyImage(metaFilename, fileData.product)
        })
    }

    createNfo(scrapeData) {
        const $ = cheerio.load('<movie>', { xmlMode: true,decodeEntities: false })
       
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

        return html.prettyPrint($.html())
    }

    writeNfo(filename, nfo) {
        const filePath = path.join(this._settings.target, `${filename}.nfo`)
        const fileStream = fs.createWriteStream(filePath, { encoding: 'utf8' })
        
        fileStream.write(nfo)
        fileStream.end()
    }

    async copyImage(filename, product) {        
        const files = fs.readdirSync(this._settings['temp']).filter(file => {
            return path.basename(file, path.extname(file)) === `${product}-poster`
        })        
        
        const promises = files.map(async (file) => {            
            const srcFilename = path.resolve(this._settings['temp'], file)
            const targetFilename = path.resolve(this._settings['target'], `${filename}-poster${path.extname(file)}`)
            this.copyFile(srcFilename, targetFilename)            
        })

        await Promise.all(promises)
    }

    async copyFile(src, target) {
        const read = fs.createReadStream(src)
        const write = fs.createWriteStream(target)

        try {
            return await new Promise(function(resolve, reject) {
                read.on('error', reject);
                write.on('error', reject);
                write.on('finish', () => {
                    console.debug('copy')
                });
                read.pipe(write);                
              });
        } catch(error) {
            read.destroy();
            write.end();
            throw error;
        }
    }
}