import BaseLayout from '@/components/base-layout';
import BaseNotFound from '@/components/not-found/base-not-found';
import { routing } from '@/i18n/routing';

export default function GlobalNotFound() {
  return (
    <BaseLayout locale={routing.defaultLocale}>
      <BaseNotFound />
    </BaseLayout>
  );
}
