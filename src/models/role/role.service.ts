import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Constants } from 'src/config';
import { Attributes, FindOptions } from 'sequelize';
import { Role } from './role.model';
import { PermissionService } from '../permission/permission.service';
import { RoleFullResponse, RoleShortResponse } from './role.dto';
import { RoleShortArrayDataResponse } from 'src/controllers/role/role.dto';

@Injectable()
export class RoleService {
  constructor(
    @Inject(Constants.Database.DatabaseRepositories.RoleRepository)
    private roleRepository: typeof Role,
    private readonly permissionService: PermissionService,
  ) {}

  async create(data: Attributes<Role>, permissionKeys: string[]) {
    const role = new Role({
      ...data,
    });

    await role.save();

    await this.permissionService.createMultiRolePermissionForRole(
      permissionKeys,
      role,
    );

    return role;
  }

  async update(role: Role, data: Attributes<Role>, permissionKeys: string[]) {
    role = await role.update({ ...data });

    await this.permissionService.updateRolePermissionForRole(
      permissionKeys,
      role,
    );

    return role;
  }

  async findAll(
    options?: FindOptions<Attributes<Role>>,
    page: number = 1,
    limit: number = 10,
  ) {
    if (page < 1) page = 1;
    const offset = (page - 1) * limit;
    const { count: totalCount, rows: roles } =
      await this.roleRepository.findAndCountAll({
        ...options,
        limit,
        offset,
      });
    return {
      totalCount,
      roles,
    };
  }

  async findOne(options?: FindOptions<Attributes<Role>>) {
    return await this.roleRepository.findOne(options);
  }

  async checkIsFound(options?: FindOptions<Attributes<Role>>) {
    const role = await this.findOne(options);
    if (!role) throw new NotFoundException(`Role is not found!`);

    return role;
  }

  async makeRoleShortResponse(role: Role) {
    return new RoleShortResponse(role);
  }

  async makeRolesShortResponse(roles: Role[]) {
    const rolesResponse: RoleShortResponse[] = [];
    for (let i = 0; i < roles.length; i++) {
      const role = roles[i];
      const roleResponse = await this.makeRoleShortResponse(role);
      rolesResponse.push(roleResponse);
    }
    return rolesResponse;
  }

  async makeRoleShortArrayDataResponse(page: number, limit: number) {
    const { totalCount, roles } = await this.findAll({}, page, limit);

    const rolesResponse = await this.makeRolesShortResponse(roles);

    return new RoleShortArrayDataResponse(
      totalCount,
      rolesResponse,
      page,
      limit,
    );
  }

  async makeRoleFullResponse(role: Role): Promise<RoleFullResponse> {
    const rolePermissions = role.rolePermissions
      ? role.rolePermissions
      : await this.permissionService.findAllForRole(role.id);

    const permissionKeys = rolePermissions.map((p) => p.permissionKey);

    const PERMISSIONS =
      role.type === Constants.Account.AccountTypes.Admin
        ? Constants.Permission.ADMIN_PERMISSIONS
        : Constants.Permission.USER_PERMISSIONS;

    const permissionsResponse = await Promise.all(
      PERMISSIONS.map((permission) =>
        this.permissionService.makePermissionResponseForRole(
          permission,
          permissionKeys,
        ),
      ),
    );

    return new RoleFullResponse(role, permissionsResponse);
  }

  async delete(role: Role) {
    // TODO
    // check if there are any account has it

    const rolePermissions = role.rolePermissions
      ? role.rolePermissions
      : await this.permissionService.findAllForRole(role.id);

    await Promise.all(
      rolePermissions.map((p) =>
        this.permissionService.deleteRolePermission(p),
      ),
    );

    return await role.destroy({ force: true });
  }
}
