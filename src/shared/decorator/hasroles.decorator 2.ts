import { SetMetadata } from '@nestjs/common';
import { Role } from '../security/role';

export const HasRoles = (...roles: Role[]) => SetMetadata('roles', roles);
