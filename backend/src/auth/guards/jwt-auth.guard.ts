import { Injectable, Type } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends (AuthGuard('jwt') as Type<any>) {}
