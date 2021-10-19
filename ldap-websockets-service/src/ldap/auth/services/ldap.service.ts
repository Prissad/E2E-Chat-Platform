import { Injectable } from '@nestjs/common';
import { Client } from 'ldapts';

//To encrypt the users' passwords
import * as forge from 'node-forge';
import { HttpService } from '@nestjs/common';

@Injectable()
export class LdapService {
  constructor(private httpService: HttpService) {
    this.client = new Client({
      url: 'ldap://127.0.0.1:10389',
    });
  }
  // Client API of the ldapts library generate the connection to the ldap server
  client: Client;

  /**
   * Returns the certificate of the Certificate Authority (CA)
   *
   * @remarks
   * the CA's server is located in port 3001.
   * if CA's server is not connected then return false.
   *
   * @returns The certificate of the Certificate Authority | False.
   *
   */
  async getCaCertificate(): Promise<any> {
    try {
      const certPem = (
        await this.httpService.get('http://192.168.57.4:3001/ca-key').toPromise()
      ).data;
      const cert = forge.pki.certificateFromPem(certPem);
      return cert;
    } catch (err) {
      console.error(err);
      return false;
    }
  }

  private isCertificateValid(caCert, cert) {
    const verified = caCert.verify(cert);
    return verified;
  }
  //TODO : document this method (addUser)
  async addUser(
    pseudo,
    password,
    name,
    mail,
    carteEtudiant,
    certificate,
  ): Promise<string> {
    const entry = {
      sn: name,
      mail: [mail],
      userPassword: password,
      uid: carteEtudiant,
      userCertificate: certificate,

      objectclass: 'inetOrgPerson',
    };
    const caCert = await this.getCaCertificate();
    if (!caCert) return 'Certificate Authority server unavailable';
    if (
      !this.isCertificateValid(
        caCert,
        forge.pki.certificateFromPem(certificate),
      )
    )
      return 'Certificate not valid';

    try {
      await this.client.add('cn=' + pseudo + ',ou=users,ou=system', entry);
    } catch (err) {
      console.error(err);
      return 'Erreur';
    }
    return 'Signed up as ' + pseudo;
  }
  //TODO : document this method (bindClient)
  async bindClient(
    bindDN = 'uid=admin,ou=system',
    password = 'secret',
  ): Promise<boolean> {
    try {
      await this.client.bind(bindDN, password);
    } catch (e) {
      return false;
    }
    return true;
  }

  async verifyKey(
    pseudo: string,
    message: string,
    signature: string,
  ): Promise<boolean> {
    const searchDN = 'cn=' + pseudo + ',ou=users,ou=system';
    const searchOptions = {
      scope: 'sub' as const,
      attributes: ['cn', 'userCertificate'],
      returnAttributeValues: true,
    };
    if (!(await this.bindClient())) {
      return false;
    }
    let users;
    try {
      users = await this.client.search(searchDN, searchOptions);
    } catch (e) {
      return false;
    }
    const result = users.searchEntries.map((entry) => {
      return entry.userCertificate;
    });
    const publicKey = forge.pki.certificateFromPem(result[0]).publicKey;
    signature = forge.util.decode64(signature);
    try {
      const test = await publicKey.verify(message, signature);
      return test;
    } catch (e) {
      //console.log('Encryption block is invalid (invalid signature)');
      return false;
    }
  }
  //TODO : document this method (authenticate)
  async authenticate(pseudo: string, password: string): Promise<any> {
    if (pseudo == undefined) return 'no password has been given';
    if (password == undefined) return 'no pseudo has been given';
    const userDN = 'cn=' + pseudo + ',ou=users,ou=system';
    let messageValue: string;
    if (await this.bindClient(userDN, password)) {
      messageValue = 'login as ' + pseudo;
      return { authenticated: true, message: messageValue };
    } else {
      messageValue = 'wrong user/password combination';
      return { authenticated: false, message: messageValue };
    }
  }

  //TODO : document this method (getUsers)
  async getUsers() {
    const searchDN = 'ou=users,ou=system';
    const searchOptions = {
      scope: 'sub' as const,
      attributes: ['cn', 'userCertificate'],
      returnAttributeValues: true,
    };
    if (!(await this.bindClient())) return 'server Erreur';
    const users = await this.client.search(searchDN, searchOptions);
    const results = users.searchEntries.map((entry) => {
      return { pseudo: entry.cn, certificate: entry.userCertificate };
    });
    //console.log(result);
    this.client.unbind();
    return results;
  }
}
