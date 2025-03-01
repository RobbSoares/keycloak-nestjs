import { Body, Controller, Post } from '@nestjs/common';
import { Public } from 'nest-keycloak-connect';
import { LoginDto } from 'src/modules/auth/dtos/login.dto';
import { LoginUseCase } from 'src/modules/auth/usecases/login.usecase';

@Controller('auth')
export class AuthController {
  constructor(private readonly loginUseCase: LoginUseCase) {}

  @Post('login')
  @Public()
  async login(@Body() loginDto: LoginDto) {
    return await this.loginUseCase.execute(
      loginDto.username,
      loginDto.password,
    );
  }
}
