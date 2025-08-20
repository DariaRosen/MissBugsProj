import fs from 'fs'
import { readJsonFile, makeId } from '../../services/util.service.js'

const users = readJsonFile('./data/users.json')
const PAGE_SIZE = 3 // Backend controls page size

export const userService = {
    query,
    getById,
    remove,
    save,
    getByUsername
}

async function query(filterBy) {
    let usersToDisplay = users
    try {
        // Filter by title
        if (filterBy.title) {
            const regex = new RegExp(filterBy.title, 'i')
            usersToDisplay = usersToDisplay.filter(user => regex.test(user.title))
        }

        // Filter by severity
        if (filterBy.minSeverity) {
            usersToDisplay = usersToDisplay.filter(user => user.severity >= filterBy.minSeverity)
        }

        // Filter by labels
        if (filterBy.labels && filterBy.labels.length) {
            const labelsArray = Array.isArray(filterBy.labels)
                ? filterBy.labels
                : [filterBy.labels] // in case query param is string
            usersToDisplay = usersToDisplay.filter(user =>
                Array.isArray(user.labels) &&
                labelsArray.every(labelFilter =>
                    user.labels.some(userLabel => userLabel.toLowerCase().includes(labelFilter.toLowerCase()))
                )
            )
        }

        // Paging
        if ('pageIdx' in filterBy) {
            const startIdx = filterBy.pageIdx * PAGE_SIZE // 0
            usersToDisplay = usersToDisplay.slice(startIdx, startIdx + PAGE_SIZE)
        }

        return usersToDisplay

    } catch (err) {
        throw err
    }
}

function getById(userId) {
    try {
        const user = users.find(b => b._id === userId)
        if (!user) throw `Couldn't find user with _id ${userId}`
        return user

    } catch (err) {
        throw err
    }
}

async function remove(userId) {
    try {
        const idx = users.findIndex(b => b._id === userId)
        if (idx === -1) throw `Couldn't remove user with _id ${userId}`
        users.splice(idx, 1)
        return _saveUsersToFile()
    } catch (err) {
        throw err
    }
}

async function save(userToSave) {
    try {
        if (userToSave._id) {
            const idx = users.findIndex(user => user._id === userToSave._id)
            console.log('idx:', idx);
            if (idx === -1) throw `Couldn't update user with _id ${userToSave._id}`
            users[idx] = userToSave
        } else {
            userToSave._id = makeId()
            users.push(userToSave)
        }
        await _saveUsersToFile()
        return userToSave
    } catch (err) {
        throw err
    }
}

function _saveUsersToFile(path = './data/users.json') {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify(users, null, 4)
        fs.writeFile(path, data, (err) => {
            if (err) return reject(err)
            resolve()
        })
    })
}

async function getByUsername(username) {
    try {
        const user = users.find(user => user.username === username)
        // if (!user) throw `User not found by username : ${username}`
        return user
    } catch (err) {
        loggerService.error('userService[getByUsername] : ', err)
        throw err
    }
}