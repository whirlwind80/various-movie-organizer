import fs from 'fs'
import path from 'path'
import { FileData, ProductType } from './meta.js'

export default class ProductProcessor {
    constructor(settings) {
        this._settings = settings
    }

    get fileDataList() {
        return this._fileDataList
    }

    process() {
        const settings = this._settings
        const sourceDir = settings['source']
        const targetExt = settings['ext']
        //const destPath = path.normalize(properties.getDest())
        //const errPath = path.normalize(properties.getErr())

        let dir
        let fileDataList = []
        let productSet = new Set()

        try {
            console.log('open dir: ' + sourceDir)
            dir = fs.readdirSync(sourceDir, { withFileTypes: true })
        } catch (err) {
            console.log(err)
            return
        }

        dir.forEach((dirent) => {
            if(dirent.isFile() && targetExt.has(path.extname(dirent.name))) {
                const fileFullPath = path.join(sourceDir, dirent.name)
                const fileData = new FileData(fileFullPath, dirent.name)
                javProduct(fc2Product(defaultProduct(fileData)))
                console.debug(fileData)

                fileDataList.push(fileData)
            }
        })

        this._fileDataList = fileDataList        
    }
}

function fc2Product(getProduct) {
    const pattern = /FC2.+\d{6}/gi
    const fileData = getProduct

    return commonProduct(fileData, pattern, ProductType.FC2)
}

function javProduct(getProduct) {
    const pattern = /[A-z]+-[0-9]+/gi
    const fileData = getProduct

    return commonProduct(fileData, pattern, ProductType.JAV)    
}

function commonProduct(fileData, pattern, type) {    
    const dirent = fileData.id

    if(fileData.type === ProductType.DEFAULT) {
        const filename = path.basename(dirent, path.extname(dirent))
        const product = filename.match(pattern)    

        if(product != null && product.length > 0) {
            fileData.type = type
            fileData.product = product[0]
        } 
    }

    return fileData
}

function defaultProduct(fileData) {
    fileData.type = ProductType.DEFAULT
    return fileData
}