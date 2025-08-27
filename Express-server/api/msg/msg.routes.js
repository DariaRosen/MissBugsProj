import express from 'express'

import { requireAuth } from '../../middlewares/requireAuth.middleware.js'
import { logRequest } from '../../middlewares/log.middleware.js'

import { addMsg, getMsg, deleteMsg } from './msg.controller.js'

const router = express.Router()

router.get('/', logRequest, getMsg)
router.post('/', logRequest, requireAuth, addMsg)
router.delete('/:id', requireAuth, deleteMsg)

export const msgRoutes = router