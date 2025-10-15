import { MongoClient } from 'mongodb'

import { config } from '../config/index.js'
import { loggerService } from './logger.service.js'
// console.log('config:', config)

export const dbService = { getCollection }

var dbConn = null

async function getCollection(collectionName) {
    try {
        const db = await _connect()
        const collection = await db.collection(collectionName)
        console.log('✅ Connected to DB:', config.dbName)
        return collection
    } catch (err) {
        console.error('Cannot connect to DB', err)
        loggerService.error('Failed to get Mongo collection', err)
        throw err
    }
}

async function _connect() {
    if (dbConn) return dbConn

    try {
        const client = await MongoClient.connect(config.dbURL)
        return dbConn = client.db(config.dbName)
    } catch (err) {
        loggerService.error('Cannot Connect to DB', err)
        throw err
    }
}