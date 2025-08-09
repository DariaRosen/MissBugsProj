import express from 'express'
import { makeId } from './services/util.service.js'

const app = express()

const bugs = [
    {
        "_id": "abc123",
        "title": "Cannot save a Car",
        "severity": 3,
        "createdAt": 1542107359454
    },
    {
        "_id": "vawNC3",
        "title": "bbb",
        "severity": 6
    },
    {
        "_id": "JNJiEa",
        "title": "ccc",
        "severity": 7
    }
]
app.get('/', (req, res) => {
    res.send('Hello, World!!!')
})

app.get('/puki', (req, res) => {
    res.send('Puki is here!')
})

app.get('/api/bug', (req, res) => {
    res.send(bugs)
})

app.get('/api/bug/:id/remove', (req, res) => {
    const bugId = req.params.id
    const bugIndex = bugs.findIndex(bug => bug._id === bugId)
    bugs.splice(bugIndex, 1)
    res.send({ message: 'Bug removed successfully' })
})

app.get('/api/bug/save', (req, res) => {
    const { _id, title, severity } = req.query
    const newBug = { _id, title, severity: +severity }
    console.log('Saving bug:', newBug)
    if (newBug._id) {
        const idx = bugs.findIndex(bug => bug._id === newBug._id)
        bugs.splice(idx, 1, newBug)
    }
    else {
        newBug._id = makeId()
        bugs.push(newBug)
    }
    res.send({ newBug })
})

app.get('/api/bug/:id', (req, res) => {
    const bugId = req.params.id
    const bug = bugs.find(bug => bug._id === bugId)
    res.send(bug)
})

const PORT = 3030
app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`))
