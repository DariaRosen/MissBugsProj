
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
    const url = BASE_URL + '/' + bugId
    try {
        const { data: res } = await axios.delete(url)
        return res.data
    } catch (err) {
        console.error(err)
        throw new Error('Cannot remove bug')
    }
}

async function save(bugToSave) {
    const url = BASE_URL + '/' + bugToSave._id
    try {
        if (bugToSave._id) { // Update existing bug
            const { data: updatedBug } = await axios.put(url, bugToSave)
            return updatedBug
        }
        else { // Create new bug
            const { data: savedBug } = await axios.post(BASE_URL, bugToSave)
            return savedBug // This will be your saved bug object
        }

    } catch (err) {
        console.error(err)
        throw new Error('Cannot save bug')
    }
}
