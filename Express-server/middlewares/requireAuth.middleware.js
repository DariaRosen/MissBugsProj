import { authService } from "../api/auth/auth.service.js"

export function requireAuth(req, res, next) {
    const loggedinUser = authService.validateToken(req.cookies.loginToken)
    if (!loggedinUser) return res.status(401).send('Login first')
    console.log("req.session", req.session);

     // Store user in session (once, after login)
    if (!req.session.user) {
        req.session.user = loggedinUser
    }

    // Attach to req for controllers
    req.loggedinUser = req.session.user
    next()
}
