import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { promises as fs } from 'fs';
import * as path from 'path';
import * as forge from 'node-forge';

@Injectable()
export class CertificateManager {
  async getPemCa() {
    return this.readPEM('CA.pem');
  }

  async getCACertificate() {
    return forge.pki.certificateFromPem(await this.getPemCa());
  }

  async readPEM(keyName: string) {
    let body = '';
    const data = await fs.readFile(
      path.join(__dirname, `../keys/${keyName}`),
      'utf-8',
    );
    for (const chunk of data) {
      body += chunk.toString();
    }
    return body;
  }

  getCertificateFromPem(pem: string) {
    return forge.pki.certificateFromPem(pem);
  }

  getPrivateKeyFromPem(pem: string) {
    return forge.pki.privateKeyFromPem(pem);
  }

  getPemFromCertificate(certif) {
    return forge.pki.certificateToPem(certif);
  }

  getCertificateRequestFromPem(pem: string) {
    return forge.pki.certificationRequestFromPem(pem);
  }

  async createCertifFromReq(issuedRequest) {
    const pki = forge.pki;
    // generate a key pair
    const pubKey = issuedRequest.publicKey;

    //verify the issued is signed with his private key
    if (!issuedRequest.verify()) {
      throw new BadRequestException('NOT SIGNED');
    }

    // create cerif
    let cert = pki.createCertificate();

    cert.publicKey = pubKey;

    cert.serialNumber = '01';
    cert.validity.notBefore = new Date();
    cert.validity.notAfter = new Date();
    cert.validity.notAfter.setFullYear(
      cert.validity.notBefore.getFullYear() + 1,
    );

    // alternatively set subject from a csr
    cert.setSubject(issuedRequest.subject.attributes);

    const certificateForge = await this.getCACertificate();

    cert.setIssuer(certificateForge.subject.attributes);

    var extensions = issuedRequest.getAttribute({
      name: 'extensionRequest',
    }).extensions;

    cert.setExtensions([
      {
        name: 'basicConstraints',
        cA: true,
      },
      {
        name: 'keyUsage',
        keyCertSign: true,
        digitalSignature: true,
        nonRepudiation: true,
        keyEncipherment: true,
        dataEncipherment: true,
      },
      {
        name: 'subjectAltName',
        altNames: [
          {
            type: 6, // URI
            value: 'http://example.org/webid#me',
          },
        ],
      },
    ]);

    // sign the certif with ca certificate
    const privateKeyForge = this.getPrivateKeyFromPem(
      await this.readPEM('key.pem'),
    );
    cert.sign(privateKeyForge);

    // convert a Forge certificate to PEM
    var pem = pki.certificateToPem(cert);
    return cert;
  }
}
