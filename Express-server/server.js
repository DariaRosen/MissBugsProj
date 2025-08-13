import express from 'express'
import { makeId } from './services/util.service.js'
import { bugService } from './services/bug.service.js'
import { loggerService } from './services/logger.service.js'
import cors from 'cors'

const app = express()
app.use(express.static('public'))

const corsOptions = {
    origin: [
        'http://localhost:5173',
        'http://127.0.0.1:5173',
        'http://localhost:5174',
        'http://127.0.0.1:5174',
    ],
    credentials: true,
}
app.use(cors(corsOptions))

app.get('/', (req, res) => {
    res.send('Hello, World!!!')
})

app.get('/api/bug', async (req, res) => {
    const { title, minSeverity } = req.query
    const filterBy = {
        title: title || '',
        minSeverity: minSeverity ? +minSeverity : 0
    }
    try {
        const bugs = await bugService.query(filterBy)
        res.send(bugs)
    }
    catch (err) {
        loggerService.error('Error fetching bugs:', err)
        res.status(500).send({ error: 'Failed to fetch bugs' })
    }
})

app.get('/api/bug/:id/remove', async (req, res) => {
    const bugId = req.params.id
    try {
        await bugService.remove(bugId)
        res.send({ message: 'Bug removed successfully' })
    } catch (err) {
        loggerService.error('Error removing bug:', err)
        res.status(500).send({ error: 'Failed to remove bug' })
    }
})

app.get('/api/bug/save', async (req, res) => {
    try {
        let { _id, title, severity, createdAt, description } = req.query

        const bugToSave = {
            title,
            severity: +severity,
            description: description || '',
            createdAt: createdAt ? +createdAt : Date.now()
        }

        if (_id && _id.trim() !== '') {
            // Editing existing bug
            bugToSave._id = _id
        } else {
            // Creating new bug
            bugToSave._id = makeId()
        }

        console.log('Saving bug:', bugToSave)

        const savedBug = await bugService.save(bugToSave)
        res.send({ savedBug })
    } catch (err) {
        console.error('Error saving bug:', err)
        res.status(500).send({ err: 'Failed to save bug' })
    }
})


app.get('/api/bug/:id', async (req, res) => {
    const bugId = req.params.id

    try {
        const bug = await bugService.getById(bugId)
        res.send(bug)
    } catch (error) {
        loggerService.error('Error fetching bug:', error)
        res.status(400).send({ error: 'Failed to fetch bug' })
    }
})

const PORT = 3030
app.listen(PORT, () => loggerService.info(`Server is running on http://localhost:${PORT}`))
