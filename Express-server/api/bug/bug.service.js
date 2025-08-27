import { ObjectId } from 'mongodb'

import { loggerService } from '../../services/logger.service.js'
import { dbService } from '../../services/db.service.js'
import { asyncLocalStorage } from '../../services/als.service.js'

const PAGE_SIZE = 3

export const bugService = {
    query,
    getById,
    remove,
    add,
    update,
}

async function query(filterBy = {}) {
    try {
        const criteria = _buildCriteria(filterBy)
        const sort = _buildSort(filterBy)

        const collection = await dbService.getCollection('bug')
        var bugCursor = collection.find(criteria, { sort })

        if (filterBy.pageIdx !== undefined) {
            bugCursor = bugCursor.skip(filterBy.pageIdx * PAGE_SIZE).limit(PAGE_SIZE)
        }

        const bugs = await bugCursor.toArray()
        return bugs
    } catch (err) {
        loggerService.error('cannot find bugs', err)
        throw err
    }
}

async function getById(bugId) {
    try {
        const criteria = { _id: ObjectId.createFromHexString(bugId) }
        const collection = await dbService.getCollection('bug')
        const bug = await collection.findOne(criteria)

        if (!bug) throw `Couldn't find bug with _id ${bugId}`

        bug.createdAt = bug._id.getTimestamp()
        return bug
    } catch (err) {
        loggerService.error(`while finding bug ${bugId}`, err)
        throw err
    }
}

async function remove(bugId) {
    const { loggedinUser } = asyncLocalStorage.getStore()
    const { _id: userId, isAdmin } = loggedinUser

    try {
        const criteria = { _id: ObjectId.createFromHexString(bugId) }
        if (!isAdmin) criteria['creator._id'] = userId

        const collection = await dbService.getCollection('bug')
        const res = await collection.deleteOne(criteria)

        if (res.deletedCount === 0) throw new Error('Not authorized to remove this bug')
        return bugId
    } catch (err) {
        loggerService.error(`cannot remove bug ${bugId}`, err)
        throw err
    }
}

async function add(bug) {
    try {
        const collection = await dbService.getCollection('bug')
        await collection.insertOne(bug)
        return bug
    } catch (err) {
        loggerService.error('cannot insert bug', err)
        throw err
    }
}

async function update(bug) {
    try {
        const criteria = { _id: ObjectId.createFromHexString(bug._id) }
        const bugToSave = {
            title: bug.title,
            severity: bug.severity,
            labels: bug.labels,
            description: bug.description,
        }

        const collection = await dbService.getCollection('bug')
        await collection.updateOne(criteria, { $set: bugToSave })
        return bug
    } catch (err) {
        loggerService.error(`cannot update bug ${bug._id}`, err)
        throw err
    }
}

function _buildCriteria(filterBy) {
    const criteria = {}
    if (filterBy.title) {
        criteria.title = { $regex: filterBy.title, $options: 'i' }
    }
    if (filterBy.minSeverity) {
        criteria.severity = { $gte: +filterBy.minSeverity }
    }
    if (filterBy.creatorId) {
        criteria['creator._id'] = filterBy.creatorId
    }
    if (filterBy.labels && filterBy.labels.length) {
        criteria.labels = { $all: Array.isArray(filterBy.labels) ? filterBy.labels : [filterBy.labels] }
    }
    return criteria
}

function _buildSort(filterBy) {
    if (!filterBy.sortField) return {}
    const dir = filterBy.sortDir === 'desc' ? -1 : 1
    return { [filterBy.sortField]: dir }
}
