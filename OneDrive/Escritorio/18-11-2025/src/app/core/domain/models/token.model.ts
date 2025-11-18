
export interface AuthTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export interface TokenData {
  accessToken: string;
  expiresAt: number;
  tokenType: string;
}