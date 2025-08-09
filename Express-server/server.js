import express from 'express'
import { makeId } from './services/util.service.js'
import { bugService } from './services/bug.service.js'

const app = express()

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
    const { _id, title, severity } = req.query
    const newBug = { _id, title, severity: +severity }
    console.log('Saving bug:', newBug)
    const savedBug = await bugService.save(newBug)
    res.send({ savedBug })
})

app.get('/api/bug/:id', async (req, res) => {
    const bugId = req.params.id
    const bug = await bugService.getById(bugId)
    res.send(bug)
})

const PORT = 3030
app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`))
