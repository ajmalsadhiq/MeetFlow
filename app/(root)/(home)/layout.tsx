import { Metadata } from 'next';
import { ReactNode } from 'react';

import Navbar from '@/components/navbar';
import Sidebar from '@/components/sidebar';

export const metadata: Metadata = {
  title: 'MeetFlow',
  description: 'A workspace for your team, powered by Stream Chat and Clerk.',
};

const RootLayout = ({ children }: Readonly<{ children: ReactNode }>) => {
  return (
    <main className="relative bg-dark-2 min-h-screen">
      <Navbar />

      <div className="flex">
        <Sidebar />

        {/*
          Sidebar breakdown (DO NOT change sidebar, just match it here):
          - max-sm (<640px)   : sidebar is display:none  → no left offset, full width
          - sm→lg (640-1024px): sidebar = p-6(24px) + icon(24px) + p-6(24px) = 72px w-fit
          - lg+ (>1024px)     : sidebar = w-[264px] fixed

          We use a matching invisible spacer div approach so the content
          always flows AFTER the sidebar without any overlap or guessing.
        */}
        <section className="flex min-h-screen flex-1 flex-col pb-6 pt-28 max-md:pb-14
                            px-4
                            sm:ml-[72px] sm:px-6
                            lg:ml-[264px] lg:px-8">
          <div className="w-full">
            {children}
          </div>
        </section>
      </div>
    </main>
  );
};

export default RootLayout;