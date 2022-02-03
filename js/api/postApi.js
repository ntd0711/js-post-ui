import axiosClient from './axiosClient'

const postApi = {
    getAll(params) {
        return axiosClient.get('/posts', { params })
    },

    getById(id) {
        return axiosClient.get(`/posts/${id}`)
    },

    add(data) {
        return axiosClient.post('/posts', data)
    },

    remove(id) {
        return axiosClient.delete(`/posts/${id}`)
    },

    update(formData) {
        const { id, data } = formData
        return axiosClient.patch(`/posts/${id}`, data)
    },

    addWithFormData(data) {
        return axiosClient.post(`/with-thumbnail/posts`, data, {
            headers: { 'Content-Type': 'multipart/form-data' },
        })
    },

    updateWithFormData(formData) {
        const { id, data } = formData
        return axiosClient.patch(`/with-thumbnail/posts/${id}`, data, {
            headers: { 'Content-Type': 'multipart/form-data' },
        })
    },
}

export default postApi
