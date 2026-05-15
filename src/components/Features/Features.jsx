
import './Features.css';

function Features() {
  return (
    <section className="features-section">
      <div className="feature-box">
        <span className="feature-icon">✨</span>
        <h3>Torra de autor</h3>
        <p>Desenhamos o perfil de cada grão com uma torrefação lenta e precisa, desenhada para despertar notas sensoriais únicas em cada chávena.</p>
      </div>
      
      <div className="feature-box">
        <span className="feature-icon">🌱</span>
        <h3>Raízes Transparentes</h3>
        <p>Rastreamos a origem. Trabalhamos em colaboração direta com pequenos produtores que respeitam a terra e a sustentabilidade do café.</p>
      </div>
      
      <div className="feature-box">
        <span className="feature-icon">🤲</span>
        <h3>Estética do Cuidado</h3>
        <p>O detalhe é a essência que nos guia. Cada momento do nosso serviço na Cafetaria é pensado para nutrir os teus sentidos e o teu bem-estar.</p>
      </div>
    </section>
  );
}

export default Features;