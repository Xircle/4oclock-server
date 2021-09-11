export type SocialProvider = 'kakao' | 'google';

export class SocialModuleOptions {
  kakaoId: string;
  // googleId: string;
}

export class GetKakaoAccessTokenParams {
  clientId: string;
  code: string;
  redirectUri: string;
}