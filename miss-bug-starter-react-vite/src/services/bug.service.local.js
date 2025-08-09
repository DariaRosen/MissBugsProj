
import { storageService } from './async-storage.service.js'
import { utilService } from './util.service.js'
import Axios from 'axios'
import fs from 'fs'
// const STORAGE_KEY = 'bugDB'
const bugs = utilService.readJsonFile('./data/bugs.json')

var gAxios = Axios.create({
    withCredentials: true,
})

const BASE_URL = '//localhost:3030/api/bug'
export const bugService = {
    query,
    getById,
    remove,
    save,
}


async function query() {
    // return storageService.query(STORAGE_KEY)
    var res = await gAxios.get(BASE_URL)
    var bugs = res.data
    return bugs
}
function getById(bugId) {
    // return storageService.get(STORAGE_KEY, bugId)
    return bugs.find(b => b._id === bugId)
}
async function remove(bugId) {
    // return storageService.remove(STORAGE_KEY, bugId)
    const idx = bugs.findIndex(b => b._id === bugId)
    bugs.splice(idx, 1)

    return _saveBugs()
}
async function save(bugToSave) {
    if (bugToSave._id) {
        // return storageService.put(STORAGE_KEY, bugToSave)
        const idx = bugs.findIndex(b => b._id === bugToSave._id)
        bugs.splice(idx, 1, bugToSave)
    } else {
        // return storageService.post(STORAGE_KEY, bugToSave)
        bugToSave._id = utilService.makeId()
        bugs.push(bugToSave)
    }
    await _saveBugs()
    return bugToSave
}
function _saveBugs() {
    return utilService.writeJsonFile('data/bugs.json', bugs)
}