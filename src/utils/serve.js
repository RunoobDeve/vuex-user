import Axios from "axios";

const _axios = Axios.create(
    {
        baseURL: 'http://172.16.16.47:3000',
        timeout:5000
    }
)

export default _axios