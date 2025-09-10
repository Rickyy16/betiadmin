import { toast } from 'react-hot-toast';

type ToastType = 'success' | 'error' | 'loading' | 'warning' | 'default';

export const ShowToast = (message: string, type: ToastType = 'default'): void => {
  toast.dismiss();

  const commonStyle = {
    fontSize: '20px',
    border: '1px solid #000000',
    padding: '16px',
  };

  switch (type) {
    case 'success':
      toast.success(message, { style: commonStyle });
      break;
    case 'error':
      toast.error(message, { style: commonStyle });
      break;
    case 'loading':
      toast.loading(message, { style: commonStyle });
      break;
    case 'warning':
      toast(message, { style: commonStyle, icon: '⚠️' });
      break;
    default:
      toast(message, { style: commonStyle });
      break;
  }
};
