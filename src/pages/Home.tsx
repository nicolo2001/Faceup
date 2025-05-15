import React from 'react';
import MainLayout from '../layouts/MainLayout';
import HeroSection from '../components/home/HeroSection';
import FeaturedActors from '../components/home/FeaturedActors';
import HowItWorks from '../components/home/HowItWorks';
import Testimonials from '../components/home/Testimonials';
import CallToAction from '../components/home/CallToAction';
import { actors } from '../data/mockData';

const Home: React.FC = () => {
  return (
    <MainLayout>
      <HeroSection />
      <FeaturedActors actors={actors} />
      <HowItWorks />
      <Testimonials />
      <CallToAction />
    </MainLayout>
  );
};

export default Home;