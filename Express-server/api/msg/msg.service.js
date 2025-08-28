import { ObjectId } from 'mongodb'
import { asyncLocalStorage } from '../../services/als.service.js'
import { loggerService } from '../../services/logger.service.js'
import { dbService } from '../../services/db.service.js'

export const msgService = { query, remove, add }

async function query(filterBy = {}) {
    try {
        const criteria = _buildCriteria(filterBy)
        const collection = await dbService.getCollection('Messages')

        var msgs = await collection.aggregate([
            {
                $match: criteria,
            },
            {
                $lookup: {
                    localField: 'byUserId',
                    from: 'user',
                    foreignField: '_id',
                    as: 'byUser',
                },
            },
            {
                $unwind: '$byUser',
            },
            {
                $lookup: {
                    localField: 'aboutBugId',
                    from: 'bug',
                    foreignField: '_id',
                    as: 'aboutBug',
                },
            },
            {
                $unwind: '$aboutBug',
            },
            {
                $project: {
                    'txt': true,
                    'byUser._id': true,
                    'byUser.fullname': true,
                    'aboutBug._id': true,
                    'aboutBug.title': true,
                }
            }
        ]).toArray()

        return msgs
    } catch (err) {
        loggerService.error('cannot get msgs', err)
        throw err
    }
}

async function remove(msgId) {
    try {
        const { loggedinUser } = asyncLocalStorage.getStore()
        const collection = await dbService.getCollection('Messages')

        const criteria = { _id: ObjectId.createFromHexString(msgId) }

        // only owner or admin can remove
        if (!loggedinUser.isAdmin) {
            criteria.byUserId = ObjectId.createFromHexString(loggedinUser._id)
        }

        const { deletedCount } = await collection.deleteOne(criteria)
        return deletedCount
    } catch (err) {
        loggerService.error(`cannot remove msg ${msgId}`, err)
        throw err
    }
}

async function add(msg) {
    try {
        const msgToAdd = {
            byUserId: ObjectId.createFromHexString(msg.byUserId),
            aboutBugId: ObjectId.createFromHexString(msg.aboutBugId),
            txt: msg.txt,
        }
        const collection = await dbService.getCollection('Messages')
        await collection.insertOne(msgToAdd)

        return msgToAdd
    } catch (err) {
        loggerService.error('cannot add msg', err)
        throw err
    }
}

function _buildCriteria(filterBy) {
    const criteria = {}

    if (filterBy.byUserId) {
        criteria.byUserId = ObjectId.createFromHexString(filterBy.byUserId)
    }
    if (filterBy.aboutBugId) {
        criteria.aboutBugId = ObjectId.createFromHexString(filterBy.aboutBugId)
    }

    return criteria
}
