
import { loggerService } from './logger.service.js'
import { readJsonFile } from './util.service.js'
import { writeJsonFile } from './util.service.js'
// import Axios from 'axios'

const bugs = readJsonFile('./data/bugs.json')

// var gAxios = Axios.create({
//     withCredentials: true,
// })

// const BASE_URL = '//localhost:3030/api/bug'
export const bugService = {
    query,
    getById,
    remove,
    save,
}

async function query(filterBy) {
    let bugsToDisplay = bugs
    try {
        if (filterBy.title) {
            const regex = new RegExp(filterBy.title, 'i')
            bugsToDisplay = bugsToDisplay.filter(bug => regex.test(bug.title))
        }
        if (filterBy.minSeverity) {
            bugsToDisplay = bugsToDisplay.filter(bug => bug.severity >= filterBy.minSeverity)
        }
    } catch (err) {
        loggerService.error('Error fetching bugs:', err)
        throw err
    }
    return bugsToDisplay
}

function getById(bugId) {
    const bug = bugs.find(b => b._id === bugId)
    if (!bug) {
        loggerService.warn(`Bug with ID ${bugId} not found`)
        throw `Bug not found`
    }
    return bug
}
async function remove(bugId) {
    try {
        const idx = bugs.findIndex(b => b._id === bugId)
        bugs.splice(idx, 1)

    } catch (err) {
        loggerService.error('Error removing bug:', err)
        throw err
    }

    return _saveBugs()
}

async function save(bugToSave) {
    const bugs = readJsonFile('./data/bugs.json') // fresh copy
    try {
        const idx = bugs.findIndex(b => b._id === bugToSave._id)
        if (idx >= 0) {
            bugs[idx] = bugToSave // update existing
        } else {
            bugToSave._id = bugToSave._id || makeId()
            bugs.push(bugToSave) // add new
        }

        await writeJsonFile('./data/bugs.json', bugs)
        return bugToSave
    }
    catch (err) {
        loggerService.error('Error saving bug:', err)
        throw err
    }
}


function _saveBugs() {
    return writeJsonFile('data/bugs.json', bugs)
}