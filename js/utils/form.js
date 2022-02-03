import * as yup from 'yup'
import { TYPE_IMG_VALID } from '../constants/common'

export function registerForm(props) {
    const { formId, valueFetched, onSubmit } = props

    let formValues = {
        author: valueFetched?.author || '',
        title: valueFetched?.title || '',
        description: valueFetched?.description || '',
        imageUrl: valueFetched?.imageUrl || '',
    }

    const schema = yup.object().shape({
        title: yup
            .string()
            .required('please enter title')
            .test(
                'should has at least four words',
                'title must greater than two characters',
                (value) =>
                    value.split(' ').filter((x) => x.length >= 2).length >= 2
            ),
        author: yup
            .string()
            .required('please enter author')
            .test(
                'should has at least four words',
                'author must greater than two characters',
                (value) =>
                    value.split(' ').filter((x) => x.length >= 2).length >= 2
            ),
        description: yup
            .string()
            .required('please enter description')
            .test(
                'should has at least four words',
                'description must greater than two characters',
                (value) =>
                    value.split(' ').filter((x) => x.length >= 2).length >= 2
            ),
        imageUrl: yup
            .mixed()
            .test(
                'check valid type',
                'must be type is "image/jpeg or "image/png"',
                (value) => value && TYPE_IMG_VALID.includes(value.type)
            ),
    })

    const postForm = document.getElementById(formId)
    if (!postForm) return

    const checkList = postForm.querySelectorAll('[name="image-upload"]')
    const uploadRandomElement = document.getElementById('randomUpload')
    const uploadManuallyElement = document.getElementById('manuallyUpload')
    if (!checkList || !uploadManuallyElement || !uploadRandomElement) return

    const titleField = postForm.querySelector('[name="title"]')
    const authorField = postForm.querySelector('[name="author"]')
    const descriptionField = postForm.querySelector('[name="description"]')
    if (!titleField || !authorField || !descriptionField) return

    const bannerImg = document.getElementById('postHeroImage')
    if (bannerImg)
        bannerImg.style.backgroundImage = `url(${formValues.imageUrl})`

    // set default value to field
    titleField.value = formValues.title
    authorField.value = formValues.author
    descriptionField.value = formValues.description

    // switch way upload image when click check radio
    checkList.forEach((radio) => {
        radio.addEventListener('change', handleCheckRadio)
    })

    function handleCheckRadio(e) {
        const { target } = e
        if (!target.checked) return

        if (target === checkList[0]) {
            uploadRandomElement.classList.add('active')
            uploadManuallyElement.classList.remove('active')
        }
        if (target === checkList[1]) {
            uploadRandomElement.classList.remove('active')
            uploadManuallyElement.classList.add('active')
        }
    }

    // handle change image url
    const inputImg = document.getElementById('inputFile')
    if (!inputImg) return
    inputImg.addEventListener('change', (e) => {
        if (!TYPE_IMG_VALID.includes(e.target.files[0].type)) return
        const srcImg = URL.createObjectURL(e.target.files[0])
        bannerImg.style.backgroundImage = `url(${srcImg})`
    })

    // handle change input
    titleField.addEventListener('input', (event) =>
        handleInputChange(event, 'title')
    )
    authorField.addEventListener('input', (event) =>
        handleInputChange(event, 'author')
    )
    descriptionField.addEventListener('input', (event) =>
        handleInputChange(event, 'description')
    )
    inputImg.addEventListener('change', (event) =>
        handleInputChange(event, 'imageUrl')
    )

    async function handleInputChange(event, fieldChange) {
        const value =
            fieldChange === 'imageUrl'
                ? event.target.files[0]
                : event.target.value

        formValues = {
            ...formValues,
            [fieldChange]: value,
        }
        if (postForm.classList.contains('was-validate')) {
            const errors = await validateYup()
            showHelperText(errors)
            if (!errors) {
                const inputFields = postForm.querySelectorAll('.form-control')
                inputFields.forEach((input) => {
                    input.classList.remove('error')
                    input.nextElementSibling.remove('error')
                })
            }
        }
    }

    // submit form
    const submitBtn = postForm.querySelector('button[type="submit"]')
    submitBtn.addEventListener('click', async (e) => {
        e.preventDefault()
        const errors = await validateYup()
        console.log(formValues)
        console.log(errors)
        if (!errors) {
            onSubmit?.(formValues)
        }
        postForm.classList.add('was-validate')
        showHelperText(errors)
    })

    async function validateYup() {
        try {
            await schema.validate(formValues, { abortEarly: false })
        } catch (error) {
            const errorInner = error.inner
            const errorList = {
                title: [],
                author: [],
                description: [],
                imageUrl: [],
            }
            for (const error of errorInner) {
                errorList[error.path].push(error.message)
            }
            return errorList
        }
    }

    function showHelperText(errors) {
        if (!errors) return
        for (const errorName in errors) {
            const inputField = postForm.querySelector(`[name="${errorName}"]`)
            const helpTextElement = inputField.nextElementSibling

            if (errors[errorName].length === 0) {
                inputField.classList?.remove('error')
                helpTextElement.classList?.remove('error')
                helpTextElement.textContent = ''
            } else {
                inputField.classList.add('error')
                helpTextElement.classList.add('error')
                helpTextElement.textContent = errors[errorName][0]
            }
        }
    }
}
