import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { PenSquare } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { IUserRes } from '@/types/common';
import UserAddressForm from './user-address-form';

const UserAddressDialog = ({ user }: { user: IUserRes }) => {
  const t = useTranslations('Component.UserProfile');
  const [open, setOpen] = useState(false);

  const handleCloseDialog = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant='ghost' size='icon' className='h-8 w-8 cursor-pointer'>
          <PenSquare className='h-4 w-4 text-slate-500' />
        </Button>
      </DialogTrigger>

      <DialogContent className='max-w-[350px] sm:!max-w-md  !rounded-2xl'>
        <DialogHeader>
          <DialogTitle>{t('info.dialogs.updateAddress')}</DialogTitle>
          <DialogDescription>{t('info.dialogs.updateAddressDescription')}</DialogDescription>
        </DialogHeader>

        <div className='space-y-4 py-4'>
          <UserAddressForm
            userId={user.id}
            onclickCancel={handleCloseDialog}
            data={user}
            variant='edit'
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserAddressDialog;
