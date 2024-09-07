import env from './env.js';

const API_URL = env.API_URL
const BACKEND_URL = {
    auth :{
        login: API_URL + '/auth/login',
        register: API_URL + '/auth/register',
    },
    tasks :{
        get: API_URL + '/tasks/get',
        create: API_URL + '/tasks/create',
        update: API_URL + '/tasks/update',
        delete: API_URL + '/tasks/delete',
    },
}

export default BACKEND_URL;