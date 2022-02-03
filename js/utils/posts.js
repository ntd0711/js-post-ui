import { postApi } from '../api'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { setTextContent, truncatedText } from './common'

// to use fromNow() function
dayjs.extend(relativeTime)

export async function getPosts(queryParams) {
    try {
        const { data: postList, pagination } = await postApi.getAll(queryParams)

        return { postList, pagination }
    } catch (error) {
        console.log('failed to fetch posts: ', error)
    }
}

export function renderPostList(postList) {
    if (!Array.isArray(postList)) return
    const ulElement = document.getElementById('postList')
    if (!ulElement) return
    // clear current list post
    ulElement.textContent = ''

    postList.forEach((post) => {
        const postElement = createPostElement(post)

        ulElement.appendChild(postElement)
    })
}

export function createPostElement(post) {
    if (!post) return
    const liElement = document
        .getElementById('postItemTemplate')
        .content.firstElementChild.cloneNode(true)
    if (!liElement) return

    // update content post item
    setTextContent(liElement, '[data-id="title"]', post.title)
    setTextContent(liElement, '[data-id="author"]', post.author)
    setTextContent(
        liElement,
        '[data-id="description"]',
        truncatedText(post.description, 100)
    )
    setTextContent(
        liElement,
        '[data-id="timeSpan"]',
        ` - ${dayjs(post.updatedAt).fromNow()}`
    )

    const thumbnailElement = liElement.querySelector('[data-id="thumbnail"]')
    if (thumbnailElement) {
        thumbnailElement.src = post.imageUrl

        thumbnailElement.addEventListener('error', () => {
            thumbnailElement.src =
                'https://via.placeholder.com/1368x400?text=thumbnail'
        })
    }

    // attach event
    // const titleElement = liElement.querySelector('.card-title')
    liElement.addEventListener('click', (e) => {
        const menu = liElement.querySelector('[data-id="menu"]')
        if (menu && menu.contains(e.target)) return

        window.location.assign(`post-detail.html?id=${post.id}`)
    })

    const editPostBtn = liElement.querySelector('[data-id="edit"]')
    editPostBtn.addEventListener('click', (e) => {
        window.location.assign(`add-edit-post-ezfrontend.html?id=${post.id}`)
    })

    return liElement
}
