function showModal(modalElement) {
    if (!window.bootstrap) return
    const myModal = new bootstrap.Modal(modalElement)

    if (myModal) myModal.show()
}
export function registerLightBox({
    modalId,
    imgSelector,
    prevSelector,
    nextSelector,
}) {
    const modalElement = document.getElementById(modalId)
    if (!modalElement) return

    // check if this modal is registered or not
    if (modalElement.dataset.register) return

    const imgElement = modalElement.querySelector(imgSelector)
    const prevBtn = modalElement.querySelector(prevSelector)
    const nextBtn = modalElement.querySelector(nextSelector)
    if (!imgElement || !prevBtn || !nextBtn) return

    let imgList = []
    let index = 0

    function bindSrcToImg(index) {
        imgElement.src = imgList[index].src
    }

    document.addEventListener('click', (e) => {
        const { target } = e
        if (target.tagName !== 'IMG' || target.dataset.album !== 'post-detail')
            return

        imgList = document.querySelectorAll(
            `img[data-album=${target.dataset.album}]`
        )
        index = Array.from(imgList).findIndex((x) => x === target) || 0

        bindSrcToImg(index)
        showModal(modalElement)
    })

    prevBtn.addEventListener('click', () => {
        index = (index - 1 + imgList.length) % imgList.length
        bindSrcToImg(index, imgList)
    })
    nextBtn.addEventListener('click', () => {
        index = (index + 1) % imgList.length
        bindSrcToImg(index, imgList)
    })

    // mark this modal is already registered
    modalElement.dataset.register = 'true'
}
