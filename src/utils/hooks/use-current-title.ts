import { EMPTY_STRING } from '@/constant';

export const useCurrentTitle = (pathname: string, pathToTitle?: Record<string, string>): string => {
  if (pathToTitle && pathToTitle[pathname]) {
    return pathToTitle[pathname];
  }

  const pathSegments = pathname.split('/').filter(Boolean);

  while (pathSegments.length > 0) {
    const testPath = '/' + pathSegments.join('/');
    if (pathToTitle && pathToTitle[testPath]) {
      return pathToTitle[testPath];
    }
    pathSegments.pop();
  }

  return EMPTY_STRING;
};
