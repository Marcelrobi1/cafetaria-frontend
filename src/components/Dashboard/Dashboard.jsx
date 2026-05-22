// src/components/Dashboard/Dashboard.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

function Dashboard() {
  const navigate = useNavigate();
  // Estado para controlar qual separador está ativo (Utilizadores ou Produtos)
  const [activeTab, setActiveTab] = useState('users');

  return (
    <div className="dashboard-container">
      {/* PAINEL LATERAL (SIDEBAR) */}
      <aside className="dashboard-sidebar">
        <div className="sidebar-header">
          <h2>Painel de Gestão</h2>
        </div>
        <nav className="sidebar-nav">
          <button 
            className={`sidebar-btn ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            👥 Gerir Utilizadores
          </button>
          <button 
            className={`sidebar-btn ${activeTab === 'products' ? 'active' : ''}`}
            onClick={() => setActiveTab('products')}
          >
            ☕ Gerir Menu / Produtos
          </button>
        </nav>
        <div className="sidebar-footer">
          <button className="back-home-btn" onClick={() => navigate('/')}>
            &larr; Voltar à Loja
          </button>
        </div>
      </aside>

      {/* ÁREA PRINCIPAL */}
      <main className="dashboard-main">
        <header className="dashboard-header">
          <h1>{activeTab === 'users' ? 'Gestão de Utilizadores' : 'Gestão do Menu'}</h1>
        </header>
        
        <div className="dashboard-content">
          {activeTab === 'users' && (
            <div className="tab-content">
              <p>Aqui vamos listar os utilizadores da API e permitir alterar saldos/cargos.</p>
              {/* O componente da tabela de utilizadores virá para aqui */}
            </div>
          )}

          {activeTab === 'products' && (
            <div className="tab-content">
              <p>Aqui vamos listar os produtos e permitir adicionar novos cafés/pratos.</p>
              {/* O componente da tabela de produtos virá para aqui */}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default Dashboard;