import { Body, Controller, Get, Post, Request } from '@nestjs/common';
import { Public } from 'nest-keycloak-connect';
import { LoginDto } from 'src/modules/auth/dtos/login.dto';
import { GetSessionUseCase } from 'src/modules/auth/usecases/get-session.usecase';
import { LoginUseCase } from 'src/modules/auth/usecases/login.usecase';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly getSessionUseCase: GetSessionUseCase,
  ) {}

  @Post('login')
  @Public()
  async login(@Body() loginDto: LoginDto) {
    return await this.loginUseCase.execute(
      loginDto.username,
      loginDto.password,
    );
  }

  @Get('session')
  async getSession(@Request() req) {
    const token = req.headers['authorization']?.replace('Bearer ', '');
    const user = await this.getSessionUseCase.execute(token);

    if (!user) {
      return { error: 'User not found!' };
    }

    return { user };
  }
}
