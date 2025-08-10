
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


async function query() {
    var { data: bugs } = await axios.get(BASE_URL)
    return bugs
}
async function getById(bugId) {
    const res = await axios.get(BASE_URL + '/' + bugId)
    return res.data
}
async function remove(bugId) {
    const res = await axios.get(BASE_URL + '/' + bugId + '/remove')
    return res.data
}

async function save(bug) {
    const queryStr = `save?_id=${bug._id || ''}&title=${encodeURIComponent(bug.title)}&severity=${bug.severity}`
    console.log(`${BASE_URL}/${queryStr}`)

    const { data } = await axios.get(`${BASE_URL}/${queryStr}`)
    return data // This will be your saved bug object
}

