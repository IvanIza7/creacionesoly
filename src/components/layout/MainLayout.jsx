import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import FabNav from './FabNav';
import WhatsAppButton from './WhatsAppButton';
import LoginPromptModal from '../client/LoginPromptModal';
import Footer from './Footer';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

const MainLayout = () => {
  const { pathname } = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    const lenis = new Lenis({
      autoRaf: true,
      lerp: 0.08,
      smoothWheel: true,
    });

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col relative font-sans text-primary bg-background">
      <Header />
      <main className="flex-1 w-full">
        <Outlet />
      </main>
      <Footer />
      <FabNav />
      <WhatsAppButton />
      {/* Global Modals */}
      <LoginPromptModal />
    </div>
  );
};

export default MainLayout;
