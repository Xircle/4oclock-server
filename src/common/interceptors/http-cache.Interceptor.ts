import { CacheInterceptor, Injectable, ExecutionContext } from '@nestjs/common';

@Injectable()
export class HttpCacheInterceptor extends CacheInterceptor {
  trackBy(context: ExecutionContext): string | undefined {
    const request = context.switchToHttp().getRequest();
    const isGetRequest = request.method === 'GET';
    const requestURl: string = request.path;
    const cachablePaths = ['/place', '/user/me'];

    if (
      isGetRequest &&
      cachablePaths.some((url) => requestURl.startsWith(url))
    ) {
      console.log('cachable!');
      return requestURl;
    }
    return undefined;
  }
}
