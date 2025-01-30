import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { DTO, CONSTANTS } from 'sea-platform-helpers';

@Injectable()
export class CheckAccountTypeGuard implements CanActivate {
  private type: CONSTANTS.Account.AccountTypes;
  constructor(type: CONSTANTS.Account.AccountTypes) {
    this.type = type;
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: DTO.Request.AuthorizedRequest = context
      .switchToHttp()
      .getRequest();

    const { type } = request.context;

    if (this.type !== type)
      throw new UnauthorizedException(
        `your account type ${type} are not allowed to to this action, it should be ${this.type}`,
      );

    return true;
  }
}
