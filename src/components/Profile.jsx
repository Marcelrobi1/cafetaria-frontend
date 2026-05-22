// src/components/Profile/Profile.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // <-- IMPORTAÇÃO DO ROUTER
import './Profile.css';

function Profile() {
  const navigate = useNavigate(); // <-- INICIALIZA O NAVIGATE
  const [userData, setUserData] = useState(null);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const BASE_URL = 'https://siws.ufp.pt/lwlc/api';
  const token = localStorage.getItem('token');

  // 1. Carregar os dados atuais do utilizador
  useEffect(() => {
    const fetchUserData = async () => {
      if (!token) {
        // Se não houver token, redireciona logo para a página inicial ou login
        navigate('/');
        return;
      }

      try {
        const response = await fetch(`${BASE_URL}/users/me`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Não foi possível carregar os dados do perfil.');
        }

        const data = await response.json();
        setUserData(data);
        setBalance(data.balance || 0);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [token, navigate]);

  // 2. Atualizar os dados do utilizador
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!password) {
      setError('A palavra-passe é obrigatória para guardar as alterações.');
      return;
    }

    if (confirmPassword && password !== confirmPassword) {
      setError('As palavras-passe não coincidem.');
      return;
    }

    try {
      const payload = {
        username: userData.username, 
        password: password, 
        type: userData.type,
        balance: parseFloat(balance)
      };

      const response = await fetch(`${BASE_URL}/users/me`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const textResponse = await response.text();
      let data = {};
      if (textResponse) {
        try { data = JSON.parse(textResponse); } catch (err) { console.error(err); }
      }

      if (!response.ok) {
        throw new Error(data.message || data.error || 'Erro ao atualizar o perfil. Verifique os dados.');
      }

      setSuccess('Perfil atualizado com sucesso!');
      setUserData(data);
      setPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div className="profile-loading">A carregar curadoria Early...</div>;

  const formatRole = (type) => {
    if (type === 'ADMIN') return 'GERENTE DE LOJA';
    if (type === 'EMPLOYEE') return 'BARISTA JUNIOR';
    return 'CLIENTE FREQUENTE';
  };

  return (
    <div className="profile-page-container">
      <div className="profile-header-nav">
        {/* <-- USAR O NAVIGATE PARA VOLTAR À HOME --> */}
        <button className="profile-back-btn" onClick={() => navigate('/')}>
          &larr; Voltar ao Início
        </button>
      </div>

      <div className="profile-main-card">
        {/* Painel Esquerdo */}
        <div className="profile-left-panel">
          <div className="profile-avatar-wrapper">
            <div className="profile-avatar-box">
              👤
              <div className="avatar-edit-badge">✏️</div>
            </div>
          </div>
          <h2 className="profile-user-title">{userData?.username}</h2>
          <span className="profile-role-badge">{formatRole(userData?.type)}</span>
          
          <div className="profile-extra-meta">
            <p>💳 Saldo em Conta: <strong>€{userData?.balance?.toFixed(2)}</strong></p>
            <p>🆔 ID: {userData?.id?.substring(0, 8)}...</p>
          </div>
        </div>

        {/* Painel Direito */}
        <div className="profile-right-panel">
          <h3>INFORMAÇÕES PESSOAIS</h3>
          <p className="profile-section-subtitle">GERAL DA SUA CONTA E CRÉDITO</p>

          {error && <div className="profile-status-error">{error}</div>}
          {success && <div className="profile-status-success">{success}</div>}

          <form onSubmit={handleUpdateProfile}>
            <div className="profile-form-grid">
              <div className="profile-form-group">
                <label>NOME DE UTILIZADOR (NÃO EDITÁVEL)</label>
                <input type="text" value={userData?.username || ''} disabled className="disabled-input" />
              </div>

              <div className="profile-form-group">
                <label>SALDO DA CONTA (€)</label>
                <input 
                  type="number" 
                  step="0.01" 
                  value={balance} 
                  onChange={(e) => setBalance(e.target.value)} 
                  required 
                />
              </div>

              <div className="profile-form-group">
                <label>PALAVRA-PASSE (ATUAL OU NOVA)</label>
                <input 
                  type="password" 
                  placeholder="Obrigatório para guardar alterações" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="profile-form-group">
                <label>CONFIRMAR PALAVRA-PASSE</label>
                <input 
                  type="password" 
                  placeholder="Confirme apenas se digitou uma nova" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="profile-action-row">
              <button type="submit" className="profile-save-btn">GUARDAR ALTERAÇÕES</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Profile;