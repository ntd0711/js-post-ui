import * as yup from 'yup'
import { setBackgroundImage, setFieldValue, setTextContent } from './common'
import { FILE_SIZE, FILE_TYPES, IMAGE_SOURCE } from '../constants/common'

function setFormValue(postForm, formValues) {
    setFieldValue(postForm, '[name="title"]', formValues?.title)
    setFieldValue(postForm, '[name="author"]', formValues?.author)
    setFieldValue(postForm, '[name="description"]', formValues?.description)
    setFieldValue(postForm, '[name="imageUrl"]', formValues?.imageUrl) //hidden field

    setBackgroundImage(document, '#postHeroImage', formValues?.imageUrl)
}

function getFormValues(form) {
    const formValues = {}
    const data = new FormData(form)

    for (const [key, value] of data) {
        formValues[key] = value
    }

    return formValues
}

function getSchema() {
    return yup.object().shape({
        title: yup
            .string()
            .required('please enter title')
            .test(
                'should has at least two words',
                'title must has least two words',
                (value) =>
                    value.split(' ').filter((x) => x.length >= 2).length >= 2
            ),
        author: yup
            .string()
            .required('please enter author')
            .test(
                'should has at least two words',
                'author must has least two words',
                (value) =>
                    value.split(' ').filter((x) => x.length >= 2).length >= 2
            ),
        description: yup.string(),
        imageSource: yup
            .mixed()
            .required('Please select an image source')
            .oneOf(
                [IMAGE_SOURCE.PICSUM, IMAGE_SOURCE.UPLOAD],
                'invalid source'
            ),
        imageUrl: yup.mixed().when('imageSource', {
            is: IMAGE_SOURCE.PICSUM,
            then: yup
                .string()
                .required('please random image')
                .url('image must be url type'),
        }),
        image: yup.mixed().when('imageSource', {
            is: IMAGE_SOURCE.UPLOAD,
            then: yup
                .mixed()
                .test(
                    'check require',
                    'Upload image form your computer',
                    (file) => file?.name
                )
                .test('check file type', 'Unsupported format', (file) =>
                    FILE_TYPES.includes(file?.type)
                )
                .test(
                    'check file size',
                    'File too large',
                    (file) => file?.size <= FILE_SIZE
                ),
        }),
    })
}

async function schemaValidate(form, formValues) {
    try {
        clearErrorForm(form)

        const schema = getSchema()
        await schema.validate(formValues, { abortEarly: false })
    } catch (error) {
        if (!Array.isArray(error.inner)) return

        const errorStatus = {}
        for (const ValidationError of error?.inner) {
            const name = ValidationError.path
            const message = ValidationError.message
            console.log({ name, message })

            if (errorStatus[name]) continue
            setFieldError(form, name, message)
            errorStatus[name] = true
        }
    }
}

function clearErrorForm(form) {
    ;['title', 'author', 'imageUrl', 'image'].forEach((name) =>
        setFieldError(form, name, '')
    )
}

function setFieldError(form, name, error) {
    const element = form.querySelector(`[name=${name}]`)
    if (element) {
        element.setCustomValidity(error)
        setTextContent(element.parentElement, '.invalid-feedback', error)
    }
}

async function validatePostForm(form, formValues) {
    await schemaValidate(form, formValues)

    const isValid = form.checkValidity()
    if (!isValid) form.classList.add('was-validated')
    return isValid
}

function initRandomImage(form) {
    const randomImg = form.querySelector('#postChangeImage')
    if (!randomImg) return

    randomImg.addEventListener('click', () => {
        // random any number from 1 to 1000
        const index = Math.ceil(Math.random() * 1000)
        const imageUrl = `https://picsum.photos/id/${index}/1368/1000`

        setFieldValue(postForm, '[name="imageUrl"]', imageUrl)
        setBackgroundImage(document, '#postHeroImage', imageUrl)
    })
}

function initImageUpload(form) {
    const uploadImageElement = form.querySelector('[name="image"]')
    if (!uploadImageElement) return

    uploadImageElement.addEventListener('change', (e) => {
        const file = e.target.files[0]
        const imageUrl = URL.createObjectURL(file)
        setBackgroundImage(document, '#postHeroImage', imageUrl)

        validateField('image', form, {
            imageSource: IMAGE_SOURCE.UPLOAD,
            image: file,
        })
    })
}

async function validateField(name, form, formValues) {
    if (!form.classList.contains('was-validated')) return

    try {
        setFieldError(form, name, '')

        const schema = getSchema()
        await schema.validateAt(name, formValues)
    } catch (error) {
        setFieldError(form, name, error.message)
    }

    const field = form.querySelector(`[name=${name}]`)
    if (field && !field.checkValidity()) {
        field.parentElement.classList.add('was-validated')
    }
}

function initSwitchOptions(form) {
    const radioList = form.querySelectorAll('[name="imageSource"]')
    radioList.forEach((radio) => {
        radio.addEventListener('change', (e) =>
            renderOptions(form, e.target.value)
        )
    })
}

function initValidationOnchange(form) {
    form.addEventListener('input', (e) => {
        const { target } = e
        const name = target.name

        if (!['title', 'author'].includes(name)) return
        validateField(name, form, { [name]: target.value })
    })
}

function renderOptions(form, radioValue) {
    const optionList = form.querySelectorAll('[data-id="imageSource"]')
    optionList.forEach((option) => {
        option.hidden = option.dataset.imageSource !== radioValue
    })
}

export function registerForm({ formId, defaultValues, onSubmit }) {
    let initialValues = {
        author: defaultValues?.author || '',
        title: defaultValues?.title || '',
        description: defaultValues?.description || '',
        imageUrl: defaultValues?.imageUrl || '',
    }

    const postForm = document.getElementById(formId)
    if (!postForm) return

    setFormValue(postForm, initialValues)

    // event
    initSwitchOptions(postForm)
    initRandomImage(postForm)
    initImageUpload(postForm)
    initValidationOnchange(postForm)

    let submitting = false

    postForm.addEventListener('submit', async (e) => {
        e.preventDefault()
        if (submitting) return

        showLoading(postForm)
        submitting = true

        const formValues = getFormValues(postForm)

        const isValid = await validatePostForm(postForm, formValues)
        if (isValid) await onSubmit?.(formValues)

        hiddenLoading(postForm)
        submitting = false
    })
}

function showLoading(form) {
    const submitBtn = form.querySelector('[name="submit"]')
    if (submitBtn) {
        submitBtn.disabled = true
        submitBtn.textContent = 'Saving...'
    }
}

function hiddenLoading(form) {
    const submitBtn = form.querySelector('[name="submit"]')
    if (submitBtn) {
        submitBtn.disabled = false
        submitBtn.innerHTML = '<i class="fas fa-save mr-1"></i> Save'
    }
}
