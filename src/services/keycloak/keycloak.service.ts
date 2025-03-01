import { Injectable } from '@nestjs/common';
import axios, { AxiosResponse } from 'axios';
import { AuthenticationResponse } from 'src/services/keycloak/types/AuthenticationResponse.type';
import 'dotenv/config';

@Injectable()
export class KeycloakService {
  async loginAdmin(): Promise<string> {
    try {
      const response: AxiosResponse<AuthenticationResponse> = await axios.post(
        `${process.env.KEYCLOAK_SERVER_URL}/realms/${process.env.KEYCLOAK_REALM}/protocol/openid-connect/token`,
        {
          grant_type: 'password',
          client_id: process.env.KEYCLOAK_CLIENT_ID,
          client_secret: process.env.KEYCLOAK_CLIENT_SECRET,
          username: process.env.KEYCLOAK_USERNAME,
          password: process.env.KEYCLOAK_PASSWORD,
        },
      );

      return response.data.access_token;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async login({
    username,
    password,
  }: {
    username: string;
    password: string;
  }): Promise<AuthenticationResponse> {
    try {
      const response: AxiosResponse<AuthenticationResponse> = await axios.post(
        `${process.env.KEYCLOAK_SERVER_URL}/realms/${process.env.KEYCLOAK_REALM}/protocol/openid-connect/token`,
        {
          grant_type: 'password',
          client_id: process.env.KEYCLOAK_CLIENT_ID,
          client_secret: process.env.KEYCLOAK_CLIENT_SECRET,
          username: username,
          password: password,
        },
        {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        },
      );

      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
