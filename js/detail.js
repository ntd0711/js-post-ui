import { postApi } from './api'
import { setTextContent } from './utils/common'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { registerLightBox } from './utils'

// to use fromNow() function
dayjs.extend(relativeTime)

function renderPost(post) {
    if (!post) return
    const { title, description, updatedAt, imageUrl, author, id } = post

    const wrapperPost = document.querySelector('.post-detail-main')
    if (!wrapperPost) return

    setTextContent(wrapperPost, '#postDetailTitle', title)
    setTextContent(wrapperPost, '#postDetailAuthor', author)
    setTextContent(wrapperPost, '#postDetailDescription', description)
    setTextContent(
        wrapperPost,
        '#postDetailTimeSpan',
        ` - ${dayjs(updatedAt).fromNow()}`
    )

    const bannerPost = document.getElementById('postHeroImage')
    if (bannerPost) {
        bannerPost.style.backgroundImage = `url(${imageUrl})`

        bannerPost.addEventListener('error', () => {
            bannerPost.style.backgroundImage =
                "url('https://via.placeholder.com/1368x400?text=thumbnail')"
        })
    }

    const editPostLink = document.getElementById('goToEditPageLink')
    if (!editPostLink) return

    editPostLink.textContent = 'Edit Post'
    editPostLink.addEventListener('click', () => {
        window.location.assign(`add-edit-post-ezfrontend.html?id=${id}`)
    })
}

function getPostId() {
    const url = new URL(window.location)
    return url.searchParams.get('id')
}

;(async () => {
    const id = getPostId()
    if (!id) console.log('post not found')
    const post = await postApi.getById(id)

    renderPost(post)
    registerLightBox({
        modalId: 'lightbox',
        imgSelector: '[data-id="lightboxImg"]',
        prevSelector: '[data-id="lightboxPrev"]',
        nextSelector: '[data-id="lightboxNext"]',
    })
})()
