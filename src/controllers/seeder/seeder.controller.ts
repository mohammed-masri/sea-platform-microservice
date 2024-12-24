import { Controller, Post } from '@nestjs/common';

import { SeederService } from 'src/models/seeder/seeder.service';

@Controller('seeders')
export class SeederController {
  constructor(private readonly seederService: SeederService) {}

  @Post('/account-types')
  async seedAccountTypes() {
    return await this.seederService.seedAccountTypes();
  }
}
