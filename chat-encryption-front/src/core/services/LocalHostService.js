export const getDestUsername = function() {
  return localStorage.getItem("dest-username");
};

export const getDestCertif = function() {
  return localStorage.getItem("dest-certificate");
};

export const setDestUsername = function(username) {
  localStorage.setItem("dest-username", username);
};

export const setDestCertif = function(certificate) {
  localStorage.setItem("dest-certificate", certificate);
};

export const getConnectedUsername = function() {
  return localStorage.getItem("username");
};

export const getConnectedCertif = function() {
  return localStorage.getItem("certificate");
};

export const getConnectedPub = function() {
  return localStorage.getItem("pubKey");
};

export const getConnectedPriv = function() {
  return localStorage.getItem("priKey");
};
