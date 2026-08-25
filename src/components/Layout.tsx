import { ReactNode } from 'react';
import Sidebar from './Sidebar';
import BottomTab from './BottomTab';
import StarCounter from './StarCounter';
import InstallPrompt from './InstallPrompt';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen">
      <InstallPrompt />
      <Sidebar />
      <StarCounter />
      <main className="md:ml-[220px] pb-safe">
        <div className="p-4 md:p-6 max-w-4xl mx-auto">
          {children}
        </div>
      </main>
      <BottomTab />
    </div>
  );
}
