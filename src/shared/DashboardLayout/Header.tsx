import { SidebarTrigger } from '@/components/ui/sidebar';
import { Skeleton } from '@/components/ui/skeleton';
import LanguageSelector from '@/shared/LanguageSelector';
import ProfileAvatar from '@/shared/ProfileAvatar';
import ThemeSwitcher from '@/shared/ThemeSwitcher';

type HeaderProps = {
  isLoading?: boolean;
};

const Header = ({ isLoading }: HeaderProps) => {
  return (
    <header className="h-16 w-full fixed z-10 right-0 bg-background border-b border-border flex items-center justify-between px-6">
      {/* Right side */}
      <div className="flex flex-row w-full space-x-4 justify-end items-center">
        <div className="w-full flex justify-start">
          <SidebarTrigger className="xl:hidden block self-end" />
        </div>
        {isLoading ? (
          <>
            <Skeleton className="p-2 mt-2 h-8 w-32 rounded-sm" />
            <Skeleton className="p-2 mt-2 h-8 w-32 rounded-sm" />
            <Skeleton className="h-10 w-10 rounded-full" />
          </>
        ) : (
          <>
            {/* Dark/Light Mode Toggle */}
            <ThemeSwitcher />
            {/* Language Switcher */}
            <LanguageSelector />
            {/* Profile Avatar */}
            <ProfileAvatar />
          </>
        )}
      </div>
    </header>
  );
};

export { Header };
