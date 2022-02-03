import {
    getPosts,
    registerPagination,
    registerSearch,
    renderPagination,
    renderPostList,
} from './utils'

async function handleFilterChange(filterName, filterValue) {
    const url = new URL(window.location)

    if (filterName === 'title_like') {
        url.searchParams.set('_page', 1)
    }

    url.searchParams.set(filterName, filterValue)
    history.pushState({}, '', url)

    const queryParams = url.searchParams
    const { postList, pagination } = await getPosts(queryParams)
    renderPostList(postList)
    renderPagination({ elementId: 'pagination', pagination })
}

;(async () => {
    const url = new URL(window.location)

    if (!url.searchParams.get('_page')) url.searchParams.set('_page', 1)
    if (!url.searchParams.get('_limit')) url.searchParams.set('_limit', 6)
    history.pushState({}, '', url)

    const queryParams = url.searchParams

    registerPagination({
        elementId: 'pagination',
        defaultParams: queryParams,
        onChange: (page) => handleFilterChange('_page', page),
    })
    registerSearch({
        elementId: 'searchInput',
        defaultParams: queryParams,
        onChange: (searchParams) =>
            handleFilterChange('title_like', searchParams),
    })

    const { postList, pagination } = await getPosts(queryParams)
    renderPostList(postList)
    renderPagination({ elementId: 'pagination', pagination })
})()
