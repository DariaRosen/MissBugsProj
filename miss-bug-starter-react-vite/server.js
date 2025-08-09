import express from 'express'
import { bugService } from './src/services/bug.service.js'
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
    credentials: true
}

app.use(cors(corsOptions))

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.get('/api/bug', async (req, res) => {
    const bugs = await bugService.query()
    res.send(bugs)
})

app.get('/api/bug/save', async (req, res) => {
    const { _id, title, severity, createdAt } = req.query
    const bugToSave = {
        _id,
        title,
        severity: +severity,
        createdAt
    }
    const savedBug = await bugService.save(bugToSave)
    res.send(savedBug)
})

app.get('/api/bug/:bugId', async (req, res) => {
    const bugId = req.params.bugId
    const bug = await bugService.getById(bugId)
    res.send(bug)
})

app.get('/api/bug/:bugId/remove', async (req, res) => {
    const bugId = req.params.bugId
    await bugService.remove(bugId)
    res.send({ msg: 'Removed successfully' })
})

const port = 3030
app.listen(port, () => console.log(`Server listening on port http://127.0.0.1:${port}/`))