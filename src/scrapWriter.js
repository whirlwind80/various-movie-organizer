import cheerio from 'cheerio'

export default class scrapWriter {
    constructor(fileDataList, scrapDataMap, settings) {
        this._fileDataList = fileDataList
        this._scrapDataMap = scrapDataMap
        this._settings = settings
    }

    write() {
        this._fileDataList.forEach((fileData) => {
            const nfo = this.createNfo(fileData)
        })
    }

    createNfo(fileData) {
        const scrapData = this._scrapDataMap.get(fileData.product)
        const $ = cheerio.load('<movie>', { xmlMode: true })
        //$('movie').append('<title></title>').text(scrapData.title)
        
        console.debug($.html())
    }
}