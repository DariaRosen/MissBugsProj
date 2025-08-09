
import { readJsonFile } from './util.service.js'
import { writeJsonFile } from './util.service.js'
// import Axios from 'axios'

const bugs = readJsonFile('./data/bugs.json')

// var gAxios = Axios.create({
//     withCredentials: true,
// })

// const BASE_URL = '//localhost:3030/api/bug'
export const bugService = {
    query,
    getById,
    remove,
    save,
}

async function query() {
    // var res = await gAxios.get(BASE_URL)
    // var bugs = res.data
    return bugs
}

function getById(bugId) {
    const bug = bugs.find(b => b._id === bugId)
    return bug
}
async function remove(bugId) {
    const idx = bugs.findIndex(b => b._id === bugId)
    bugs.splice(idx, 1)

    return _saveBugs()
}

async function save(bugToSave) {
    if (bugToSave._id) {
        const idx = bugs.findIndex(b => b._id === bugToSave._id)
        bugs.splice(idx, 1, bugToSave)
    } else {
        bugToSave._id = makeId()
        bugs.push(bugToSave)
    }
    await _saveBugs()
    return bugToSave
}

function _saveBugs() {
    return writeJsonFile('data/bugs.json', bugs)
}