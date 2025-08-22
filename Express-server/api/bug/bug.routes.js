import express from 'express'
import { addBug, getBug, removeBug, updateBug, getBugs } from './bug.controller.js'
import { requireAuth } from '../../middlewares/requireAuth.middleware.js'

const router = express.Router()

router.get('/', getBugs)
router.get('/:id', getBug)
router.delete('/:id', requireAuth, removeBug)
router.post('/', requireAuth, addBug)
router.put('/:id', requireAuth, updateBug)

export const bugRoutes = router
