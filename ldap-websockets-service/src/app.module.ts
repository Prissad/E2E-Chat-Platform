import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LdapModule } from './ldap/ldap.module';
import { WebsocketsModule } from './websockets/websockets.module';

@Module({
  imports: [LdapModule, WebsocketsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
