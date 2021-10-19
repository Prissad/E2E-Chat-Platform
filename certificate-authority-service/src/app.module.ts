import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CertificateManager } from './certificate.manager';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, CertificateManager],
})
export class AppModule {}
