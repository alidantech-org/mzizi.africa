'use client';
import HeroSection from '@/components/root/sections/HeroSection';
import KeyFeatures from '@/components/root/sections/KeyFeatures';
import CitizenReporting from '@/components/root/sections/CitizenReporting';
import ImpactStats from '@/components/root/sections/ImpactStats';
import Footer from '@/components/root/layout/Footer';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <KeyFeatures />
      <CitizenReporting />
      <ImpactStats />
      <Footer />
    </>
  );
}
