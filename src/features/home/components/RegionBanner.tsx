import Image from 'next/image';

import { UserFlag } from '@/components/shared/UserFlag';
import { type Region, type Superteam } from '@/constants/Superteam';

const customBannerPosition: Partial<
  Record<Region, Partial<React.CSSProperties>>
> = {
  'South Korea': {
    objectPosition: 'bottom',
  },
  Brazil: {
    objectPosition: 'top',
  },
  Malaysia: {
    objectPosition: '50% 75%',
  },
  Philippines: {
    objectPosition: '50% 80%',
  },
  Japan: {
    objectPosition: '50% 65%',
  },
  France: {
    objectPosition: 'bottom',
  },
  Canada: {
    objectPosition: '50% 75%',
  },
  Singapore: {
    objectPosition: '50% 30%',
  },
};

export function RegionBanner({ st }: { st: Superteam }) {
  return (
    <div className="relative flex h-72 w-full flex-col items-center">
      <Image
        src={st.banner}
        alt={st.name}
        width={1440}
        height={290}
        className="h-full w-full object-cover object-center"
        style={{
          ...(customBannerPosition[st.region] || {}),
        }}
      />
      <div className="absolute inset-0 block h-full w-full bg-[rgba(64,65,108,0.75)]" />
      <div className="absolute top-1/2 flex -translate-y-1/2 flex-col items-center px-4">
        {st.code && <UserFlag location={st.code} isCode size="44px" />}
        {st.hello && (
          <>
            <h2 className="text-2xl font-bold text-white md:text-3xl">
              {st.hello}, {st.displayValue}
            </h2>

            <p className="mt-2 max-w-[40rem] text-center text-sm font-medium text-white md:text-lg">
              Welcome to {st.name}
              {`'s`} earnings page — use these opportunities to earn in global
              standards and gain membership in the most exclusive Solana
              community of {st.displayValue}!
            </p>
          </>
        )}
      </div>
    </div>
  );
}
