import { useEffect, useState } from 'react'
import { userService } from '../services/user.service.js'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service.js'

export function UserIndex() {
    const [users, setUsers] = useState([])

    useEffect(() => {
        loadUsers()
    }, [])

    function loadUsers() {
        userService.query()
            .then(setUsers)
            .catch(err => {
                console.error('Failed loading users', err)
                showErrorMsg('Cannot load users')
            })
    }

    function onRemoveUser(userId) {
        userService.remove(userId)
            .then(() => {
                setUsers(users => users.filter(u => u._id !== userId))
                showSuccessMsg('User removed')
            })
            .catch(err => {
                console.error('Cannot remove user', err)
                showErrorMsg('Cannot remove user')
            })
    }

    function onAddUser() {
        const fullname = prompt('Full name?')
        const username = prompt('Username?')
        const password = prompt('Password?')
        const newUser = { fullname, username, password }
        userService.save(newUser)
            .then(savedUser => {
                setUsers(prev => [...prev, savedUser])
                showSuccessMsg('User added')
            })
            .catch(err => {
                console.error('Cannot add user', err)
                showErrorMsg('Cannot add user')
            })
    }

    function onEditUser(user) {
        const fullname = prompt('Full name?', user.fullname)
        const updatedUser = { ...user, fullname }
        userService.save(updatedUser)
            .then(savedUser => {
                setUsers(prev => prev.map(u => u._id === savedUser._id ? savedUser : u))
                showSuccessMsg('User updated')
            })
            .catch(err => {
                console.error('Cannot update user', err)
                showErrorMsg('Cannot update user')
            })
    }

    return (
        <section className="user-index">
            <h1>Users</h1>
            <button onClick={onAddUser}>Add User</button>
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
