import express from 'express'

import { requireAuth } from '../../middlewares/requireAuth.middleware.js'
import { log } from '../../middlewares/logger.middleware.js'

import { addMsg, getMsg, deleteMsg } from './review.controller.js'

const router = express.Router()

router.get('/', log, getMsg)
router.post('/', log, requireAuth, addMsg)
router.delete('/:id', requireAuth, deleteMsg)

export const msgRoutes = router