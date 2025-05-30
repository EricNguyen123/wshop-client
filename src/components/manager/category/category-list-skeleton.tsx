import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export function CategoryListSkeleton() {
  return (
    <div className='space-y-4'>
      <div className='flex items-center gap-2'>
        <Skeleton className='h-10 w-[300px]' />
      </div>

      <Card>
        <CardHeader>
          <Skeleton className='h-6 w-[180px]' />
          <Skeleton className='h-4 w-[250px]' />
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className='flex items-center'>
                <Skeleton className='h-4 w-4 mr-2' />
                <Skeleton className='h-5 w-[200px]' />
                <Skeleton className='h-5 w-[80px] ml-auto' />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
