import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuthorizedRequest } from 'src/common/global.dto';

import { ServerConfigService } from 'src/models/server-config/server-config.service';

@Injectable()
export class CheckCallMe implements CanActivate {
  constructor(private readonly serverConfigService: ServerConfigService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: AuthorizedRequest = context.switchToHttp().getRequest();

    const authorization = (request.headers as any).authorization;

    if (!authorization)
      throw new UnauthorizedException(
        'the token is not provided in the authorization request headers',
      );

    let token = authorization;
    if (authorization.startsWith('Bearer ')) token = authorization.substring(7);

    const CALL_ME_SECRET =
      this.serverConfigService.get<string>('CALL_ME_SECRET');

    if (token !== CALL_ME_SECRET) {
      throw new UnauthorizedException(`invalid or expired token`);
    }

    return true;
  }
}
