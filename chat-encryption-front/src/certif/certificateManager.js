var forge = require("node-forge");

exports.CreateCertif = function() {
  // generate a key pair
  const keys = forge.pki.rsa.generateKeyPair(1024);
  const priKey = forge.pki.privateKeyToPem(keys.privateKey);
  const pubKey = forge.pki.publicKeyToPem(keys.publicKey);
  localStorage.setItem("priKey", priKey);
  localStorage.setItem("pubKey", pubKey);

  // create a certification request (CSR)
  var csr = forge.pki.createCertificationRequest();
  csr.publicKey = keys.publicKey;
  csr.setSubject([
    {
      name: "commonName",
      value: "insat.tn",
    },
    {
      name: "countryName",
      value: "TN",
    },
    {
      shortName: "ST",
      value: "Tunis",
    },
    {
      name: "localityName",
      value: "CUN",
    },
    {
      name: "organizationName",
      value: "INSAT",
    },
    {
      shortName: "OU",
      value: "Test",
    },
  ]);
  // set (optional) attributes
  csr.setAttributes([
    {
      name: "challengePassword",
      value: "password",
    },
    {
      name: "unstructuredName",
      value: "My Company, Inc.",
    },
    {
      name: "extensionRequest",
      extensions: [
        {
          name: "subjectAltName",
          altNames: [
            {
              // 2 is DNS type
              type: 2,
              value: "test.domain.com",
            },
            {
              type: 2,
              value: "other.domain.com",
            },
            {
              type: 2,
              value: "www.domain.net",
            },
          ],
        },
      ],
    },
  ]);
  csr.sign(keys.privateKey);
  var pem = forge.pki.certificationRequestToPem(csr);
  return pem;
};

exports.sign = function() {
  const prikey = localStorage.getItem("priKey");
  const privateKey = forge.pki.privateKeyFromPem(prikey);
  var md = forge.md.sha1.create();
  md.update('sign this', 'utf8');
  let signature = privateKey.sign(md);
  const publicKey = forge.pki.certificateFromPem(localStorage.getItem("certificate")).publicKey;
  let digestedMessage = md.digest().bytes();
  const verified = publicKey.verify(digestedMessage, signature);
  console.log(signature.length);
  signature = forge.util.encode64(signature);
  console.log(verified);
  return {digestedMessage, signature};
};


exports.getPublicFromCertif = function(certificatePem){
  const pki = forge.pki;
  const cert = pki.certificateFromPem(certificatePem);

  return pki.publicKeyToPem(cert.publicKey);
}


