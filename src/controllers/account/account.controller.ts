import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import { AccountService } from 'src/models/account/account.service';
import {
  ChangePasswordDto,
  CreateAccountDto,
  UpdateAccountDto,
  AccountArrayDataResponse,
} from './account.dto';
import { AccountResponse } from 'src/models/account/account.dto';
import { FindAllDto } from 'src/common/global.dto';
import { JWTAuthGuard } from 'src/guards/jwt-auth.guard';
import { CheckAccountTypeGuard } from 'src/guards/check-account-type.guard';
import { Constants } from 'src/config';

@Controller('accounts')
@UseGuards(
  JWTAuthGuard,
  new CheckAccountTypeGuard(Constants.Account.AccountTypes.Admin),
)
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new account' })
  @ApiCreatedResponse({
    description: 'The account has been successfully created.',
    type: AccountResponse,
  })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  async create(@Body() data: CreateAccountDto) {
    const account = await this.accountService.create(data);
    const AccountResponse =
      await this.accountService.makeAccountResponse(account);
    return AccountResponse;
  }

  @Get()
  @ApiOperation({ summary: 'fetch accounts' })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number for pagination',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Number of items per page',
  })
  @ApiResponse({
    status: 200,
    description: 'Retrieve a paginated list of accounts',
    type: AccountArrayDataResponse,
  })
  async findAll(@Query() query: FindAllDto) {
    console.log(query);
    const { totalCount, accounts } = await this.accountService.findAll(
      {},
      query.page,
      query.limit,
    );

    const accountsResponse =
      await this.accountService.makeAccountsResponse(accounts);

    return new AccountArrayDataResponse(
      totalCount,
      accountsResponse,
      query.page,
      query.limit,
    );
  }

  @Get('/:id')
  @ApiOperation({ summary: 'get account details' })
  @ApiParam({
    name: 'id',
    type: Number,
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

  @Put('/:id')
  @ApiOperation({ summary: 'update account details' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID',
  })
  @ApiOkResponse({
    description: 'Account updated successfully',
    type: AccountResponse,
  })
  @ApiNotFoundResponse({ description: 'Account not found' })
  async updateAccountDetails(
    @Param('id') id: string,
    @Body() body: UpdateAccountDto,
  ) {
    let account = await this.accountService.checkIsFound({ where: { id } });
    account = await this.accountService.update(account, body);
    const AccountResponse =
      await this.accountService.makeAccountResponse(account);
    return AccountResponse;
  }

  @Put('/:id/change-password')
  @ApiOperation({ summary: 'change account password' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID',
  })
  @ApiOkResponse({
    description: 'Account password has been changed successfully',
    type: Boolean,
  })
  @ApiNotFoundResponse({ description: 'Account not found' })
  async changeAccountPassword(
    @Param('id') id: string,
    @Body() body: ChangePasswordDto,
  ) {
    const account = await this.accountService.checkIsFound({ where: { id } });
    return await this.accountService.changePassword(account, body.newPassword);
  }

  @Put('/:id/toggle-lock')
  @ApiOperation({ summary: 'toggle lock account account' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID',
  })
  @ApiOkResponse({
    description: 'the lock status has been changed successfully',
    type: AccountResponse,
  })
  @ApiNotFoundResponse({ description: 'Account not found' })
  async toggleLock(@Param('id') id: string) {
    let account = await this.accountService.checkIsFound({ where: { id } });
    account = await this.accountService.toggleLockStatus(account);
    return await this.accountService.makeAccountResponse(account);
  }

  @Delete('/:id')
  @ApiOperation({ summary: 'delete account (soft delete)' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID of the account to delete',
  })
  @ApiNoContentResponse({
    description: 'Account successfully soft deleted',
    type: AccountResponse,
  })
  @ApiNotFoundResponse({ description: 'Account not found' })
  async delete(@Param('id') id: string) {
    const account = await this.accountService.checkIsFound({ where: { id } });
    await this.accountService.delete(account);
    const AccountResponse =
      await this.accountService.makeAccountResponse(account);
    return AccountResponse;
  }
}
