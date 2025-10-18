import { useState, useEffect } from 'react'
import { userService } from '../services/user'

export function LoginSignup({ onSignup, onLogin }) {
    const [users, setUsers] = useState([])
    const [credentials, setCredentials] = useState(userService.getEmptyUser())
    const [isSignup, setIsSignup] = useState(false)

    useEffect(() => {
        loadUsers()
    }, [])

    async function loadUsers() {
        try {
            const users = await userService.getUsers()
            setUsers(users)
        } catch (err) {
            console.log('Had issues loading users', err)
        }
    }

    function clearState() {
        setCredentials(userService.getEmptyUser())
    }

    function handleChange(ev) {
        const field = ev.target.name
        const value = ev.target.value
        setCredentials({ ...credentials, [field]: value })
    }

    async function onSubmitForm(ev = null) {
        if (ev) ev.preventDefault()
        if (isSignup) {
            if (!credentials.username || !credentials.password || !credentials.fullname) return
            await onSignup(credentials)
        } else {
            if (!credentials.username) return
            await onLogin(credentials)
        }
        clearState()
    }

    function toggleSignup() {
        setIsSignup(!isSignup)
    }

    if (!users.length) return <div>Loading...</div>

    return (
        <div className="login-page">
            <div className="login-signup-inline">
                {!isSignup && (
                    <>
                        <select
                            name="username"
                            value={credentials.username}
                            onChange={handleChange}
                        >
                            <option value="">Select User</option>
                            {users.map(user => (
                                <option key={user._id} value={user.username}>
                                    {user.fullname}
                                </option>
                            ))}
                        </select>
                        <button onClick={onSubmitForm}>Login</button>
                        <button className="btn-link" onClick={toggleSignup}>Signup</button>
                    </>
                )}

                {isSignup && (
                    <>
                        <input
                            type="text"
                            name="fullname"
                            value={credentials.fullname}
                            placeholder="Fullname"
                            onChange={handleChange}
                            required
                        />
                        <input
                            type="text"
                            name="username"
                            value={credentials.username}
                            placeholder="Username"
                            onChange={handleChange}
                            required
                        />
                        <input
                            type="password"
                            name="password"
                            value={credentials.password}
                            placeholder="Password"
                            onChange={handleChange}
                            required
                        />
                        <button onClick={onSubmitForm}>Signup</button>
                        <button className="btn-link" onClick={toggleSignup}>Login</button>
                    </>
                )}
            </div>
        </div>
    )
}
