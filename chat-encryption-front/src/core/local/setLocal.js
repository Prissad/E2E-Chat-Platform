var forge = require('node-forge');
import VueLocalStorage from 'vue-localstorage';

import Vue from "vue";

Vue.use(VueLocalStorage);

const createLocalStorageData = function ()
{
    const username = "my_username";
    const privateKey = forge.pki.rsa.generateKeyPair(1024).privateKey;

    Vue.localStorage.set('username', username);
    Vue.localStorage.set('privateKey', privateKey);
}

export {
    createLocalStorageData,
};