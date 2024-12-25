import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AllPermissionResponse } from 'src/models/permission/permission.dto';
import { PermissionService } from 'src/models/permission/permission.service';

@Controller('static')
export class StaticController {
  constructor(private readonly permissionService: PermissionService) {}

  @Get('/permissions')
  @ApiOperation({ summary: 'fetch account types' })
  @ApiResponse({
    status: 200,
    description: 'Retrieve permissions',
    type: AllPermissionResponse,
  })
  async getPermissions() {
    return await this.permissionService.fetchAllPermissions();
  }
}
