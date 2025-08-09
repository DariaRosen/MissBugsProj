import fs from 'fs'
import fr from 'follow-redirects'

const { http, https } = fr

export function readJsonFile(filePath) {
    try {
        const str = fs.readFileSync(filePath, 'utf8')
        const jsonData = JSON.parse(str)
        return jsonData
    } catch (err) {
        console.error(`Error reading file from disk: ${err}`)
        return []
    }
}

export function writeJsonFile(filePath, data) {
    return new Promise((resolve, reject) => {
        const jsonData = JSON.stringify(data, null, 2)

        fs.writeFile(filePath, jsonData, 'utf8', (err) => {
            if (err) {
                console.error(`Error writing file to disk: ${err}`)
                reject(err)
            } else {
                console.log('JSON file has been saved.')
                resolve()
            }
        })
    })
}

export function download(url, fileNameDestination) {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(fileNameDestination)

        https.get(url, (content) => {
            content.pipe(file)
            file.on('error', reject)
            file.on('finish', () => {
                file.close()
                resolve()
            })
        })
    })
}

export function httpGet(url) {
    const protocol = url.startsWith('https') ? https : http
    const options = {
        method: 'GET',
    }

    return new Promise((resolve, reject) => {
        const req = protocol.request(url, options, (res) => {
            let data = ''
            res.on('data', (chunk) => {
                data += chunk
            })
            res.on('end', () => {
                resolve(data)
            })
        })
        req.on('error', (err) => {
            console.error(`Error making HTTP request: ${err}`)
            reject(err)
        })
        req.end()
    })
}

export function makeId(length = 6) {
    var txt = ''
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

    for (var i = 0; i < length; i++) {
        txt += possible.charAt(Math.floor(Math.random() * possible.length))
    }

    return txt
}
