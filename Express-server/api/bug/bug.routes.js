import express from 'express'
import { addBug, getBug, removeBug, updateBug, getBugs} from './bug.controller.js'

const router = express.Router()

router.get('/', getBugs)
router.get('/:id', getBug)
router.delete('/:id', removeBug)
router.post('/', addBug)
router.put('/:id', updateBug)

export const bugRoutes = router