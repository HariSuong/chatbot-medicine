import { SetMetadata } from '@nestjs/common';
import {
  AuthType,
  AuthTypeType,
  ConditionGuard,
  ConditionGuardType,
} from 'src/shared/constains/auth.constains';

export const AUTH_TYPE_KEY = 'authType';
export type AuthTypeDecoratorPayload = {
  authTypes: AuthTypeType[];
  option: { condition: ConditionGuardType };
};
export const Auth = (
  authTypes: AuthTypeType[],
  option?: { condition: ConditionGuardType },
) => {
  return SetMetadata(AUTH_TYPE_KEY, {
    authTypes,
    option: option ?? ConditionGuard.And,
  });
};

export const IsPublic = () => Auth([AuthType.None]);
