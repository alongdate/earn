import { usePrivy } from '@privy-io/react-auth';
import Link from 'next/link';
import { useRouter } from 'next/router';
import posthog from 'posthog-js';
import { useMemo } from 'react';
import { IoSearchOutline, IoWalletOutline } from 'react-icons/io5';

import { Button } from '@/components/ui/button';
import { LocalImage } from '@/components/ui/local-image';
import { Skeleton } from '@/components/ui/skeleton';
import { useCreditBalance } from '@/store/credit';
import { useUser } from '@/store/user';
import { cn } from '@/utils/cn';
import { formatNumberWithSuffix } from '@/utils/formatNumberWithSuffix';

import { CreditIcon } from '@/features/credits/icon/credit';

import { LISTING_NAV_ITEMS } from '../constants';
import { LogoContextMenu } from './LogoContextMenu';
import { NavLink } from './NavLink';
import { UserMenu } from './UserMenu';

interface Props {
  onLoginOpen: () => void;
  onSearchOpen: () => void;
  onWalletOpen: () => void;
  walletBalance: number;
  onCreditOpen: () => void;
}

export const DesktopNavbar = ({
  onLoginOpen,
  onSearchOpen,
  onWalletOpen,
  onCreditOpen,
  walletBalance,
}: Props) => {
  const { authenticated, ready } = usePrivy();
  const router = useRouter();

  const { user, isLoading } = useUser();
  const { creditBalance } = useCreditBalance();

  const isDashboardRoute = useMemo(
    () => router.pathname.startsWith('/dashboard'),
    [router.pathname],
  );

  const maxWidth = useMemo(
    () => (isDashboardRoute ? 'max-w-full' : 'max-w-7xl'),
    [isDashboardRoute],
  );

  const padding = useMemo(
    () => (isDashboardRoute ? 'pr-8 pl-6' : 'px-2 lg:px-6'),
    [isDashboardRoute],
  );

  const openCreditDrawer = () => {
    posthog.capture('open_credits');
    onCreditOpen();
  };

  return (
    <div
      className={cn(
        'hidden h-14 border-b border-slate-200 bg-white text-slate-500 lg:flex',
        padding,
      )}
    >
      <div className={cn('mx-auto flex w-full justify-between', maxWidth)}>
        <div className="flex w-fit items-center gap-3 lg:gap-4">
          <LogoContextMenu>
            <Link
              href="/"
              className="flex items-center gap-3 hover:no-underline"
              onClick={() => {
                posthog.capture('homepage logo click_universal');
              }}
            >
              <LocalImage
                className="h-[1.4rem] cursor-pointer object-contain"
                alt="Superteam Earn"
                src="/assets/logo.svg"
              />

              {isDashboardRoute && (
                <>
                  <div className="h-6 w-[1.5px] bg-slate-300" />
                  <p className="text-sm tracking-[1.5px]">SPONSORS</p>
                </>
              )}
            </Link>
          </LogoContextMenu>

          {!router.pathname.startsWith('/search') &&
            !router.pathname.startsWith('/new/') && (
              <div
                className="flex cursor-pointer items-center gap-1.5 rounded-md px-3 py-2 text-slate-500 transition-all duration-100 hover:bg-slate-100 hover:text-slate-700"
                onClick={onSearchOpen}
              >
                <IoSearchOutline className="size-5" />
              </div>
            )}
        </div>

        {!router.pathname.startsWith('/new/') && (
          <div className="w-fit xl:absolute xl:left-2/4 xl:-translate-x-2/4">
            <div className="mx-6 flex h-full items-center justify-center">
              <div className="ph-no-capture flex h-full flex-row items-center gap-4.5">
                {LISTING_NAV_ITEMS?.map((navItem) => {
                  const isCurrent = `${navItem.href}` === router.asPath;
                  return (
                    <NavLink
                      className="ph-no-capture"
                      onClick={() => {
                        posthog.capture(navItem.posthog);
                      }}
                      key={navItem.label}
                      href={navItem.href ?? '#'}
                      label={navItem.label}
                      isActive={isCurrent}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center gap-4 py-1.5">
          {(!ready || isLoading) && (
            <div className="flex items-center gap-2">
              <Skeleton className="size-7 rounded-full" />
              <Skeleton className="mr-4 h-3 w-20" />
            </div>
          )}

          {ready && authenticated && (
            <div className="ph-no-capture flex items-center gap-2">
              {user?.currentSponsorId && !isDashboardRoute && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs font-semibold"
                  onClick={() => {
                    posthog.capture('sponsor dashboard_navbar');
                  }}
                  asChild
                >
                  <Link href="/dashboard/listings">
                    <span>Dashboard</span>
                    <div className="block h-1.5 w-1.5 rounded-full bg-sky-400" />
                  </Link>
                </Button>
              )}

              {user?.isTalentFilled && (
                <div className="flex items-center gap-1.5">
                  <div
                    className="flex cursor-pointer items-center gap-1.5 rounded-md px-2 py-2 text-slate-500 transition-all duration-100 hover:bg-slate-100 hover:text-slate-700"
                    onClick={openCreditDrawer}
                  >
                    <CreditIcon className="text-brand-purple size-4" />
                    <p className="text-sm font-semibold">{creditBalance}</p>
                  </div>
                  <div className="relative">
                    <div
                      className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-slate-500 transition-all duration-100 hover:bg-slate-100 hover:text-slate-700"
                      onClick={onWalletOpen}
                    >
                      <IoWalletOutline className="text-brand-purple size-6" />
                      <span className="bg-brand-purple/95 absolute top-px -right-1.5 block rounded-md px-1 py-px text-[10px] font-semibold tracking-tight text-white">
                        ${formatNumberWithSuffix(walletBalance || 0, 1, false)}
                      </span>
                    </div>
                  </div>
                </div>
              )}
              <UserMenu />
            </div>
          )}

          {ready && !authenticated && (
            <div className="ph-no-capture flex items-center gap-2">
              <div className="flex items-center gap-0">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs font-semibold"
                  onClick={() => {
                    posthog.capture('create a listing_navbar');
                    router.push('/sponsor');
                  }}
                >
                  <span>Become a Sponsor</span>
                  <div className="block h-1.5 w-1.5 rounded-full bg-sky-400" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs font-semibold"
                  onClick={() => {
                    posthog.capture('login_navbar');
                    onLoginOpen();
                  }}
                >
                  Login
                </Button>
              </div>
              <Button
                variant="default"
                size="sm"
                className="my-1 w-full px-4 text-xs font-semibold"
                onClick={() => {
                  posthog.capture('signup_navbar');
                  onLoginOpen();
                }}
              >
                Sign Up
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
