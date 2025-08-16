
import { storageService } from '../async-storage.service.js'
import { utilService } from '../util.service.js'
import Axios from 'axios'

var axios = Axios.create({
    withCredentials: true,
})

const BASE_URL = '//localhost:3030/api/user'

export const userService = {
    query,
    getById,
    save,
    remove,
}


function query() {
    var users = axios.get(BASE_URL)
    return storageService.query(STORAGE_KEY)
}
function getById(userId) {
    return storageService.get(STORAGE_KEY, userId)
}
function remove(userId) {
    return storageService.remove(STORAGE_KEY, userId)
}
function save(user) {
    if (user._id) {
        return storageService.put(STORAGE_KEY, user)
    } else {
        return storageService.post(STORAGE_KEY, user)
    }
}