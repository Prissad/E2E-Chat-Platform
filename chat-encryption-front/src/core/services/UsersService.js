import axios from "axios";

const url = "http://192.168.57.4:3000/auth/users";

const getUsersList = function () {
    return axios.get(url);
}

export {
    getUsersList,
};