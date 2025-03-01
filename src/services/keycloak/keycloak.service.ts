import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import axios, { AxiosResponse } from 'axios';
import { AuthenticationResponse } from 'src/services/keycloak/types/AuthenticationResponse.type';
import 'dotenv/config';

@Injectable()
export class KeycloakService {
  private accessToken: string;
  private refreshToken: string;
  private expiresIn: number;

  async onModuleInit() {
    await this.authenticate();
  }

  async authenticate() {
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
        {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        },
      );

      this.accessToken = response.data.access_token;
      this.refreshToken = response.data.refresh_token;
      this.expiresIn = Date.now() + (response.data.expires_in - 60) * 1000;
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

  async refreshAdminToken() {
    try {
      const response: AxiosResponse<AuthenticationResponse> = await axios.post(
        `${process.env.KEYCLOAK_SERVER_URL}/realms/${process.env.KEYCLOAK_REALM}/protocol/openid-connect/token`,
        {
          grant_type: 'refresh-token',
          client_id: process.env.KEYCLOAK_CLIENT_ID,
          client_secret: process.env.KEYCLOAK_CLIENT_SECRET,
          username: process.env.KEYCLOAK_USERNAME,
          password: process.env.KEYCLOAK_PASSWORD,
        },
        {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        },
      );

      this.accessToken = response.data.access_token;
      this.refreshToken = response.data.refresh_token;
      this.expiresIn = Date.now() + (response.data.expires_in - 60) * 1000;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getToken(): Promise<string> {
    try {
      if (!this.refreshAdminToken || !this.accessToken) {
        await this.authenticate();
      }

      if (this.expiresIn < Date.now()) {
        await this.refreshAdminToken();
      }

      return this.accessToken;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  @Cron('*/4 8-20 * * 1-5')
  handleCron() {
    console.log('Called schedule to refresh token');
  }
}
