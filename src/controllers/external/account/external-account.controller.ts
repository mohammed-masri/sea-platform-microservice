import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { AccountService } from 'src/models/account/account.service';

import { AccountResponse } from 'src/models/account/account.dto';
import { CheckCallMe } from 'src/guards/check-call-me.guard';

@Controller('external/accounts')
@ApiTags('External', 'Account')
@UseGuards(CheckCallMe)
export class ExternalAccountController {
  constructor(private readonly accountService: AccountService) {}

  @Get('/:id')
  @ApiOperation({ summary: 'get account details' })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'ID',
  })
  @ApiOkResponse({
    description: 'Account fetched successfully',
    type: AccountResponse,
  })
  @ApiNotFoundResponse({ description: 'Account not found' })
  async fetchAccountDetails(@Param('id') id: string) {
    const account = await this.accountService.checkIsFound({ where: { id } });
    const AccountResponse =
      await this.accountService.makeAccountResponse(account);
    return AccountResponse;
  }
}
