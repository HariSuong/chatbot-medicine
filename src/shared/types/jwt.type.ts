export interface AccessTokenPayloadCreate {
  userId: string;
  deviceId: string | null;
  roleId: string;
  roleName: string | null;
}
export interface AccessTokenPayload extends AccessTokenPayloadCreate {
  exp: number;
  iat: number;
}

export interface RefreshTokenPayloadCreate {
  userId: string;
}

export interface RefreshTokenPayload extends RefreshTokenPayloadCreate {
  exp: number;
  iat: number;
}
