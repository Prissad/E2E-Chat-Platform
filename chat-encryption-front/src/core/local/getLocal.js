import VueLocalStorage from 'vue-localstorage'

import Vue from "vue";

Vue.use(VueLocalStorage);

const getLocalStorageData = function ()
{
    let username = Vue.localStorage.get('username');
    let privateKey = Vue.localStorage.get('privateKey');

    let result = {
        'username': username,
        'privateKey': privateKey,
    }

    return result;
}

export {
    getLocalStorageData,
};