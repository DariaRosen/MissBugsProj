import { loggerService } from '../../services/logger.service.js'
// import { socketService } from '../../services/socket.service.js'
import { userService } from '../user/user.service.js'
import { authService } from '../auth/auth.service.js'
import { msgService } from './msg.service.js'

export async function getMsg(req, res) {
    try {
        const msg = await msgService.query(req.query)
        res.send(msg)
    } catch (err) {
        loggerService.error('Cannot get msg', err)
        res.status(400).send({ err: 'Failed to get msg' })
    }
}

export async function deleteMsg(req, res) {
    var { loggedinUser } = req
    const { id: msgId } = req.params

    try {
        const deletedCount = await msgService.remove(msgId)
        if (deletedCount === 1) {
            // socketService.broadcast({ type: 'msg-removed', data: msgId, userId: loggedinUser._id })
            res.send({ msg: 'Deleted successfully' })
        } else {
            res.status(400).send({ err: 'Cannot remove msg' })
        }
    } catch (err) {
        loggerService.error('Failed to delete msg', err)
        res.status(400).send({ err: 'Failed to delete msg' })
    }
}

export async function addMsg(req, res) {
    var { loggedinUser } = req

    try {
        var msg = req.body
        const { aboutBugId } = msg
        msg.byUserId = loggedinUser._id
        msg = await msgService.add(msg)

        // reward for activity
        loggedinUser.score += 5
        await userService.update(loggedinUser)

        // refresh login cookie with updated score
        const loginToken = authService.getLoginToken(loggedinUser)
        res.cookie('loginToken', loginToken)

        // hydrate msg with users
        msg.byUser = loggedinUser
        msg.aboutBug = { _id: aboutBugId } // we can fetch bug if needed

        delete msg.byUserId
        delete msg.aboutBugId

        // socketService.broadcast({ type: 'msg-added', data: msg, userId: loggedinUser._id })

        const fullUser = await userService.getById(loggedinUser._id)
        // socketService.emitTo({ type: 'user-updated', data: fullUser, label: fullUser._id })

        res.send(msg)
    } catch (err) {
        loggerService.error('Failed to add msg', err)
        res.status(400).send({ err: 'Failed to add msg' })
    }
}
