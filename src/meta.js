export class FileData {
    constructor(id, original) {
        this._id = id
        this._original = original
    }

    get id() {
        return this._id
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

export class ScrapData {
    constructor(id) {
        this._id = id        
        this._tag = []
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

    get actorThumb() {
        return this._actorThumb
    }

    set actorThumb(value) {
        this._actorThumb = value
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