import { postApi } from './api'
import { registerForm } from './utils/form-ezfronend'
import { toast } from './utils'
import { IMAGE_SOURCE } from './constants/common'
// import { registerForm } from './utils'

function getPostId() {
    const searchParams = new URLSearchParams(window.location.search)
    return searchParams.get('id')
}

function removeUnusedFields(formValues) {
    const payload = { ...formValues }

    payload.imageSource === IMAGE_SOURCE.PICSUM
        ? delete payload.image
        : delete payload.imageUrl

    delete payload.imageSource

    return payload
}

function jsonToFormData(jsonData) {
    const formData = new FormData()

    for (const key in jsonData) {
        formData.set(key, jsonData[key])
    }

    return formData
}

async function handleSubmit(formValues) {
    try {
        const payload = removeUnusedFields(formValues)
        const formData = jsonToFormData(payload)

        const id = getPostId()
        const savePost = id
            ? await postApi.updateWithFormData({ id, data: formData })
            : await postApi.addWithFormData(formData)

        // show toast message
        toast.success('Save Post Successfully !!')

        setTimeout(() => {
            window.location.assign(`post-detail.html?id=${savePost.id}`)
        }, 2000)
    } catch (error) {
        console.log('failed to fetch', error)
        toast.error(error.message)
    }
}

;(async () => {
    try {
        const id = getPostId()
        const defaultValues = id ? await postApi.getById(id) : {}

        registerForm({
            formId: 'postForm',
            defaultValues,
            onSubmit: handleSubmit,
        })
    } catch (error) {
        console.log('failed to fetch: ', error)
    }
})()
