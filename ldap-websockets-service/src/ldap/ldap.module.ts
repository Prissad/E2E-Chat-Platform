import { HttpModule, Module } from '@nestjs/common';
import { AuthController } from './auth/controllers/auth.controller';
import { LdapService } from './auth/services/ldap.service';

@Module({
  imports: [HttpModule],
  controllers: [AuthController],
  providers: [LdapService],
})
export class LdapModule {}
