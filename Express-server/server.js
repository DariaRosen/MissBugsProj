import express from 'express'
const app = express()

app.get('/', (req, res) => {
    res.send('Hello, World!')
})

app.get('/puki', (req, res) => {
    res.send('Puki is here!')
})

app.get('/nono', (req, res) => { res.redirect('/') })

const PORT = 3030
app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`))
