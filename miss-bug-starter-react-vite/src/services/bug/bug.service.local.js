
import { storageService } from '../async-storage.service.js'
import { utilService } from '../util.service.js'
import Axios from 'axios'

var axios = Axios.create({
    withCredentials: true,
})

// const STORAGE_KEY = 'bugDB'
const BASE_URL = '//localhost:3030/api/bug'

export const bugService = {
    query,
    getById,
    save,
    remove,
}


function query() {
    var bugs = axios.get(BASE_URL)
    return storageService.query(STORAGE_KEY)
}
function getById(bugId) {
    return storageService.get(STORAGE_KEY, bugId)
}
function remove(bugId) {
    return storageService.remove(STORAGE_KEY, bugId)
}
function save(bug) {
    if (bug._id) {
        return storageService.put(STORAGE_KEY, bug)
    } else {
        return storageService.post(STORAGE_KEY, bug)
    }
}