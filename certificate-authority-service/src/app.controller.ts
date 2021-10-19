import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/ca-key')
  getHello() {
    return this.appService.getPemCa();
  }

  @Post('sign')
  sign(@Body() body) {
    return this.appService.sign(body.toSign);
  }

  @Post('verify')
  ign(@Body() body) {
    return this.appService.verifyIssued(body.toVerify);
  }
}
