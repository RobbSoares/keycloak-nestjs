import { Injectable } from '@nestjs/common';
import { KeycloakService } from 'src/services/keycloak/keycloak.service';
import { AuthenticationResponse } from 'src/services/keycloak/types/AuthenticationResponse.type';

@Injectable()
export class LoginUseCase {
  constructor(private readonly keycloakService: KeycloakService) {}

  async execute(
    username: string,
    password: string,
  ): Promise<AuthenticationResponse> {
    return await this.keycloakService.login({ username, password });
  }
}
