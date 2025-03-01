import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import {
  AuthGuard,
  KeycloakConnectModule,
  ResourceGuard,
  RoleGuard,
} from 'nest-keycloak-connect';
import { ConfigModule } from 'src/config/config.module';
import { KeycloakConfigService } from 'src/config/keycloak-config.service';
import { AuthModule } from 'src/modules/auth/auth.module';
import { KeycloakModule } from 'src/services/keycloak/keycloak.module';

@Module({
  imports: [
    KeycloakConnectModule.registerAsync({
      useExisting: KeycloakConfigService,
      imports: [ConfigModule],
    }),
    AppModule,
    AuthModule,
    KeycloakModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: ResourceGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RoleGuard,
    },
  ],
  controllers: [],
})
export class AppModule {}
