import './About.css';

function About() {
  return (
    <section className="about-section">
      <div className="about-container">
        {/* Lado izquierdo: Imagen */}
        <div className="about-image">
          <img 
            src="src\assets\652837157_18096069416083341_6200878973332390481_n.jpg" 
            alt="Café Especialidade" 
          />
        </div>

        {/* Lado derecho: Texto */}
        <div className="about-content">
          <span className="subtitle">NOSSA IDENTIDADE</span>
          <h2>Simples. Orgânico.<br /><em>Early.</em></h2>
          <p>
            Em Cafetaria, acreditamos que a beleza reside na essência. O Early é o 
            resultado da nossa paixão pela chávena perfeita e pelo ambiente sereno. 
            Focamo-nos na honestidade dos ingredientes e na calma do espaço para que 
            o teu quotidiano ganhe uma nova textura.
          </p>
        </div>
      </div>
    </section>
  );
}

export default About;