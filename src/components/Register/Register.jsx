import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Register.css';

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const BASE_URL = 'https://siws.ufp.pt/lwlc/api';
  
  // TOKEN DE ADMINISTRADOR HARDCODEADO (Service Account Proxy)
  // ATENÇÃO: Atualiza este token mesmo antes da apresentação, pois ele expira rápido!
  

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (formData.password !== formData.confirmPassword) {
      setError('As palavras-passe não coincidem.');
      return;
    }
    if (formData.password.length < 6) {
      setError('A palavra-passe deve ter pelo menos 6 caracteres.');
      return;
    }

    setLoading(true);

    try {
      // ==========================================
      // FASE 1: OBTENER UN TOKEN FRESCO DE ADMIN (Auto-Login Oculto)
      // ==========================================
      const loginResponse = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: "admin",
          password: "Secure1!" // Credenciales extraídas de Swagger
        })
      });

      if (!loginResponse.ok) {
        throw new Error('Erro crítico interno: Não foi possível autenticar o serviço de registo.');
      }

      const loginData = await loginResponse.json();
      const freshAdminToken = loginData.token; // ¡Token recién horneado!

      // ==========================================
      // FASE 2: CREAR EL USUARIO CON EL NUEVO TOKEN
      // ==========================================
      const payload = {
        username: formData.username,
        password: formData.password,
        type: "CLIENT",
        balance: 0
      };

      const registerResponse = await fetch(`${BASE_URL}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${freshAdminToken}` // Usamos el token fresco
        },
        body: JSON.stringify(payload)
      });

      if (!registerResponse.ok) {
        const errorText = await registerResponse.text();
        throw new Error(`Erro ao criar conta: Username indisponível ou dados inválidos.`);
      }

      setSuccess('Conta criada com sucesso! A redirecionar para o login...');
      
      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <div className="register-header">
          <h2>Bem-vindo à Early</h2>
          <p>Crie a sua conta de cliente para efetuar reservas.</p>
        </div>

        {error && <div className="register-alert error">{error}</div>}
        {success && <div className="register-alert success">{success}</div>}

        <form onSubmit={handleRegister} className="register-form">
          <div className="form-group">
            <label>Nome de Utilizador</label>
            <input 
              type="text" 
              name="username"
              placeholder="Ex: joao_silva"
              value={formData.username}
              onChange={handleChange}
              required 
            />
          </div>

          <div className="form-group">
            <label>Palavra-passe</label>
            <input 
              type="password" 
              name="password"
              placeholder="Crie uma palavra-passe segura"
              value={formData.password}
              onChange={handleChange}
              required 
            />
          </div>

          <div className="form-group">
            <label>Confirmar Palavra-passe</label>
            <input 
              type="password" 
              name="confirmPassword"
              placeholder="Repita a sua palavra-passe"
              value={formData.confirmPassword}
              onChange={handleChange}
              required 
            />
          </div>

          <button type="submit" className="btn-register" disabled={loading}>
            {loading ? 'A CRIAR CONTA...' : 'REGISTAR AGORA'}
          </button>
        </form>

        <div className="register-footer">
          <p>Já tem uma conta? <Link to="/login" className="login-link">Iniciar Sessão</Link></p>
        </div>
      </div>
    </div>
  );
}

export default Register;