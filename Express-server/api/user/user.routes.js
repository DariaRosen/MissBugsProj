import express from 'express'
import { addUser, getUser, removeUser, updateUser, getUsers} from './user.controller.js'

const router = express.Router()

router.get('/', getUsers)
router.get('/:id', getUser)
router.delete('/:id', removeUser)
router.post('/', addUser)
router.put('/:id', updateUser)

export const userRoutes = router