import fs from 'fs'

export const utilService = {
    makeId,
    makeLorem,
    getRandomIntInclusive,
    readJsonFile,
    writeJsonFile
}

function makeId(length = 6) {
    var txt = ''
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

    for (var i = 0; i < length; i++) {
        txt += possible.charAt(Math.floor(Math.random() * possible.length))
    }

    return txt
}

function makeLorem(size = 100) {
    var words = ['The sky', 'above', 'the port', 'was', 'the color of television', 'tuned', 'to', 'a dead channel', '.', 'All', 'this happened', 'more or less', '.', 'I', 'had', 'the story', 'bit by bit', 'from various people', 'and', 'as generally', 'happens', 'in such cases', 'each time', 'it', 'was', 'a different story', '.', 'It', 'was', 'a pleasure', 'to', 'burn']
    var txt = ''
    while (size > 0) {
        size--
        txt += words[Math.floor(Math.random() * words.length)] + ' '
    }
    return txt
}

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min + 1)) + min //The maximum is inclusive and the minimum is inclusive 
}

function readJsonFile(filePath) {
    try {
        const str = fs.readFileSync(filePath, 'utf8')
        const jsonData = JSON.parse(str)
        return jsonData
    } catch (err) {
        console.error(`Error reading file from disk: ${err}`)
        return []
    }
}

function writeJsonFile(filePath, data) {
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
