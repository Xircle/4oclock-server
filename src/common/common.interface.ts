export class CoreOutput {
  ok: boolean;
  error?: string;
}

export class MetaTag {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  hasMore: boolean;
}
export class SocialProfile {
  uid: number | string;
  thumbnail: string;
  username: string;
  email?: string;
  gender?: string;
}
