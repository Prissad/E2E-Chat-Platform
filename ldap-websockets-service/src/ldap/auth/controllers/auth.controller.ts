import { Body, Controller, Get, Post } from '@nestjs/common';

import { LdapService } from '../services/ldap.service';
import { SignupUserDto } from '../dto/signupuser.dto';
import { LoginUserDto } from '../dto/loginUser.dto';
@Controller('auth')
export class AuthController {
  constructor(private readonly ldapService: LdapService) {}

  @Post('signUp')
  async signUp(@Body() signup: SignupUserDto) {

    const saved = await this.ldapService.addUser(
      signup.pseudo,
      signup.password,
      signup.fullname,
      signup.email,
      signup.carteEtudiant,
      signup.certificate,
    );
    return saved;
  }

  @Get('users')
  async getUsersCertficates(): Promise<any> {
    return await this.ldapService.getUsers();
  }
  //TODO : implement sign message testing
  @Post('login')
  async login(@Body() login: LoginUserDto): Promise<any> {
    const auth = await this.ldapService.authenticate(
      login.pseudo,
      login.password,
    );
    if (auth.authenticated == false) return auth;
    if (
      await this.ldapService.verifyKey(
        login.pseudo,
        login.message,
        login.signature,
      )
    )
      return auth;
    else return { authenticated: false, message: 'STRANGER DANGER !!!!' };
  }
}
