import { userService } from './user.service.js'
import { loggerService } from '../../services/logger.service.js'
import { makeId } from '../../services/util.service.js'

export async function getUsers(req, res) {
    const { title, minSeverity, labels, pageIdx } = req.query
    const filterBy = {
        title: title || '',
        minSeverity: minSeverity ? +minSeverity : 0,
        labels: labels ? (Array.isArray(labels) ? labels : [labels]) : []
    }

    if (pageIdx) filterBy.pageIdx = +pageIdx
    try {
        const users = await userService.query(filterBy)
        res.send(users)
    }
    catch (err) {
        loggerService.error('Cannot get users:', err)
        res.status(500).send({ error: 'Failed to get users' })
    }
}

export async function getUser(req, res) {
    const userId = req.params.id

    // Read visitedUsers cookie or default to empty array
    let visitedUsers = []
    try {
        if (req.cookies.visitedUsers) {
            visitedUsers = JSON.parse(req.cookies.visitedUsers)
        }
    } catch (err) {
        console.error('Failed to parse visitedUsers cookie', err)
    }

    // If user not already visited, add it
    if (!visitedUsers.includes(userId)) {
        visitedUsers.push(userId)
    }

    // Log for debugging
    console.log('User visited the following users:', visitedUsers)

    // Save updated visitedUsers cookie with 7-second lifetime
    res.cookie('visitedUsers', JSON.stringify(visitedUsers), { maxAge: 7000, httpOnly: true })

    // Check if the user exceeded the limit
    if (visitedUsers.length > 3) {
        return res.status(401).send('Wait for a bit')
    }

    // Fetch and return user
    try {
        const user = await userService.getById(userId)
        res.send(user)
    } catch (error) {
        loggerService.error('Error fetching user:', error)
        res.status(400).send({ error: 'Failed to fetch user' })
    }
}

export async function addUser(req, res) {
    try {
        let { fullname, username, password, score, isAdmin } = req.body

        const userToSave = {
            fullname,
            username,
            password,
            score,
            isAdmin
        }

        const savedUser = await userService.save(userToSave)
        res.send( savedUser )
    } catch (err) {
        console.error('Error saving user:', err)
        res.status(500).send({ err: 'Failed to save user' })
    }
}

export async function updateUser(req, res) {
    try {
        const existingUser = await userService.getById(req.params.id)
        const { fullname, username, password, score, isAdmin } = req.body

        const userToSave = {
            ...existingUser,
            username,
            fullname,
            password,
            score,
            isAdmin
        }

        const savedUser = await userService.save(userToSave)
        res.send( savedUser )
    } catch (err) {
        console.error('Failed to update user:', err)
        res.status(500).send({ err: 'Failed to update user' })
    }
}

export async function removeUser(req, res) {
    const userId = req.params.id
    try {
        await userService.remove(userId)
        res.send({ message: 'User removed successfully' })
    } catch (err) {
        loggerService.error('Error removing user:', err)
        res.status(500).send({ error: 'Failed to remove user' })
    }
}