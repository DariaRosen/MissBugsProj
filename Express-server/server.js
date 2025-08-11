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

app.get('/puki', (req, res) => {
    res.send('Puki is here!')
})

app.get('/api/bug', async (req, res) => {
    const bugs = await bugService.query()
    res.send(bugs)
})

app.get('/api/bug/:id/remove', async (req, res) => {
    const bugId = req.params.id
    await bugService.remove(bugId)
    res.send({ message: 'Bug removed successfully' })
})

app.get('/api/bug/save', async (req, res) => {
    const { _id, title, severity, createdAt } = req.query
    const newBug = { _id, title, severity: +severity, createdAt: +createdAt }
    console.log('Saving bug:', newBug)
    const savedBug = await bugService.save(newBug)
    res.send({ savedBug })
})

app.get('/api/bug/:id', async (req, res) => {
    const bugId = req.params.id

    try{
        const bug = await bugService.getById(bugId)
        res.send(bug)
    } catch (error) {
        loggerService.error('Error fetching bug:', error)
        res.status(400).send({ error: 'Failed to fetch bug' })
    }
})

const PORT = 3030
app.listen(PORT, () => loggerService.info(`Server is running on http://localhost:${PORT}`))
