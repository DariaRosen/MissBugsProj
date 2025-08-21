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
    getDefaultFilter,
    getEmptyBug
}


async function query(filterBy = {}) {
    try {
        // Support sorting in backend
        const params = {
            txt: filterBy.txt || '',
            minSeverity: filterBy.minSeverity || 0,
            pageIdx: filterBy.pageIdx,
            sortBy: filterBy.sortBy,   // ✅ add sorting field
            sortDir: filterBy.sortDir,  // ✅ add sorting direction
            creatorId: filterBy.creatorId || ''
        }

        var { data: bugs } = await axios.get(BASE_URL, { params })
        return bugs
    } catch (err) {
        console.log('err:', err)
        throw err
    }
}

async function getById(bugId) {
    try {
        const res = await axios.get(BASE_URL + '/' + bugId)
        return res.data
    } catch (err) {
        console.log('err:', err)
        throw err
    }
}

async function remove(bugId) {
    const url = BASE_URL + '/' + bugId
    try {
        const { data: res } = await axios.delete(url)
        return res.data
    } catch (err) {
        console.log('err:', err)
        throw err
    }
}

async function save(bugToSave) {
    try {
        if (bugToSave._id) { // Update existing bug
            const { data } = await axios.put(`${BASE_URL}/${bugToSave._id}`, bugToSave)
            return data.savedBug
        } else { // Create new bug
            const { data } = await axios.post(BASE_URL, bugToSave)
            return data.savedBug
        }
    } catch (err) {
        console.log('err:', err)
        throw err
    }
}

function getDefaultFilter() {
    return {
        txt: '',
        minSeverity: 0,
        pageIdx: undefined,
        sortBy: 'title',   // ✅ default sort field
        sortDir: 'asc'     // ✅ default direction
    }
}

function getEmptyBug(title = '', severity = '', description = '', labels = []) {
    return { title, severity, description, labels }
}
