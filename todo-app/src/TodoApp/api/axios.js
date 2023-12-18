import axios from 'axios'

export const api = axios.create({
    baseURL: 'http://localhost:3000'
})

export const getPostsPage = async (pageParam = 1, options = {}) => {
    const response = await api.get(`/todos?_page=${pageParam}`, options)
    return response.data
}