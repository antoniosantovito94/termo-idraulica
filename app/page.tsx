import Navbar from "@/app/components/landing/Navbar";
import HeroSection from "@/app/components/landing/HeroSection";
import ServicesSection from "@/app/components/landing/ServicesSection";
import BenefitsSection from "@/app/components/landing/BenefitsSection";
import CtaSection from "@/app/components/landing/CtaSection";
import Footer from "@/app/components/landing/Footer";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <ServicesSection />
        <BenefitsSection />
        <CtaSection />
      </main>
      <Footer />
    </>
  );
}
