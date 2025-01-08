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
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JWTAuthorizationGuard } from 'src/guards/jwt-authorization.guard';
import { ApplicationService } from 'src/models/application/application.service';
import {
  ApplicationArrayDataResponse,
  CreateApplicationDto,
  FindAllApplicationsDto,
  UpdateApplicationDto,
  UpdateApplicationStatusDto,
} from './application.dto';
import { Constants } from 'src/config';
import { JWTAuthGuard } from 'src/guards/jwt-authentication.guard';
import { CheckAccountTypeGuard } from 'src/guards/check-account-type.guard';
import { ApplicationResponse } from 'src/models/application/application.dto';

@Controller('applications')
@ApiTags('Internal', 'Application')
@UseGuards(
  JWTAuthGuard,
  new CheckAccountTypeGuard(Constants.Account.AccountTypes.Admin),
)
export class ApplicationController {
  constructor(private readonly applicationService: ApplicationService) {}

  @Post()
  @UseGuards(
    new JWTAuthorizationGuard([
      Constants.Permission.PermissionKeys.ManageApplicationCreate,
    ]),
  )
  @ApiOperation({ summary: 'Create a new application' })
  @ApiCreatedResponse({
    description: 'The application has been successfully created.',
    type: ApplicationResponse,
  })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  async create(@Body() body: CreateApplicationDto) {
    const application = await this.applicationService.create(body);
    return await this.applicationService.makeApplicationResponse(application);
  }

  @Get()
  @UseGuards(
    new JWTAuthorizationGuard([
      Constants.Permission.PermissionKeys.ManageApplicationRead,
    ]),
  )
  @ApiOperation({ summary: 'fetch applications' })
  @ApiResponse({
    status: 200,
    description: 'Retrieve a paginated list of applications',
    type: ApplicationArrayDataResponse,
  })
  async findAll(@Query() query: FindAllApplicationsDto) {
    const response =
      await this.applicationService.makeApplicationArrayDataResponse(
        query.page,
        query.limit,
        query.q,
        query.status,
      );
    return response;
  }

  @Get('/:id')
  @UseGuards(
    new JWTAuthorizationGuard([
      Constants.Permission.PermissionKeys.ManageApplicationRead,
    ]),
  )
  @ApiOperation({ summary: 'get application details' })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'ID',
  })
  @ApiOkResponse({
    description: 'Application fetched successfully',
    type: ApplicationResponse,
  })
  @ApiNotFoundResponse({ description: 'Application not found' })
  async fetchApplicationDetails(@Param('id') id: string) {
    const application = await this.applicationService.checkIsFound({
      where: { id },
    });
    const applicationResponse =
      await this.applicationService.makeApplicationResponse(application);
    return applicationResponse;
  }

  @Put('/:id')
  @UseGuards(
    new JWTAuthorizationGuard([
      Constants.Permission.PermissionKeys.ManageApplicationUpdateDetails,
    ]),
  )
  @ApiOperation({ summary: 'update application details' })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'ID',
  })
  @ApiOkResponse({
    description: 'Application updated successfully',
    type: ApplicationResponse,
  })
  @ApiNotFoundResponse({ description: 'Application not found' })
  async updateApplicationDetails(
    @Param('id') id: string,
    @Body() body: UpdateApplicationDto,
  ) {
    let application = await this.applicationService.checkIsFound({
      where: { id },
    });
    application = await this.applicationService.update(application, body);

    const applicationResponse =
      await this.applicationService.makeApplicationResponse(application);
    return applicationResponse;
  }

  @Put('/:id/status')
  @UseGuards(
    new JWTAuthorizationGuard([
      Constants.Permission.PermissionKeys.ManageApplicationUpdateDetails,
    ]),
  )
  @ApiOperation({ summary: 'update application details' })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'ID',
  })
  @ApiOkResponse({
    description: 'Application updated successfully',
    type: ApplicationResponse,
  })
  @ApiNotFoundResponse({ description: 'Application not found' })
  async updateApplicationStatus(
    @Param('id') id: string,
    @Body() body: UpdateApplicationStatusDto,
  ) {
    let application = await this.applicationService.checkIsFound({
      where: { id },
    });
    application = await this.applicationService.updateStatus(
      application,
      body.status,
    );

    const applicationResponse =
      await this.applicationService.makeApplicationResponse(application);
    return applicationResponse;
  }

  @Delete('/:id')
  @UseGuards(
    new JWTAuthorizationGuard([
      Constants.Permission.PermissionKeys.ManageApplicationDelete,
    ]),
  )
  @ApiOperation({ summary: 'delete application (force delete)' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID of the application to delete',
  })
  @ApiNoContentResponse({
    description: 'application successfully force deleted',
    type: ApplicationResponse,
  })
  @ApiNotFoundResponse({ description: 'Application not found' })
  async delete(@Param('id') id: string) {
    const application = await this.applicationService.checkIsFound({
      where: { id },
    });
    await this.applicationService.delete(application);
    const applicationResponse =
      await this.applicationService.makeApplicationResponse(application);
    return applicationResponse;
  }
}
