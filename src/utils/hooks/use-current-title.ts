import config from '@/config';
import { EMPTY_STRING } from '@/constant';
import { useTranslations } from 'next-intl';

export const useCurrentTitle = (pathname: string): string => {
  const t = useTranslations('Component.BaseSidebar');

  const pathToTitle: Record<string, string> = {
    [config.routes.private.users]: t('users.label'),
    [config.routes.private.account]: t('account.label'),
  };

  if (pathToTitle[pathname]) {
    return pathToTitle[pathname];
  }

  const pathSegments = pathname.split('/').filter(Boolean);

  while (pathSegments.length > 0) {
    const testPath = '/' + pathSegments.join('/');
    if (pathToTitle[testPath]) {
      return pathToTitle[testPath];
    }
    pathSegments.pop();
  }

  return EMPTY_STRING;
};
