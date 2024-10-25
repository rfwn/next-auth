import { ExclamationTriangleIcon } from '@radix-ui/react-icons';
import { CheckCircledIcon } from '@radix-ui/react-icons';

interface FormMessageProps {
  message?: string;
}

export const FormError = ({ message }: FormMessageProps) => {
  if (!message) return null;

  return (
    <div className="bg-destructive/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-destructive">
      <ExclamationTriangleIcon className="h-5 w-5" /> <p>{message}</p>
    </div>
  );
};


export const FormSuccess = ({ message }: FormMessageProps) => {
  if (!message) return null;

  return (
    <div className="bg-green-500/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-emerald-500">
      <CheckCircledIcon className="h-5 w-5" /> <p>{message}</p>
    </div>
  );
};
