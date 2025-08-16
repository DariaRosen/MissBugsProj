
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
    getDefaultFilter,
    getEmptyUser
}


async function query(filterBy = {}) {
    try {
        var { data: users } = await axios.get(BASE_URL, { params: filterBy })
        return users
    } catch (err) {
        console.log('err:', err)
        throw err
    }
}

async function getById(userId) {
    try {
        const res = await axios.get(BASE_URL + '/' + userId)
        return res.data
    } catch (err) {
        console.log('err:', err)
        throw err
    }
}

async function remove(userId) {
    const url = BASE_URL + '/' + userId
    try {
        const { data: res } = await axios.delete(url)
        return res.data
    } catch (err) {
        console.log('err:', err)
        throw err
    }
}

async function save(userToSave) {
    try {
        if (userToSave._id) { // Update existing user
            const { data } = await axios.put(`${BASE_URL}/${userToSave._id}`, userToSave)
            return data.savedUser
        } else { // Create new user
            const { data } = await axios.post(BASE_URL, userToSave)
            return data.savedUser
        }
    } catch (err) {
        console.log('err:', err)
        throw err
    }
}

function getDefaultFilter() {
    return { txt: '', minSeverity: 0, pageIdx: undefined }
}

function getEmptyUser(fullname = '', username = '', password = '', score = 0, isAdmin = false) {
    return { fullname, username, password, score, isAdmin }
}