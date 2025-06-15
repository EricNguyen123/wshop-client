'use client';

import { useState } from 'react';
import { Edit, Copy, Check, Palette, SquarePen, Trash } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { IColorType } from '@/types/common';
import { format } from 'date-fns';
import { ActionButton } from '@/components/button/button-action';
import { ValidRolesEnum } from '@/common/enum';
import { useAppSelector } from '@/lib/store/hooks';
import { selectCurrentAccount } from '@/lib/store/features/auth/slice';
import { useTranslations } from 'next-intl';
import { generateColorVariations } from '@/utils/helpers';
import { getColorName } from '@/utils/common';
import { colorKeys } from '@/constant/common';
import { DeleteConfirmation } from '@/components/delete/delete-confirmation';
import BaseTooltip from '@/components/tooltip/base-tooltip';

interface ColorTypesGridProps {
  colorTypes: IColorType[];
  onEdit: (colorType: IColorType) => void;
  onDelete: (id: string) => void;
}

export function ColorTypesGrid({ colorTypes, onEdit, onDelete }: ColorTypesGridProps) {
  const t = useTranslations('Component.ColorTypes');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const currentAccount = useAppSelector(selectCurrentAccount);

  const handleCopyColor = async (colorCode: string, id: string) => {
    await navigator.clipboard.writeText(colorCode);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (colorTypes.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center py-24 px-4'>
        <div className='relative mb-8'>
          <div className='w-24 h-24 bg-gradient-to-br from-slate-100 to-slate-200 rounded-3xl flex items-center justify-center shadow-inner'>
            <Palette className='w-12 h-12 text-slate-400' />
          </div>
          <div className='absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full opacity-20 animate-pulse' />
          <div className='absolute -bottom-2 -left-2 w-6 h-6 bg-gradient-to-br from-pink-500 to-red-500 rounded-full opacity-30 animate-pulse delay-300' />
        </div>
        <h3 className='text-2xl font-bold text-slate-900 mb-3'>{t('descriptions.noData')}</h3>
        <p className='text-slate-500 text-center max-w-md mb-8 leading-relaxed'>
          {t('descriptions.noData2')}
        </p>
        <div className='flex items-center gap-2'>
          {colorKeys.map((color, index) => (
            <div
              key={color}
              className='w-3 h-3 rounded-full animate-bounce'
              style={{
                backgroundColor: color,
                animationDelay: `${index * 200}ms`,
                animationDuration: '1.5s',
              }}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5 gap-8'>
        {colorTypes.map((colorType, index) => {
          const variations = generateColorVariations(colorType.colorCode);
          const isHovered = hoveredCard === colorType.id;
          const colorFamily = getColorName(colorType.colorCode);

          return (
            <Card
              key={colorType.id}
              className='group relative overflow-hidden  shadow-sm hover:shadow-2xl transition-all duration-500 ease-out rounded-3xl '
              style={{
                transform: isHovered ? 'translateY(-8px)' : 'translateY(0)',
                animationDelay: `${index * 80}ms`,
              }}
              onMouseEnter={() => setHoveredCard(colorType.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className='relative'>
                <div
                  className='h-48 relative overflow-hidden cursor-pointer transition-all duration-300'
                  style={{ backgroundColor: colorType.colorCode }}
                  onClick={() => handleCopyColor(colorType.colorCode, colorType.id)}
                >
                  <div className='absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-black/10' />

                  <div className='absolute top-4 left-4 right-4 flex items-center justify-between'>
                    <Badge
                      variant='secondary'
                      className='bg-white/15 backdrop-blur-md border-white/20 text-white text-xs font-medium px-3 py-1'
                    >
                      {colorFamily}
                    </Badge>

                    <div className='w-max' onClick={(e) => e.stopPropagation()}>
                      <ActionButton
                        currentRole={currentAccount?.user.role ?? ValidRolesEnum.USER}
                        dropdownClassName='absolute right-[-36px]'
                        variant='ghost'
                        actionVariant='horizontal'
                        options={[
                          {
                            content: t('actions.copyId'),
                            icon: <Copy className='h-4 w-4' />,
                            onSelect: () => handleCopyColor(colorType.colorCode, colorType.id),
                            roles: [ValidRolesEnum.ADMIN, ValidRolesEnum.EDITOR],
                          },
                          {
                            content: t('actions.edit'),
                            icon: <SquarePen className='h-4 w-4' />,
                            onSelect: () => onEdit(colorType),
                            roles: [ValidRolesEnum.ADMIN, ValidRolesEnum.EDITOR],
                          },
                          {
                            content: t('actions.delete'),
                            icon: <Trash className='h-4 w-4 text-red-500 hover:text-red-600' />,
                            className: 'text-red-500 hover:!text-red-600',
                            dialog: {
                              content: (
                                <DeleteConfirmation
                                  title={t('actions.dialogs.delete.title')}
                                  onDelete={() => onDelete(colorType.id)}
                                  itemName={`${colorType.name}`}
                                />
                              ),
                            },
                            roles: [ValidRolesEnum.ADMIN, ValidRolesEnum.EDITOR],
                          },
                        ]}
                      />
                    </div>
                  </div>

                  {copiedId === colorType.id && (
                    <div className='absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm'>
                      <div className='bg-white rounded-2xl p-4 shadow-xl flex items-center gap-3'>
                        <Check className='h-5 w-5 text-green-600' />
                        <span className='font-medium text-slate-900'>{t('descriptions.copy')}</span>
                      </div>
                    </div>
                  )}

                  <div className='absolute bottom-4 left-4'>
                    <div className='bg-white/15 backdrop-blur-md rounded-xl px-4 py-2 border border-white/20'>
                      <span className='font-mono text-sm font-medium text-white'>
                        {colorType.colorCode}
                      </span>
                    </div>
                  </div>
                </div>

                <div className='h-3 flex'>
                  {variations.map((variation, idx) => (
                    <BaseTooltip key={idx} nameTooltip={variation}>
                      <div
                        className='flex-1 cursor-pointer hover:scale-105 transition-transform duration-200'
                        style={{ backgroundColor: variation }}
                        onClick={() => handleCopyColor(variation, `${colorType.id}-${idx}`)}
                      />
                    </BaseTooltip>
                  ))}
                </div>
              </div>

              <CardContent className='p-6 space-y-4'>
                <div className='space-y-3'>
                  <div className='flex items-start justify-between'>
                    <div className='space-y-1 flex-1'>
                      <BaseTooltip nameTooltip={colorType.name}>
                        <h3 className='w-max max-w-48 font-bold text-xl truncate leading-tight text-foreground transition-colors'>
                          {colorType.name}
                        </h3>
                      </BaseTooltip>
                      <p className='text-sm text-accent-foreground/50 font-medium'>
                        {t('descriptions.created')} {format(new Date(colorType.createdAt), 'PPpp')}
                      </p>
                    </div>
                  </div>
                </div>

                <div className='space-y-3 pt-2'>
                  <div className='flex items-center justify-between text-sm'>
                    <span className='text-accent-foreground/80 font-medium'>
                      {t('descriptions.hexCode')}
                    </span>
                    <code className='bg-foreground/5 px-3 py-1 rounded-lg font-mono text-accent-foreground/80'>
                      {colorType.colorCode}
                    </code>
                  </div>
                </div>

                <div className='flex gap-3 pt-4 border-t border-slate-100'>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() => handleCopyColor(colorType.colorCode, colorType.id)}
                    className='flex-1 h-10 rounded-xl border-slate-200 hover:border-slate-300 transition-all duration-200'
                  >
                    {copiedId === colorType.id ? (
                      <>
                        <Check className='mr-2 h-4 w-4 text-green-600' />
                        <span className='text-green-600 font-medium'>
                          {t('descriptions.copied')}
                        </span>
                      </>
                    ) : (
                      <>
                        <Copy className='mr-2 h-4 w-4' />
                        <span className='font-medium'>{t('descriptions.copy2')}</span>
                      </>
                    )}
                  </Button>

                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() => onEdit(colorType)}
                    className='h-10 px-4 rounded-xl border-slate-200 hover:border-slate-300 transition-all duration-200'
                  >
                    <Edit className='h-4 w-4' />
                  </Button>
                </div>
              </CardContent>

              <div
                className='absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none'
                style={{
                  boxShadow: `0 0 0 1px ${colorType.colorCode}20, 0 0 20px ${colorType.colorCode}15`,
                }}
              />
            </Card>
          );
        })}
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .grid > * {
          animation: fadeInUp 0.6s ease-out forwards;
        }
      `}</style>
    </>
  );
}
