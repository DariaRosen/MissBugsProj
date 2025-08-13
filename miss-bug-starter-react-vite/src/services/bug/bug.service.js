
import Axios from 'axios'

var axios = Axios.create({
    withCredentials: true,
})

const BASE_URL = '//localhost:3030/api/bug'

export const bugService = {
    query,
    getById,
    save,
    remove,
}


async function query(filterBy = {}) {
    try {
        var { data: bugs } = await axios.get(BASE_URL, { params: filterBy })
        return bugs
    } catch (err) {
        console.error(err)
        throw new Error('Cannot load bugs')
    }
}
async function getById(bugId) {
    try {
        const res = await axios.get(BASE_URL + '/' + bugId)
        return res.data
    } catch (err) {
        console.error(err)
        throw new Error('Cannot load bug')
    }
}
async function remove(bugId) {
    // const res = await axios.get(BASE_URL + '/' + bugId + '/remove')
    const url = BASE_URL + '/remove'
    try {
        const { data: res } = await axios.get(url)
        return res.data
    } catch (err) {
        console.error(err)
        throw new Error('Cannot remove bug')
    }
}

async function save(carToSave) {
    let url = BASE_URL + '/save'
    try {
        // const queryStr = `save?_id=${bug._id || ''}&title=${encodeURIComponent(bug.title)}&severity=${bug.severity}&createdAt=${bug.createdAt}&description=${encodeURIComponent(bug.description || '')}`
        // console.log(`${BASE_URL}/${queryStr}`)

        const { data: savedBug } = await axios.get(url, { params: carToSave })
        return savedBug // This will be your saved bug object
    } catch (err) {
        console.error(err)
        throw new Error('Cannot save bug')
    }
}
