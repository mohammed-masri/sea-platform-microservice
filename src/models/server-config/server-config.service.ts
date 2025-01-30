import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CONSTANTS } from 'sea-platform-helpers';

@Injectable()
export class ServerConfigService {
  constructor(private readonly configService: ConfigService) {}

  get<T>(key: string) {
    return this.configService.get<T>(key);
  }

  getServerEnvironment() {
    return this.get<CONSTANTS.Server.Environments | undefined>('NODE_ENV');
  }
}
