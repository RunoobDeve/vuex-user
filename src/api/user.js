import axios from '@/utils/serve'
const getUser = (params) => axios.get('/user/listpage', {
    params
})

const delUser = (id) => axios.get('/user/remove', {
    params: {
        id,
    }
})

const delUsers = (ids) => axios.get('/user/batchremove', {
    params: {
        ids
    }
})

export { getUser, delUser, delUsers }