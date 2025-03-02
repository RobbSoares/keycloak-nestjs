import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { LoginUseCase } from 'src/modules/auth/usecases/login.usecase';
import { KeycloakModule } from 'src/services/keycloak/keycloak.module';
import { GetSessionUseCase } from 'src/modules/auth/usecases/get-session.usecase';

@Module({
  imports: [KeycloakModule],
  providers: [LoginUseCase, GetSessionUseCase],
  controllers: [AuthController],
})
export class AuthModule {}
