import Axios from 'axios'

var axios = Axios.create({
    withCredentials: true,
})

const BASE_URL = '//localhost:3030/api/user'

export const userService = {
    query,
    getById,
    save,
    remove,
    getEmptyUser,
}

// List all users (with optional filters)
async function query(filterBy = {}) {
    try {
        const { data: users } = await axios.get(BASE_URL, { params: filterBy })
        return users
    } catch (err) {
        console.log('err:', err)
        throw err
    }
}

// Get one user by ID
async function getById(userId) {
    try {
        const { data: user } = await axios.get(`${BASE_URL}/${userId}`)
        return user
    } catch (err) {
        console.log('err:', err)
        throw err
    }
}

// Remove a user
async function remove(userId) {
    try {
        const { data } = await axios.delete(`${BASE_URL}/${userId}`)
        return data
    } catch (err) {
        console.log('err:', err)
        throw err
    }
}

// Save user (create or update)
async function save(userToSave) {
    try {
        if (userToSave._id) {
            // Update
            const { data } = await axios.put(`${BASE_URL}/${userToSave._id}`, userToSave)
            return data.savedUser
        } else {
            // Create
            const { data } = await axios.post(BASE_URL, userToSave)
            return data.savedUser
        }
    } catch (err) {
        console.log('err:', err)
        throw err
    }
}

// Provide empty user template
function getEmptyUser(username = '', fullname = '', score = 0) {
    return { username, fullname, score }
}
