import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { LoginUseCase } from 'src/modules/auth/usecases/login.usecase';
import { KeycloakModule } from 'src/services/keycloak/keycloak.module';

@Module({
  imports: [KeycloakModule],
  providers: [LoginUseCase],
  controllers: [AuthController],
})
export class AuthModule {}
