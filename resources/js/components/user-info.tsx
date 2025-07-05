import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useInitials } from '@/hooks/use-initials';
import { type User } from '@/types';

export function UserInfo({ user, showEmail = false }: { user: User; showEmail?: boolean }) {
    const getInitials = useInitials();
    // Defensive: handle missing/null avatar and name
    const avatarSrc = user.avatar || undefined;
    const userName = user.name || '';
    const userEmail = user.email || '';
    return (
        <>
            <Avatar className="h-8 w-8 overflow-hidden rounded-full">
                {/* Only pass src if defined, fallback will show initials */}
                <AvatarImage src={avatarSrc} alt={userName} />
                <AvatarFallback className="rounded-lg bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white">
                    {getInitials(userName)}
                </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{userName}</span>
                {showEmail && <span className="truncate text-xs text-muted-foreground">{userEmail}</span>}
            </div>
        </>
    );
}
