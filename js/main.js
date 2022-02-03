import { postApi } from './api'

async function getPosts() {
    // const response = await postApi.update({
    //     id: 'PxcLj2O',
    //     data: { author: 'adf11111111' },
    // })
    const response = await postApi.getAll({ _page: 1, _limit: 2 })
    console.log(response)

    console.log('hello world')
}

getPosts()
