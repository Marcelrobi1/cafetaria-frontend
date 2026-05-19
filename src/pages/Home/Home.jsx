import Hero from '../../components/Homepage/Hero/Hero';
import Features from '../../components/Homepage/Features/Features';
import About from '../../components/Homepage/About/About';
import MenuHighlights from '../../components/Homepage/MenuHighlights/MenuHighlights';
import BestSellers from '../../components/Homepage/BestSellers/BestSellers';
import Footer from '../../components/Footer/Footer';

function Home() {
  return (
    <div>
      <Hero />
      <Features />
      <About />
      <MenuHighlights />
      <BestSellers />
      <Footer />
    </div>
  );
}

export default Home;