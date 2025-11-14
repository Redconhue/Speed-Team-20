import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Type } from '@nestjs/common/interfaces';

@Injectable()
export class JwtAuthGuard extends (AuthGuard('jwt') as Type<any>) {}
