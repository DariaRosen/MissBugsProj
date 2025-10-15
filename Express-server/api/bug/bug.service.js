import { ObjectId } from 'mongodb'
import { loggerService } from '../../services/logger.service.js'
import { dbService } from '../../services/db.service.js'
import { asyncLocalStorage } from '../../services/als.service.js'

const PAGE_SIZE = 4

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
        const collection = await dbService.getCollection('Bugs')

        let cursor = collection.find(criteria, { sort })

        if (filterBy.pageIdx !== undefined)
            cursor = cursor.skip(filterBy.pageIdx * PAGE_SIZE).limit(PAGE_SIZE)

        return await cursor.toArray()
    } catch (err) {
        loggerService.error('cannot find bugs', err)
        throw err
    }
}

async function getById(bugId) {
    try {
        const collection = await dbService.getCollection('Bugs')
        const criteria = ObjectId.isValid(bugId)
            ? { _id: new ObjectId(bugId) }
            : { _id: bugId }

        const bug = await collection.findOne(criteria)
        if (!bug) throw `Couldn't find bug with _id ${bugId}`
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
        const collection = await dbService.getCollection('Bugs')
        const criteria = ObjectId.isValid(bugId)
            ? { _id: new ObjectId(bugId) }
            : { _id: bugId }

        if (!isAdmin) criteria['creator._id'] = userId

        const res = await collection.deleteOne(criteria)
        if (res.deletedCount === 0) throw new Error('Not authorized or bug not found')
        return bugId
    } catch (err) {
        loggerService.error(`cannot remove bug ${bugId}`, err)
        throw err
    }
}

async function add(bug) {
    try {
        const collection = await dbService.getCollection('Bugs')
        const bugToAdd = {
            title: bug.title,
            severity: bug.severity,
            labels: bug.labels,
            description: bug.description,
            createdAt: Date.now(),
            creator: bug.creator,
        }
        const res = await collection.insertOne(bugToAdd)
        return { ...bugToAdd, _id: res.insertedId }
    } catch (err) {
        loggerService.error('cannot insert bug', err)
        throw err
    }
}

async function update(bug) {
    try {
        const collection = await dbService.getCollection('Bugs')
        const criteria = ObjectId.isValid(bug._id)
            ? { _id: new ObjectId(bug._id) }
            : { _id: bug._id }

        const bugToSave = {
            title: bug.title,
            severity: bug.severity,
            labels: bug.labels,
            description: bug.description,
        }

        await collection.updateOne(criteria, { $set: bugToSave })
        return bug
    } catch (err) {
        loggerService.error(`cannot update bug ${bug._id}`, err)
        throw err
    }
}

function _buildCriteria(filterBy) {
    const criteria = {}
    if (filterBy.title) criteria.title = { $regex: filterBy.title, $options: 'i' }
    if (filterBy.minSeverity) criteria.severity = { $gte: +filterBy.minSeverity }
    if (filterBy.creatorId) criteria['creator._id'] = filterBy.creatorId
    if (filterBy.labels?.length) criteria.labels = { $all: filterBy.labels }
    return criteria
}

function _buildSort(filterBy) {
    if (!filterBy.sortField) return {}
    const dir = filterBy.sortDir === 'desc' ? -1 : 1
    return { [filterBy.sortField]: dir }
}
