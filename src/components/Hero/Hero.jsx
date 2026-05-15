import './Hero.css';
function Hero() {
  return (
    <section className="hero-section">
      <div className="hero-content">
        <h1>O teu ponto de<br/><em>partida no<br/>coração do Porto</em></h1>
        <p>Um refúgio de café de especialidade e cozinha honesta, desenhado para quem valoriza o ritmo calmo das manhãs no Porto.</p>
        <button className="btn-primary">COMPRAR AGORA</button>
      </div>
    </section>
  );
}

export default Hero;