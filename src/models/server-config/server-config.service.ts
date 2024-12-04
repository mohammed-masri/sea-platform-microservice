import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CONSTANTS } from 'sea-backend-helpers';

@Injectable()
export class ServerConfigService {
  constructor(private readonly configService: ConfigService) {}

  get<T>(key: string) {
    return this.configService.get<T>(key);
  }

  getServerEnvironment() {
    return this.get<CONSTANTS.Environments | undefined>('NODE_ENV');
  }
}
