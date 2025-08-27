import { dbService } from '../../services/db.service.js'
import { loggerService } from '../../services/logger.service.js'
import { msgService } from '../msg/msg.service.js'
import { ObjectId } from 'mongodb'

export const userService = {
    add,         // Create (Signup)
    getById,     // Read (Profile page)
    update,      // Update (Edit profile)
    remove,      // Delete (remove user)
    query,       // List (of users)
    getByUsername, // Used for Login
}

async function query(filterBy = {}) {
    const criteria = _buildCriteria(filterBy)
    try {
        const collection = await dbService.getCollection('user')
        let users = await collection.find(criteria).toArray()

        users = users.map(user => {
            delete user.password
            user.createdAt = user._id.getTimestamp()
            return user
        })

        return users
    } catch (err) {
        loggerService.error('cannot find users', err)
        throw err
    }
}

async function getById(userId) {
    try {
        let criteria = { _id: ObjectId.createFromHexString(userId) }

        const collection = await dbService.getCollection('user')
        const user = await collection.findOne(criteria)
        if (!user) throw `User with id ${userId} not found`

        delete user.password

        // attach given messages
        criteria = { byUserId: userId }
        user.givenMessages = await msgService.query(criteria)
        user.givenMessages = user.givenMessages.map(message => {
            delete message.byUser
            return message
        })

        return user
    } catch (err) {
        loggerService.error(`while finding user by id: ${userId}`, err)
        throw err
    }
}

async function getByUsername(username) {
    try {
        const collection = await dbService.getCollection('user')
        const user = await collection.findOne({ username })
        return user
    } catch (err) {
        loggerService.error(`while finding user by username: ${username}`, err)
        throw err
    }
}

async function remove(userId) {
    try {
        const criteria = { _id: ObjectId.createFromHexString(userId) }
        const collection = await dbService.getCollection('user')
        await collection.deleteOne(criteria)
        return userId
    } catch (err) {
        loggerService.error(`cannot remove user ${userId}`, err)
        throw err
    }
}

async function update(user) {
    try {
        const userToSave = {
            _id: ObjectId.createFromHexString(user._id), // ensure ObjectId
            fullname: user.fullname,
            score: user.score,
        }
        const collection = await dbService.getCollection('user')
        await collection.updateOne({ _id: userToSave._id }, { $set: userToSave })
        return userToSave
    } catch (err) {
        loggerService.error(`cannot update user ${user._id}`, err)
        throw err
    }
}

async function add(user) {
    try {
        const userToAdd = {
            username: user.username,
            password: user.password, // TODO: hash before saving
            fullname: user.fullname,
            imgUrl: user.imgUrl,
            isAdmin: user.isAdmin || false,
            score: 100,
        }
        const collection = await dbService.getCollection('user')
        await collection.insertOne(userToAdd)
        return userToAdd
    } catch (err) {
        loggerService.error('cannot add user', err)
        throw err
    }
}

function _buildCriteria(filterBy) {
    const criteria = {}
    if (filterBy.txt) {
        const txtCriteria = { $regex: filterBy.txt, $options: 'i' }
        criteria.$or = [
            { username: txtCriteria },
            { fullname: txtCriteria },
        ]
    }
    if (filterBy.minBalance) {
        criteria.score = { $gte: filterBy.minBalance }
    }
    return criteria
}
