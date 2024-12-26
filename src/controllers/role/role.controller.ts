import {
  Body,
  Controller,
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
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FindAllDto } from 'src/common/global.dto';
import { Constants } from 'src/config';
import { CheckAccountTypeGuard } from 'src/guards/check-account-type.guard';
import { JWTAuthGuard } from 'src/guards/jwt-auth.guard';
import { RoleService } from 'src/models/role/role.service';
import {
  CreateRoleDto,
  RoleShortArrayDataResponse,
  UpdateRoleDto,
} from './role.dto';
import { RoleFullResponse, RoleShortResponse } from 'src/models/role/role.dto';
import { RolePermission } from 'src/models/permission/role-permission.model';

@Controller('roles')
@ApiTags('Internal', 'Role')
@UseGuards(
  JWTAuthGuard,
  new CheckAccountTypeGuard(Constants.Account.AccountTypes.Admin),
)
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new role' })
  @ApiCreatedResponse({
    description: 'The role has been successfully created.',
    type: RoleShortResponse,
  })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  async create(@Body() body: CreateRoleDto) {
    const { permissions, ...data } = body;
    const role = await this.roleService.create(data, permissions);
    return await this.roleService.makeRoleShortResponse(role);
  }

  @Get()
  @ApiOperation({ summary: 'fetch roles' })
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
    description: 'Retrieve a paginated list of roles',
    type: RoleShortArrayDataResponse,
  })
  async findAll(@Query() query: FindAllDto) {
    const response = await this.roleService.makeRoleShortArrayDataResponse(
      query.page,
      query.limit,
    );

    return response;
  }

  @Get('/:id')
  @ApiOperation({ summary: 'get role details' })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'ID',
  })
  @ApiOkResponse({
    description: 'Role fetched successfully',
    type: RoleFullResponse,
  })
  @ApiNotFoundResponse({ description: 'Role not found' })
  async fetchAccountDetails(@Param('id') id: string) {
    const role = await this.roleService.checkIsFound({
      where: { id },
      include: [RolePermission],
    });
    const roleResponse = await this.roleService.makeRoleFullResponse(role);
    return roleResponse;
  }

  @Put('/:id')
  @ApiOperation({ summary: 'update role details' })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'ID',
  })
  @ApiOkResponse({
    description: 'Role updated successfully',
    type: RoleFullResponse,
  })
  @ApiNotFoundResponse({ description: 'Role not found' })
  async updateAccountDetails(
    @Param('id') id: string,
    @Body() body: UpdateRoleDto,
  ) {
    const { permissions, ...data } = body;
    let role = await this.roleService.checkIsFound({
      where: { id },
    });
    role = await this.roleService.update(role, data, permissions);

    const roleResponse = await this.roleService.makeRoleFullResponse(role);
    return roleResponse;
  }
}
