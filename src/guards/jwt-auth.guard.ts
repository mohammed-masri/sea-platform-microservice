import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { AuthorizedRequest } from 'src/common/global.dto';

import { ServerConfigService } from 'src/models/server-config/server-config.service';

@Injectable()
export class JWTAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly serverConfigService: ServerConfigService,
  ) {}

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

    try {
      const JWT_SECRET =
        this.serverConfigService.get<string>('JWT_SECRET') || '';
      const payload = this.jwtService.verify(token, {
        secret: JWT_SECRET,
      });

      request.context = { id: payload.id, type: payload.type };

      return true;
    } catch (error: any) {
      throw new UnauthorizedException(
        `invalid or expired token (${error.message})`,
      );
      return false;
    }
  }
}
