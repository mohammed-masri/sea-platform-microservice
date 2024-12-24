import { Sequelize, SequelizeOptions } from 'sequelize-typescript';
import { OTP } from 'src/models/otp/otp.model';
import { ServerConfigService } from 'src/models/server-config/server-config.service';
import { Account } from 'src/models/account/account.model';
import { CONSTANTS } from 'sea-backend-helpers';
import { AccountType } from 'src/models/account-type/account-type.model';

export const databaseProviders = [
  {
    provide: 'SEQUELIZE',
    useFactory: async (serverConfigService: ServerConfigService) => {
      const ConnectionConfig: SequelizeOptions = {
        host: serverConfigService.get<string>('DATABASE_HOST'),
        port: +serverConfigService.get<number>('DATABASE_PORT'),
        username: serverConfigService.get<string>('DATABASE_USERNAME'),
        password: serverConfigService.get<string>('DATABASE_PASSWORD'),
        database: serverConfigService.get<string>('DATABASE_NAME'),
        logging: serverConfigService.get<string>('DATABASE_LOGGING') === 'true',
      };

      const serverEnv = serverConfigService.getServerEnvironment();
      if (serverEnv !== CONSTANTS.Environments.Production) {
        ConnectionConfig.sync = { alter: true };
      }

      const sequelize = new Sequelize({
        dialect: 'mysql',
        ...ConnectionConfig,
      });
      sequelize.addModels([Account, AccountType, OTP]);
      await sequelize.sync();
      return sequelize;
    },
    inject: [ServerConfigService],
  },
];
