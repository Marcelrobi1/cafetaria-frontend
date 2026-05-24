import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Auth.css';

function Auth({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const BASE_URL = 'https://siws.ufp.pt/lwlc/api';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    if (!username || !password) {
      setError('Por favor, preencha todos os campos.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const textResponse = await response.text();
      let data = {};
      if (textResponse) {
        try { data = JSON.parse(textResponse); } catch (e) { console.error(e); }
      }

      if (!response.ok) {
        throw new Error(data.error || data.message || 'Credenciais inválidas. Verifique os seus dados.');
      }

      // Guardamos los datos de sesión
      localStorage.setItem('token', data.token);
      localStorage.setItem('username', data.username);
      localStorage.setItem('role', data.role);
      localStorage.setItem('userType', data.type || data.role); // Safeguard de tipo

      setMessage('Sessão iniciada com sucesso!');
      if (onLoginSuccess) onLoginSuccess(data);

      // Redireccionamos al cliente directo al catálogo
      navigate('/menu');

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-container">
      {/* Botón para regresar sin iniciar sesión */}
      <button className="auth-back-btn" onClick={() => navigate('/')}>
        ← Voltar ao Início
      </button>

      <div className="auth-card">
        <div className="auth-image-side">
          <img 
            src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
            alt="Early Cafetaria" 
          />
          <div className="auth-image-overlay">
            <p>"O seu ritual diário começa aqui."</p>
          </div>
        </div>

        <div className="auth-form-side">
          <h2>Bem-vindo de Volta</h2>
          <p className="auth-subtitle">
            Aceda à sua conta para gerir as suas reservas e descobrir a nossa curadoria de especialidade.
          </p>

          {error && <div className="auth-status-error">{error}</div>}
          {message && <div className="auth-status-success">{message}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>NOME DE UTILIZADOR</label>
              <input 
                type="text" 
                placeholder="O seu nome de utilizador" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <div className="label-row">
                <label>PALAVRA-PASSE</label>
              </div>
              <input 
                type="password" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="auth-submit-btn" disabled={loading}>
              {loading ? 'A INICIAR SESSÃO...' : 'INICIAR SESSÃO'}
            </button>
          </form>

          {/* Enlace directo a la página de Registro que creamos anteriormente */}
          <div className="auth-footer">
            <p>Ainda não faz parte da Early? <Link to="/register" className="auth-register-link">Registe-se agora</Link></p>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Auth;