import fs from 'fs'
import { readJsonFile, makeId } from '../../services/util.service.js'

const bugs = readJsonFile('./data/bugs.json')
const PAGE_SIZE = 3 // Backend controls page size

export const bugService = {
    query,
    getById,
    remove,
    save,
}

async function query(filterBy) {
    let bugsToDisplay = bugs
    try {
        // Filter by title
        if (filterBy.title) {
            const regex = new RegExp(filterBy.title, 'i')
            bugsToDisplay = bugsToDisplay.filter(bug => regex.test(bug.title))
        }

        // Filter by severity
        if (filterBy.minSeverity) {
            bugsToDisplay = bugsToDisplay.filter(bug => bug.severity >= +filterBy.minSeverity)
        }

        // Filter by labels
        if (filterBy.labels && filterBy.labels.length) {
            const labelsArray = Array.isArray(filterBy.labels)
                ? filterBy.labels
                : [filterBy.labels]
            bugsToDisplay = bugsToDisplay.filter(bug =>
                Array.isArray(bug.labels) &&
                labelsArray.every(labelFilter =>
                    bug.labels.some(bugLabel =>
                        bugLabel.toLowerCase().includes(labelFilter.toLowerCase())
                    )
                )
            )
        }

        // ✅ Sorting
        if (filterBy.sortBy) {
            const sortDir = filterBy.sortDir === 'desc' ? -1 : 1
            bugsToDisplay = bugsToDisplay.sort((a, b) => {
                if (filterBy.sortBy === 'title') {
                    return a.title.localeCompare(b.title) * sortDir
                } else if (filterBy.sortBy === 'severity') {
                    return (a.severity - b.severity) * sortDir
                } else if (filterBy.sortBy === 'createdAt') {
                    return (new Date(a.createdAt) - new Date(b.createdAt)) * sortDir
                }
                return 0
            })
        }

        // Paging
        if ('pageIdx' in filterBy) {
            const startIdx = filterBy.pageIdx * PAGE_SIZE
            bugsToDisplay = bugsToDisplay.slice(startIdx, startIdx + PAGE_SIZE)
        }

        return bugsToDisplay

    } catch (err) {
        throw err
    }
}

function getById(bugId) {
    try {
        const bug = bugs.find(b => b._id === bugId)
        if (!bug) throw `Couldn't find bug with _id ${bugId}`
        return bug
    } catch (err) {
        throw err
    }
}

async function remove(bugId) {
    try {
        const idx = bugs.findIndex(b => b._id === bugId)
        if (idx === -1) throw `Couldn't remove bug with _id ${bugId}`
        bugs.splice(idx, 1)
        return _saveBugsToFile()
    } catch (err) {
        throw err
    }
}

async function save(bugToSave) {
    try {
        if (bugToSave._id) {
            const idx = bugs.findIndex(bug => bug._id === bugToSave._id)
            if (idx === -1) throw `Couldn't update bug with _id ${bugToSave._id}`
            bugs[idx] = bugToSave
        } else {
            bugToSave._id = makeId()
            bugs.push(bugToSave)
        }
        await _saveBugsToFile()
        return bugToSave
    } catch (err) {
        throw err
    }
}

function _saveBugsToFile(path = './data/bugs.json') {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify(bugs, null, 4)
        fs.writeFile(path, data, (err) => {
            if (err) return reject(err)
            resolve()
        })
    })
}
