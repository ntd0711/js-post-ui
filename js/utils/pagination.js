export function renderPagination({ elementId, pagination }) {
    const ulPagination = document.getElementById(elementId)
    if (!pagination || !ulPagination) return

    const { _page, _limit, _totalRows } = pagination
    const totalPages = Math.ceil(_totalRows / _limit)

    ulPagination.dataset.page = _page
    ulPagination.dataset.totalPages = totalPages

    if (_page <= 1) ulPagination.firstElementChild?.classList.add('disabled')
    else ulPagination.firstElementChild?.classList.remove('disabled')

    if (_page >= totalPages)
        ulPagination.lastElementChild?.classList.add('disabled')
    else ulPagination.lastElementChild?.classList.remove('disabled')
}

export function registerPagination({ elementId, defaultParams, onChange }) {
    const ulPagination = document.getElementById(elementId)
    if (!ulPagination) return

    const prevPagination = ulPagination.firstElementChild?.firstElementChild
    if (prevPagination) {
        prevPagination.addEventListener('click', (e) => {
            e.preventDefault()
            console.log('prev click')

            const page = Number.parseInt(ulPagination.dataset.page) || 1
            if (page <= 1) return

            onChange?.(page - 1)
        })
    }

    const nextPagination = ulPagination.lastElementChild?.lastElementChild
    if (nextPagination) {
        nextPagination.addEventListener('click', (e) => {
            e.preventDefault()
            console.log('next click')

            const page = Number.parseInt(ulPagination.dataset.page) || 1
            const totalPages =
                Number.parseInt(ulPagination.dataset.totalPages) || 1
            if (page >= totalPages) return

            onChange?.(page + 1)
        })
    }
}
