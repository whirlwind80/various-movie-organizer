export class FileData {
    constructor(id, original) {
        this._id = id
        this._original = original
        this._product = ''
        this._type = ''
    }

    get id() {
        return this._id
    }

    get original() {
        return this._original
    }

    set product(value) {
        this._product = value
    }

    get product() {
        return this._product
    }

    set type(value) {
        this._type = value
    }

    get type() {
        return this._type
    }
}

export class ScrapeData {
    constructor(id) {
        this._id = id        
        this._tag = []
        this._actor = []
        this._title = ''
        this._release = ''
        this._year = ''
        this._studio = ''
        this._plot = ''
        this._runtime = ''
        this._thumb = ''
        this._fanart = ''
        this._director = ''
        this._scrapped = false
    }

    get id() {
        return this._id
    }

    get title() {
        return this._title
    }

    set title(value) {
        this._title = value
    }

    get release() {
        return this._release
    }

    set release(value) {
        this._release = value
        this._year = value.substring(0, 4)
    }

    get year() {
        return this._year
    }

    get studio() {
        return this._studio
    }

    set studio(value) {
        this._studio = value
    }

    get plot() {
        return this._plot
    }

    set plot(value) {
        this._plot = value
    }
    
    get runtime() {
        return this._runtime
    }

    set runtime(value) {
        this._runtime = value
    }

    get actor() {
        return this._actor
    }

    set actor(value) {
        this._actor = value
    }

    get thumb() {
        return this._thumb
    }

    set thumb(value) {
        this._thumb = value
    }

    get fanart() {
        return this._fanart
    }

    set fanart(value) {
        this._fanart = value
    }

    get tag() {
        return this._tag
    }

    set tag(value) {
        this._tag = value
    }

    get director() {
        return this._director
    }

    set director(value) {
        this._director = value
    }

    get scrapped() {
        return this._scrapped
    }

    set scrapped(value) {
        this._scrapped = value
    }

    addActor(value) {
        this._actor.push(value)
    }

    addTag(value) {
        this._tag.push(value)
    }
}

export const ProductType = {
    'FC2': 'FC2',
    'JAV': 'JAV',
    'UNCENSORED': 'UNCENSORED',
    'COSPLAY': 'COSPLAY',
    'DEFAULT': 'NONE'
}