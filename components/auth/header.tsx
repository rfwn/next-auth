import { cn } from '@/lib/utils';
import { IBM_Plex_Mono } from 'next/font/google';
const font = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: '600'
});

interface HeaderProps {
  label: string;
}

export const Header = ({ label }: HeaderProps) => {
  return (
    <div className="w-full flex flex-col gap-y-2 items-center justify-center">
      <h1 className={cn('text-4xl font-semibold', font.className)}>Auth</h1>
      <p className="text-muted-foreground text-sm">{label}</p>
    </div>
  );
};
