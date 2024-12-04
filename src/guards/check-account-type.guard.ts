import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuthorizedRequest } from 'src/common/global.dto';

import { Constants } from 'src/config';

@Injectable()
export class CheckAccountTypeGuard implements CanActivate {
  private type: Constants.Account.AccountTypes;
  constructor(type: Constants.Account.AccountTypes) {
    this.type = type;
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: AuthorizedRequest = context.switchToHttp().getRequest();

    const { type } = request.context;

    if (this.type !== type)
      throw new UnauthorizedException(
        `your account type ${type} are not allowed to to this action, it should be ${this.type}`,
      );

    return true;
  }
}
