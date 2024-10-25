import { cn } from '@/lib/utils';
import { IBM_Plex_Mono } from 'next/font/google';
import { Button } from '@/components/ui/button';
import { LoginButton } from '@/components/auth/login-button';

const font = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: '600'
});

export default function Home() {
  return (
    <main className="flex h-full flex-col items-center justify-center bg-gradient-to-br from-purple-500 to-sky-400">
      <div className="space-y-6 text-center">
        <h1
          className={cn(
            'text-6xl font-semibold text-white drop-shadow-md',
            font.className
          )}
        >
          Auth
        </h1>
        <p className="text-white text-lg ">Authentication Toolkit</p>
        <div>
          <LoginButton mode='modal' asChild>
            <Button variant={'secondary'} size={'lg'}>
              Sign in
            </Button>
          </LoginButton>
        </div>
      </div>
    </main>
  );
}
