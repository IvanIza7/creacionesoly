import React from 'react';
import { Helmet } from 'react-helmet-async';
import Hero from '../../components/home/Hero';
import CategoryCoverGrid from '../../components/collections/CategoryCoverGrid';

const Home = () => {
  return (
    <div className="w-full bg-background relative">
      <Helmet>
        <title>Creaciones Oly - Creaciones Exclusivas</title>
        <meta name="description" content="Descubre la colección más exclusiva de joyería, anillos, relojes y accesorios premium. Elegancia intemporal." />
      </Helmet>
      {/* Sticky Hero for parallax effect (only on md+ screens to avoid mobile overlap) */}
      <div className="relative md:sticky top-0 md:top-20 z-0 md:h-[80vh] md:min-h-[600px]">
        <Hero />
      </div>
      
      {/* Content that slides over the Hero */}
      <section className="w-full relative z-10 bg-[#1a1410] md:shadow-[0_-20px_50px_rgba(0,0,0,0.5)]">
        <CategoryCoverGrid />
      </section>
    </div>
  );
};

export default Home;
