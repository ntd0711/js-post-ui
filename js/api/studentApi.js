import axiosClient from './axiosClient'

const studentApi = {
    getAll(params) {
        return axiosClient.get('/students', { params })
    },

    getById(id) {
        return axiosClient.get(`/students/${id}`)
    },

    add(data) {
        return axiosClient.post('/students', data)
    },

    remove(id) {
        return axiosClient.delete(`/students/${id}`)
    },

    update(formData) {
        const { id, data } = formData
        return axiosClient.patch(`/students/${id}`, data)
    },
}

export default studentApi
