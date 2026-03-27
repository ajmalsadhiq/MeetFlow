import { Metadata } from 'next';
import { ReactNode } from 'react';

import Navbar from '@/components/navbar';
import Sidebar from '@/components/sidebar';

export const metadata: Metadata = {
  title: 'YOOM',
  description: 'A workspace for your team, powered by Stream Chat and Clerk.',
};

const RootLayout = ({ children }: Readonly<{children: ReactNode}>) => {
  return (
    <main className="relative bg-dark-2 min-h-screen"> 
      <Navbar />

      <div className="flex">
        <Sidebar />
        
        {/* FIXED: Added pl-[264px] to account for the FIXED sidebar width */}
        <section className="flex min-h-screen flex-1 flex-col px-6 pb-6 pt-28 max-md:pb-14 sm:px-14 lg:pl-[300px]">
          <div className="w-full">
            {children}
          </div>
        </section>
      </div>
    </main>
  );
};
export default RootLayout;