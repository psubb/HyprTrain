import { toast } from 'sonner';

// Toast utility functions with consistent styling
export const showToast = {
  success: (message: string) => {
    toast.success(message, {
      style: {
        background: 'rgb(17 24 39)', // gray-900
        border: '1px solid rgb(34 197 94 / 0.3)', // green-500/30
        color: 'rgb(34 197 94)', // green-500
      },
    });
  },
  
  error: (message: string) => {
    toast.error(message, {
      style: {
        background: 'rgb(17 24 39)', // gray-900
        border: '1px solid rgb(239 68 68 / 0.3)', // red-500/30
        color: 'rgb(239 68 68)', // red-500
      },
    });
  },
  
  info: (message: string) => {
    toast.info(message, {
      style: {
        background: 'rgb(17 24 39)', // gray-900
        border: '1px solid rgb(59 130 246 / 0.3)', // blue-500/30
        color: 'rgb(59 130 246)', // blue-500
      },
    });
  },
  
  warning: (message: string) => {
    toast.warning(message, {
      style: {
        background: 'rgb(17 24 39)', // gray-900
        border: '1px solid rgb(245 158 11 / 0.3)', // amber-500/30
        color: 'rgb(245 158 11)', // amber-500
      },
    });
  },
};
