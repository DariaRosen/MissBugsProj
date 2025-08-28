import { httpService } from '../http.service'

const STORAGE_KEY_LOGGEDIN_USER = 'loggedinUser'

export const userService = {
    login,
    logout,
    signup,
    getUsers,
    getById,
    remove,
    update,
    save,
    getEmptyUser,
    getLoggedinUser,
}

function getUsers() {
    console.log('Getting users');
    return httpService.get('user')
}

function getById(userId) {
    return httpService.get(`user/${userId}`)
}

function remove(userId) {
    return httpService.delete(`user/${userId}`)
}

async function update(userToUpdate) {
    const updatedUser = await httpService.put(`user/${userToUpdate._id}`, userToUpdate)
    if (getLoggedinUser()?._id === updatedUser._id) _saveLocalUser(updatedUser)
    return updatedUser
}

async function save(user) {
    if (user._id) {
        const updatedUser = await httpService.put(`user/${user._id}`, user)
        if (getLoggedinUser()?._id === updatedUser._id) _saveLocalUser(updatedUser)
        return updatedUser
    } else {
        return httpService.post('user', user)
    }
}

async function login(credentials) {
    const user = await httpService.post('auth/login', credentials)
    if (user) return _saveLocalUser(user)
}

async function signup(credentials) {
    if (!credentials.imgUrl) {
        credentials.imgUrl = 'https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_1280.png'
    }
    credentials.score = 10000
    const user = await httpService.post('auth/signup', credentials)
    return _saveLocalUser(user)
}

async function logout() {
    sessionStorage.removeItem(STORAGE_KEY_LOGGEDIN_USER)
    return httpService.post('auth/logout')
}

function getEmptyUser() {
    return {
        username: '',
        fullname: '',
        password: '',
        score: 0,
        isAdmin: false,
        imgUrl: ''
    }
}

function getLoggedinUser() {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY_LOGGEDIN_USER))
}

function _saveLocalUser(user) {
    user = {
        _id: user._id,
        fullname: user.fullname,
        imgUrl: user.imgUrl,
        score: user.score,
        isAdmin: user.isAdmin
    }
    sessionStorage.setItem(STORAGE_KEY_LOGGEDIN_USER, JSON.stringify(user))
    return user
}
