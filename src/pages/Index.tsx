import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import ServicesSection from '@/components/ServicesSection';
import VehiclesSection from '@/components/VehiclesSection';
import ContactSection from '@/components/ContactSection';
import FinancingSection from '@/components/FinancingSection';
import TrustSection from '@/components/TrustSection';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      <ServicesSection />
      <VehiclesSection />
      <FinancingSection />
      <TrustSection />
      <ContactSection />
      <Footer />
    </div>
  );
};

export default Index;
