import './index.css';
import Navbar from './components/navbar/navbar';
import Hero from './components/Hero/Hero';
import Features from './components/Features/features';
import About from './components/About/About';
import MenuHighlights from './components/MenuHighlights/MenuHighlights';
import BestSellers from './components/BestSellers/BestSellers';
import Footer from './components/Footer/Footer';

function App() {
  return (
    <div>
      <Navbar />
      <Hero />
      <Features />
      <About />
      <MenuHighlights />
      <BestSellers />
      <Footer />
    </div>
  );
}

export default App;