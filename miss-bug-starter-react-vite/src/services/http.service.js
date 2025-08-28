import Axios from "axios"

const BASE_URL = process.env.NODE_ENV === 'production'
    ? '/api/'
    : 'http://localhost:3030/api/'

    console.log('BASE_URL:', BASE_URL);

const axios = Axios.create({ withCredentials: true })

export const httpService = {
    get(endpoint, data) {
        return ajax(endpoint, 'GET', data)
    },
    post(endpoint, data) {
        return ajax(endpoint, 'POST', data)
    },
    put(endpoint, data) {
        return ajax(endpoint, 'PUT', data)
    },
    delete(endpoint, data) {
        return ajax(endpoint, 'DELETE', data)
    },
}

async function ajax(endpoint, method = 'GET', data = null) {
    const url = `${BASE_URL}${endpoint}`
    const params = (method === 'GET') ? data : null
    const options = { url, method, data, params }
console.log('options',options);

    try {
        const res = await axios(options)
        return res.data
    } catch (err) {
        console.error(`Had Issue ${method} ing to the backend , endpoint: ${endpoint}, data: ${JSON.stringify(data)}`, data)
        console.dir(err)
        if (err.response && err.response.status === 401) {
            sessionStorage.clear()
        }
        throw err
    }
}