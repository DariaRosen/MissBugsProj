import { useState, useEffect } from 'react'
import { userService } from '../services/user'
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js'

export function UserIndex() {
    const [users, setUsers] = useState([])
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [newUser, setNewUser] = useState(getEmptyUser())

    useEffect(() => {
        loadUsers()
    }, [])

    function getEmptyUser() {
        return { fullname: '', username: '', password: '', score: 0, isAdmin: false }
    }

    async function loadUsers() {
        try {
            const usersFromService = await userService.query()
            setUsers(usersFromService)
        } catch (err) {
            console.error('Failed loading users', err)
            showErrorMsg('Cannot load users')
        }
    }

    function toggleModal() {
        setIsModalOpen(prev => !prev)
    }

    function handleChange({ target }) {
        const { name, value } = target
        setNewUser(prev => ({ ...prev, [name]: value }))
    }

    async function onRemoveUser(userId) {
        try {
            await userService.remove(userId)
            setUsers(prev => prev.filter(u => u._id !== userId))
            showSuccessMsg('User removed')
        } catch (err) {
            console.error('Cannot remove user', err)
            showErrorMsg('Cannot remove user')
        }
    }

    function onEditUser(user) {
        setNewUser(user)
        toggleModal()
    }

    function onAddUser() {
        setNewUser(getEmptyUser())
        toggleModal()
    }

    async function saveUser(ev) {
        ev.preventDefault()
        try {
            const savedUser = await userService.save(newUser)
            setUsers(prev => {
                const idx = prev.findIndex(u => u._id === savedUser._id)
                if (idx > -1) {
                    const copy = [...prev]
                    copy[idx] = savedUser
                    return copy
                }
                return [...prev, savedUser]
            })
            showSuccessMsg('User saved successfully!')
            setNewUser(getEmptyUser())
            toggleModal()
        } catch (err) {
            console.error('Cannot save user', err)
            showErrorMsg('Cannot save user')
        }
    }

    return (
        <section className="user-index">
            <h1>Users</h1>
            <button onClick={onAddUser}>Add User</button>

            {/* MODAL */}
            {isModalOpen && (
                <div className="modal-backdrop">
                    <div className="modal">
                        <h3>{newUser._id ? 'Edit User' : 'Add New User'}</h3>
                        <form onSubmit={saveUser}>
                            <input
                                type="text"
                                name="fullname"
                                value={newUser.fullname}
                                placeholder="Full name"
                                onChange={handleChange}
                                required
                            />
                            <input
                                type="text"
                                name="username"
                                value={newUser.username}
                                placeholder="Username"
                                onChange={handleChange}
                                required
                            />
                            <input
                                type="password"
                                name="password"
                                value={newUser.password}
                                placeholder="Password"
                                onChange={handleChange}
                                required={!newUser._id} // password required only for new user
                            />
                            <input
                                type="number"
                                name="score"
                                value={newUser.score}
                                placeholder="Score"
                                onChange={handleChange}
                                required
                            />
                            <label>
                                <input
                                    type="checkbox"
                                    name="isAdmin"
                                    checked={newUser.isAdmin}
                                    onChange={() => setNewUser(prev => ({ ...prev, isAdmin: !prev.isAdmin }))}
                                />
                                Is Admin
                            </label>

                            <div className="modal-actions">
                                <button type="submit">Save</button>
                                <button type="button" onClick={toggleModal}>
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* USER LIST */}
            <ul>
                {users.map(user =>
                    <li key={user._id}>
                        {user.fullname} ({user.username})
                        <button onClick={() => onEditUser(user)}>Edit</button>
                        <button onClick={() => onRemoveUser(user._id)}>Remove</button>
                    </li>
                )}
            </ul>
        </section>
    )
}
