// src/shared/constains/auth.constains.ts

export const REQUEST_USER_KEY = 'user';

export const AuthType = {
  Bearer: 'Bearer',
  APIKey: 'APIKey',
  None: 'None',
} as const;

export type AuthTypeType = (typeof AuthType)[keyof typeof AuthType];

export const ConditionGuard = {
  And: 'And',
  Or: 'Or',
} as const;

export type ConditionGuardType =
  (typeof ConditionGuard)[keyof typeof ConditionGuard];

// Định nghĩa các giá trị UserStatus
export const USER_STATUS_VALUES = [
  'ACTIVE',
  'INACTIVE',
  'BLOCKED',
  'PENDING_VERIFICATION',
] as const;
export type UserStatusType = (typeof USER_STATUS_VALUES)[number];

// Định nghĩa các giá trị VerificationCodeType
export const VERIFICATION_CODE_TYPE_VALUES = {
  REGISTER: 'REGISTER',
  FORGOT_PASSWORD: 'FORGOT_PASSWORD',
} as const;
export type VerificationCodeTypeType =
  keyof typeof VERIFICATION_CODE_TYPE_VALUES;
