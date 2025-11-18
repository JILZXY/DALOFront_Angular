export const APP_CONFIG = {
  spotify: {
    clientId: '',
    clientSecret: '',
    tokenUrl: 'https://accounts.spotify.com/api/token',
    apiBaseUrl: 'https://api.spotify.com/v1',
    grantType: 'client_credentials'
  },
  auth: {
    tokenKey: 'spotify_access_token',
    expiryKey: 'spotify_token_expiry',
    tokenType: 'spotify_token_type',
    refreshInterval: 60000,
    refreshThreshold: 5 * 60000 
  }
};