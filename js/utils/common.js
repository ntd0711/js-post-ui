export const setTextContent = (parent, selector, text) => {
    const element = parent.querySelector(selector)
    if (element) element.textContent = text
}

export const truncatedText = (text, maxLength) => {
    const needTruncated = text.length >= maxLength

    return needTruncated ? `${text.slice(0, maxLength - 1)}…` : text
}

export const setFieldValue = (form, selector, value) => {
    const field = form.querySelector(selector)
    if (field) field.value = value
}

export const setBackgroundImage = (parent, selector, imageUrl) => {
    const element = parent.querySelector(selector)
    if (element) element.style.backgroundImage = `url(${imageUrl})`

    element.addEventListener('error', () => {
        element.style.backgroundImage =
            'url("https://via.placeholder.com/1368x400?text=thumbnail")'
    })
}
