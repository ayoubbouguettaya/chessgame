import axios from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC__HOST;

const defaultHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
}

const axiosInstance = ({ method, url, data, headers }) => {
    try {
        const request =  axios({
            method,
            url: `${BASE_URL}/api${url}`,
            headers: {
                ...headers,
                ...defaultHeaders
            },
            data,
            validateStatus: function (status) {
                return status < 400; // Resolve only if the status code is less than 400
              },
            timeout:10000,
            withCredentials: true,
        });
        return request;
            
    } catch (error) {
        console.log(error.message)
        return error;
    }

};

const fetchApi = {
    get: (arg) => axiosInstance({ method: 'get', ...arg }),
    post: (arg) => axiosInstance({ method: 'post', ...arg }),
    put: (arg) => axiosInstance({ method: 'put', ...arg }),
    delete: (arg) => axiosInstance({ method: 'delete', ...arg }),
    patch: (arg) => axiosInstance({ method: 'patch', ...arg }),
}
export default fetchApi;