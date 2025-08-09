// The fs module is a CORE module of Node
import fs from 'fs'

// demoSync()
// function demoSync() {
// const contents = fs.readFileSync('data/data.txt', 'utf8')
// console.log(contents)
// }

const bugs = readJsonFile('data/bugs.json')
console.log(bugs)

function readJsonFile(path) {
const json = fs.readFileSync(path, 'utf8')
const data = JSON.parse(json)
return data
}
