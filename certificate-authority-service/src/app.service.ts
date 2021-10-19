import { Injectable } from '@nestjs/common';
import { CertificateManager } from './certificate.manager';

@Injectable()
export class AppService {
  constructor(private certifManager: CertificateManager) {}

  async getPemCa() {
    return this.certifManager.readPEM('CA.pem');
  }

  async sign(toSign: string) {

    const issuedRequest = await this.certifManager.getCertificateRequestFromPem(
      toSign,
    );

    const issuedCertif = await this.certifManager.createCertifFromReq(issuedRequest);

    const pem = this.certifManager.getPemFromCertificate(issuedCertif);

    const alou = await this.verifyIssued(pem);

    return pem;
  }

  async verifyIssued(toVerify: string) {
    const certificateForge = await this.certifManager.getCACertificate();

    const issued = this.certifManager.getCertificateFromPem(toVerify);

    const verified = certificateForge.verify(issued);
    return verified;
  }
}
