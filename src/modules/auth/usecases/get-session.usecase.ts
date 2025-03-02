import { Injectable } from '@nestjs/common';
import { KeycloakService } from 'src/services/keycloak/keycloak.service';
import { AuthenticationResponse } from 'src/services/keycloak/types/AuthenticationResponse.type';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class GetSessionUseCase {
  constructor(private readonly keycloakService: KeycloakService) {}

  async execute(token: string): Promise<AuthenticationResponse> {
    const decoded = jwt.decode(token) as any;
    return await this.keycloakService.findUserById(decoded?.sub || '');
  }
}
