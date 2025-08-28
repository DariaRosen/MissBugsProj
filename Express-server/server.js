import http from 'http'
import path from 'path'
import cors from 'cors'
import express from 'express'
import cookieParser from 'cookie-parser'
import session from 'express-session'

import { loggerService } from './services/logger.service.js'
import { bugRoutes } from './api/bug/bug.routes.js'
import { userRoutes } from './api/user/user.routes.js'
import { authRoutes } from './api/auth/auth.routes.js'
import { msgRoutes } from './api/msg/msg.routes.js'

import { setupAsyncLocalStorage } from './middlewares/setupAls.middleware.js'

const app = express()
const server = http.createServer(app)

// Express App Config
app.use(cookieParser()) 
app.use(express.json())

console.log("process.env.NODE_ENV:", process.env.NODE_ENV);


if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve('public')))
} else {
    const corsOptions = {
        origin: [
            'http://127.0.0.1:8080',
            'http://localhost:3000',
            'http://127.0.0.1:5173',
            'http://localhost:5173'
        ],
        credentials: true
    }
    app.use(cors(corsOptions))
}

app.all('/*all', setupAsyncLocalStorage)

app.use(session({
    secret: 'your-secret',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // set true if using HTTPS
}))

//*Routes
app.use('/api/bug/', bugRoutes)
app.use('/api/user/', userRoutes)
app.use('/api/auth/', authRoutes)
app.use('/api/msg', msgRoutes)

// Make every unhandled server-side-route match index.html
// so when requesting http://localhost:3030/unhandled-route... 
// it will still serve the index.html file
// and allow vue/react-router to take it from there


import { requireAuth } from './middlewares/requireAuth.middleware.js'
app.get('/api/test-session', requireAuth, (req, res) => {
    res.send('ok, session is working')
})

app.get('/cookie', (req, res) => {
    let visitCount = req.cookies.myCookie || 0
    visitCount++

    res.cookie('myCookie', visitCount)
    res.send(`Cookie value: ${visitCount}`)
})

//* For SPA (Single Page Application) support - catch-all routes and sent to index.html
app.get('/*all', (req, res) => {
    res.sendFile(path.resolve('public/index.html'), (err) => {
        if (err) {
            loggerService.error('Error sending index.html:', err)
            res.status(500).send({ error: 'Failed to load application' })
        }
    })
})
const port = process.env.PORT || 3030
// const port = process.env.PORT || 5000

// app.listen(PORT, () => loggerService.info(`Server is running on http://localhost:${PORT}`))

server.listen(port, () => {
    loggerService.info('Server is running on: ' + `http://localhost:${port}/`)
})