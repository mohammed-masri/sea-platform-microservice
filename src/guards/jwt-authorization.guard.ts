import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { Common } from 'sea-platform-helpers';
import { Constants } from 'src/config';

@Injectable()
export class JWTAuthorizationGuard implements CanActivate {
  constructor(
    private readonly acceptedPermissionKeys: Constants.Permission.PermissionKeys[],
    private readonly validationStrategy: 'all' | 'some' | 'one' = 'all', // Default strategy
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: Common.DTO.AuthorizedRequest & Request = context
      .switchToHttp()
      .getRequest();

    const { permissionKeys } = request.context;

    const authorized = this.validatePermissions(
      permissionKeys as Constants.Permission.PermissionKeys[],
    );

    if (!authorized)
      throw new UnauthorizedException(
        `You are not authorized to do this action!`,
        {
          description: `you must have ${this.validationStrategy} of these permissions [${this.acceptedPermissionKeys}]`,
        },
      );

    return true;
  }

  private validatePermissions(
    accountPermissionKeys: Constants.Permission.PermissionKeys[],
  ): boolean {
    switch (this.validationStrategy) {
      case 'all':
        return this.acceptedPermissionKeys.every((key) =>
          accountPermissionKeys.includes(key),
        );
      case 'some':
        return this.acceptedPermissionKeys.some((key) =>
          accountPermissionKeys.includes(key),
        );
      case 'one':
        return (
          this.acceptedPermissionKeys.length > 0 &&
          accountPermissionKeys.includes(this.acceptedPermissionKeys[0])
        );
      default:
        return false;
    }
  }
}
