import express from 'express'
import { addBug, getBug, removeBug, updateBug, getBugs} from './bug.controller.js'

const router = express.Router()

router.get('/api/bug', getBugs)
router.get('/api/bug/:id', getBug)
router.delete('/api/bug/:id', removeBug)
router.post('/api/bug', addBug)
router.put('/api/bug/:id', updateBug)

export const bugRoutes = router