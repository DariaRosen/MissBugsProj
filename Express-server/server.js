import express from 'express'
import { loggerService } from './services/logger.service.js'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import path from 'path'
import { bugRoutes } from './api/bug/bug.routes.js'
import { userRoutes } from './api/user/user.routes.js'
import { authRoutes } from './api/auth/auth.routes.js'
import session from 'express-session'

const app = express()

const corsOptions = {
    origin: [
        'http://localhost:5173',
        'http://127.0.0.1:5173',
        'http://localhost:5174',
        'http://127.0.0.1:5174',
    ],
    credentials: true,
}

//*Express configuration
app.use(cors(corsOptions))
app.use(cookieParser())
app.use(express.json())
app.use(express.static('public'))
app.set('query parser', 'extended')

app.use(session({
    secret: process.env.SESSION_SECRET || 'REPLACE_IN_PRODUCTION',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // set true if using HTTPS
}))

//*Routes
app.use('/api/bug/', bugRoutes)
app.use('/api/user/', userRoutes)
app.use('/api/auth/', authRoutes)



import { requireAuth } from './middlewares/requireAuth.middleware.js'
app.get('/api/bug', requireAuth, (req, res) => {
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

const PORT = process.env.PORT || 3030
app.listen(PORT, () => loggerService.info(`Server is running on http://localhost:${PORT}`))
