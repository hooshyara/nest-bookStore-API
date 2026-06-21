import { SetMetadata } from '@nestjs/common';
import userRoleEnum from 'src/user/enum/userRoleEnum';

export const ROLES_KEY = 'roles';

export const Role = (...roles: userRoleEnum[]) => {
  return SetMetadata(ROLES_KEY, roles);
};
