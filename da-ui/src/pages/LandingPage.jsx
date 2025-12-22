import { useEffect } from 'react';
import SEO from '../components/layout/SEO';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import HeroSection from '../components/landing/HeroSection';
import AboutSection from '../components/landing/AboutSection';
import StacksSection from '../components/landing/StacksSection.jsx';
import ProjectsSection from '../components/landing/ProjectsSection';
import ContactSection from '../components/landing/ContactSection';

const LandingPage = () => {
  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';

    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, []);

  return (
    <>
      <SEO
        title="Daniel Alípio - Dev Full Stack"
        description="Full Stack Developer especializado em arquiteturas escaláveis. Fundador de empresas SaaS e criador de soluções tecnológicas inovadoras. Batatais, SP."
        keywords="daniel alipio, full stack developer, saas founder, react developer, node.js, mongodb, redis, desenvolvedor web, batatais sp, desenvolvimento web"
        author="Daniel Alípio"
        url="https://danielalipio.me"
        image="https://danielalipio.me/og-image.jpg"
      />

      <div className="min-h-screen bg-black text-white antialiased">
        <Header />
        <HeroSection />
        <AboutSection />
        <StacksSection />
        <ProjectsSection />
        <ContactSection />
        <Footer />
      </div>
    </>
  );
};

export default LandingPage;


