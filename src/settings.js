import fs from 'fs'

export function readSettings() {
    let settings = {}    

    try {
        const data = fs.readFileSync('./resource/settings.json', 'utf8')
        const json = JSON.parse(data)              
                
        const extensions = json['ext']
        const extSet = new Set(Object.values(extensions))
        
        settings['source'] = json['source']
        settings['ext'] = extSet
        settings['target'] = json['target']
        settings['temp'] = json['temp']
        settings['error'] = json['error']

        console.log('settings are loaded')
    } catch (error) {        
        settings = {}
        console.log('settings are not loaded')
        console.log(error)
    }

    return settings
}