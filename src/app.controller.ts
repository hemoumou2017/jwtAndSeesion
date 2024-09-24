/*
 * @Author: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @Date: 2024-09-24 09:38:48
 * @LastEditors: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @LastEditTime: 2024-09-24 10:00:51
 * @FilePath: /nest学习/jwtAndSeesion/src/app.controller.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import {
  Controller,
  Get,
  Inject,
  Res,
  Session,
  Headers,
  UnauthorizedException,
} from '@nestjs/common';
import { AppService } from './app.service';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Inject(JwtService)
  private jwtService: JwtService;
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('test')
  test(@Session() session) {
    console.log('object', session);
    session.count = session.count ? session.count + 1 : 1;
    return session.count;
  }

  @Get('bbb')
  bbb(
    @Headers('authorization') authorization: string,
    @Res({ passthrough: true }) response: Response,
  ) {
    if (authorization) {
      try {
        const token = authorization.split(' ')[1];
        const data = this.jwtService.verify(token);
        console.log(data);
        const newToken = this.jwtService.sign({ a: data.a + 1 });
        response.setHeader('token', newToken);

        return data.a + 1;
      } catch (e) {
        console.log(e);
        throw new UnauthorizedException();
      }
    } else {
      const newToken = this.jwtService.sign({ a: 1 });

      response.setHeader('token', newToken);

      return 1;
    }
  }
}
