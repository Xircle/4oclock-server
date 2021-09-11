export class CoreOutput {
  ok: boolean;
  error?: string;
}

export class SocialProfile {
  uid: number | string;
  thumbnail: string;
  username: string;
  email?: string;
  gender?: string;
}
