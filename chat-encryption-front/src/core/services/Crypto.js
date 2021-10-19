import JSEncrypt from "jsencrypt";
export const encrypt = function(publicKey, message){
    const crypt = new JSEncrypt();
    crypt.setPublicKey(publicKey);
    return crypt.encrypt(message);
}

export const decrypt = function(privateKey, message){
    const crypt = new JSEncrypt();
    crypt.setPublicKey(privateKey);
    return crypt.decrypt(message);
}