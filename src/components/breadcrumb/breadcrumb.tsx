/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import * as React from 'react';
import {
  Breadcrumb as ShadcnBreadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
} from '@/components/ui/breadcrumb';
import { ChevronRightIcon } from 'lucide-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';

interface BreadcrumbItemType {
  key?: string;
  label: string;
  href?: string;
  [key: string]: any;
}

interface BreadcrumbProps<T = any> {
  items?: BreadcrumbItemType[];
  data?: T[];
  currentKey?: string;
  getKey?: (item: T) => string;
  getLabel?: (item: T) => string;
  getParentKey?: (item: T) => string | null | undefined;
  getChildren?: (item: T) => T[];
  getHref?: (item: T) => string;
  homeLabel?: string;
  homeHref?: string;
  separator?: React.ReactNode;
  className?: string;
  itemClassName?: string;
  linkClassName?: string;
  pageClassName?: string;
  separatorClassName?: string;
  ellipsisClassName?: string;
  renderItem?: (item: BreadcrumbItemType, isLast: boolean) => React.ReactNode;
  fallbackLabel?: string;
  maxItems?: number;
  truncateText?: (label: string) => string;
  tooltipContent?: (item: BreadcrumbItemType) => React.ReactNode;
}

const buildBreadcrumbTrail = <T,>(
  data: T[],
  currentKey: string,
  getKey: (item: T) => string,
  getLabel: (item: T) => string,
  getParentKey: (item: T) => string | null | undefined,
  getChildren: (item: T) => T[],
  getHref: (item: T) => string
): BreadcrumbItemType[] => {
  const trail: BreadcrumbItemType[] = [];
  const visited = new Set<string>();

  const findItem = (items: T[], targetKey: string): T | null => {
    for (const item of items) {
      const key = getKey(item);
      if (key === targetKey) {
        return item;
      }
      const children = getChildren(item) || [];
      const found = findItem(children, targetKey);
      if (found) {
        return found;
      }
    }
    return null;
  };

  let currentItem = findItem(data, currentKey);
  if (!currentItem) return trail;

  while (currentItem) {
    const key = getKey(currentItem);
    if (visited.has(key)) break;
    visited.add(key);
    trail.unshift({
      key,
      label: getLabel(currentItem),
      href: getHref(currentItem),
    });
    const parentKey = getParentKey(currentItem);
    if (!parentKey) break;
    currentItem = findItem(data, parentKey);
  }

  return trail;
};

export function Breadcrumb<T>({
  items,
  data,
  currentKey,
  getKey = (item: any) => item.id || item.key || String(item),
  getLabel = (item: any) => item.name || item.label || item.title || String(item),
  getParentKey = (item: any) => item.parentId || item.parentKey || null,
  getChildren = (item: any) => item.children || item.subItems || [],
  getHref = (item: any) => `/${getKey(item)}`,
  homeLabel,
  homeHref = '/',
  separator,
  className,
  itemClassName,
  linkClassName,
  pageClassName,
  separatorClassName,
  ellipsisClassName,
  renderItem,
  fallbackLabel = 'Unknown',
  maxItems = 5,
  truncateText = (label: string) => (label.length > 20 ? `${label.slice(0, 17)}...` : label),
  tooltipContent = (item: BreadcrumbItemType) => item.label,
}: BreadcrumbProps<T>) {
  const t = useTranslations('Component.Breadcrumb');

  const breadcrumbItems: BreadcrumbItemType[] = React.useMemo(() => {
    let result: BreadcrumbItemType[] = [];

    if (items) {
      result = items.map((item) => ({
        ...item,
        key: item.key || item.label || String(Math.random()),
        label: truncateText(item.label || fallbackLabel),
        href: item.href || '#',
      }));
    } else if (data && currentKey) {
      result = buildBreadcrumbTrail(
        data,
        currentKey,
        getKey,
        getLabel,
        getParentKey,
        getChildren,
        getHref
      ).map((item) => ({
        ...item,
        label: truncateText(item.label || fallbackLabel),
      }));
    }

    if (result.length > maxItems) {
      return [result[0], { key: 'ellipsis', label: '...' }, ...result.slice(-maxItems + 1)];
    }

    return result;
  }, [
    items,
    data,
    currentKey,
    getKey,
    getLabel,
    getParentKey,
    getChildren,
    getHref,
    maxItems,
    truncateText,
    fallbackLabel,
  ]);

  return (
    <ShadcnBreadcrumb
      className={cn('flex items-center rounded-md bg-transparent p-2 transition-all', className)}
    >
      <BreadcrumbList>
        <BreadcrumbItem className={cn('text-sm', itemClassName)}>
          <BreadcrumbLink asChild>
            <Link
              href={homeHref}
              className={cn(
                'text-sm font-medium text-gray-600 hover:text-gray-800 hover:underline transition-colors',
                linkClassName
              )}
              aria-label={homeLabel || t('home')}
              title={String(tooltipContent({ label: homeLabel || t('home') }) ?? '')}
            >
              {truncateText(homeLabel || t('home'))}
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>

        {breadcrumbItems.length > 0 && (
          <BreadcrumbSeparator className={cn('text-gray-400 mx-1', separatorClassName)}>
            {separator || <ChevronRightIcon className='h-4 w-4' />}
          </BreadcrumbSeparator>
        )}

        {breadcrumbItems.map((item, index) => {
          const isLast = index === breadcrumbItems.length - 1;
          const isEllipsis = item.label === '...';

          const renderedItem = renderItem ? (
            renderItem(item, isLast)
          ) : isEllipsis ? (
            <BreadcrumbEllipsis
              className={cn('text-sm text-gray-500', ellipsisClassName)}
              title={t('ellipsis')}
            />
          ) : isLast ? (
            <BreadcrumbPage
              className={cn('text-sm font-semibold text-gray-900', pageClassName)}
              aria-current='page'
              title={String(tooltipContent(item) ?? '')}
            >
              {item.label}
            </BreadcrumbPage>
          ) : (
            <BreadcrumbLink asChild>
              <Link
                href={item.href || '#'}
                className={cn(
                  'text-sm font-medium text-gray-600 hover:text-gray-800 hover:underline transition-colors',
                  linkClassName
                )}
                aria-label={item.label}
                title={String(tooltipContent(item) ?? '')}
              >
                {item.label}
              </Link>
            </BreadcrumbLink>
          );

          return (
            <React.Fragment key={item.key || item.label || index}>
              <BreadcrumbItem className={cn('text-sm', itemClassName)}>
                {renderedItem}
              </BreadcrumbItem>
              {!isLast && (
                <BreadcrumbSeparator className={cn('text-gray-400 mx-1', separatorClassName)}>
                  {separator || <ChevronRightIcon className='h-4 w-4' />}
                </BreadcrumbSeparator>
              )}
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </ShadcnBreadcrumb>
  );
}
