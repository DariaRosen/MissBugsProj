import { httpService } from '../http.service'

export const bugService = {
    query,
    getById,
    save,
    remove,
    getDefaultFilter,
    getEmptyBug
}

async function query(filterBy = {}) {
    const params = {
        txt: filterBy.txt || '',
        minSeverity: filterBy.minSeverity || 0,
        pageIdx: filterBy.pageIdx,
        sortBy: filterBy.sortBy || 'title',
        sortDir: filterBy.sortDir || 'asc',
        creatorId: filterBy.creatorId || ''
    }
    return httpService.get('bug', params)
}

function getById(bugId) {
    return httpService.get(`bug/${bugId}`)
}

function remove(bugId) {
    return httpService.delete(`bug/${bugId}`)
}

async function save(bug) {
    if (bug._id) {
        return httpService.put(`bug/${bug._id}`, bug)
    } else {
        return httpService.post('bug', bug)
    }
}

function getDefaultFilter() {
    return {
        txt: '',
        minSeverity: 0,
        pageIdx: undefined,
        sortBy: 'title',
        sortDir: 'asc'
    }
}

function getEmptyBug(title = '', severity = '', description = '', labels = []) {
    return { title, severity, description, labels }
}
