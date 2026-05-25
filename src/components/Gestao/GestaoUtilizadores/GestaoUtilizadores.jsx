import { useState, useEffect } from 'react';
import './GestaoUtilizadores.css'; 

function GestaoUtilizadores() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    type: 'CLIENT',
    balance: 0
  });

  const BASE_URL = 'https://siws.ufp.pt/lwlc/api';

  useEffect(() => {
    fetchUsers();
  }, []);

  const getAuthHeaders = () => ({
    'Authorization': `Bearer ${localStorage.getItem('token')}`,
    'Content-Type': 'application/json'
  });

  // Metodos da API
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/users`, {
        headers: getAuthHeaders()
      });
      if (!response.ok) throw new Error('Erro ao carregar os utilizadores.');
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, username) => {
    if (!window.confirm(`Atenção: Tem a certeza que quer apagar permanentemente o utilizador "${username}"?`)) return;
    try {
      const response = await fetch(`${BASE_URL}/users/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      if (!response.ok) throw new Error('Erro ao apagar utilizador.');
      setUsers(users.filter(user => user.id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = editingUser ? `${BASE_URL}/users/${editingUser.id}` : `${BASE_URL}/users`;
    const method = editingUser ? 'PUT' : 'POST';

    // Se estivermos a editar e a password estiver em branco nao sera enviada na payload.
    const payload = {
      username: formData.username,
      type: formData.type,
      balance: parseFloat(formData.balance)
    };

    if (!editingUser || formData.password.trim() !== '') {
      payload.password = formData.password;
    }

    try {
      const response = await fetch(url, {
        method: method,
        headers: getAuthHeaders(),
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erro do servidor: ${errorText}`);
      }
      
      fetchUsers();
      closeModal();
    } catch (err) {
      alert(err.message);
    }
  };

  const openAddModal = () => {
    setEditingUser(null);
    setFormData({ username: '', password: '', type: 'CLIENT', balance: 0 });
    setIsModalOpen(true);
  };

  const openEditModal = (user) => {
    setEditingUser(user);
    setFormData({
      username: user.username,
      password: '', 
      type: user.type,
      balance: user.balance || 0
    });
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  // Funções de renderização visual
  const getRoleBadge = (type) => {
    switch(type) {
      case 'ADMIN': return <span className="role-badge role-admin">Administrador</span>;
      case 'EMPLOYEE': return <span className="role-badge role-employee">Funcionário</span>;
      case 'CLIENT': return <span className="role-badge role-client">Cliente</span>;
      default: return <span className="role-badge role-client">{type}</span>;
    }
  };

  const userType = localStorage.getItem('userType');

  if (userType !== 'ADMIN') {
    return (
      <div className="gestao-pratos-container">
        <div className="admin-header">
          <div>
            <h2>Gestão de Utilizadores</h2>
            <p>Controlo de acessos, funcionários e saldo de clientes da Early.</p>
          </div>
        </div>
        
        <div className="table-card" style={{ textAlign: 'center', padding: '60px 20px' }}>
          <div style={{ fontSize: '4rem', marginBottom: '15px' }}>🔒</div>
          <h2 style={{ color: '#0b2b40', fontFamily: 'Georgia, serif' }}>Acesso Restrito</h2>
          <p style={{ color: '#555', marginTop: '10px', fontSize: '1.1rem', maxWidth: '500px', margin: '10px auto 0' }}>
            A sua conta atual tem permissões de <strong>{userType === 'EMPLOYEE' ? 'Funcionário' : 'Empregado'}</strong>. 
            Esta funcionalidade é estritamente reservada para a Gerência.
          </p>
          <button 
            className="btn-outline-small" 
            style={{ marginTop: '25px' }}
            onClick={() => window.history.back()}
          >
            ← Voltar à página anterior
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="gestao-pratos-container">
      <div className="admin-header">
        <div>
          <h2>Gestão de Utilizadores</h2>
          <p>Controlo de acessos, funcionários e saldo de clientes da Early.</p>
        </div>
        <button className="btn-add-primary" onClick={openAddModal}>
          + NOVO UTILIZADOR
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="table-card">
        {loading ? (
          <p className="loading-text">A carregar os utilizadores do sistema...</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>USERNAME</th>
                <th>TIPO DE CONTA</th>
                <th>SALDO DISPONÍVEL</th>
                <th>AÇÕES</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr><td colSpan="4" style={{ textAlign: 'center', padding: '30px' }}>Nenhum utilizador encontrado.</td></tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id}>
                    <td style={{ fontWeight: 'bold', color: '#0b2b40' }}>@{user.username}</td>
                    <td>{getRoleBadge(user.type)}</td>
                    <td style={{ fontWeight: 'bold', color: '#137333' }}>
                      {user.balance ? user.balance.toFixed(2) : '0.00'} €
                    </td>
                    <td className="actions-cell">
                      <button 
                        className="action-icon edit" 
                        onClick={() => openEditModal(user)}
                        title="Editar Utilizador"
                      >
                        ✏️
                      </button>
                      <button 
                        className="action-icon delete" 
                        onClick={() => handleDelete(user.id, user.username)}
                        title="Apagar Utilizador"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content users-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingUser ? 'Editar Perfil' : 'Criar Nova Conta'}</h2>
              <button className="close-btn" onClick={closeModal}>✕</button>
            </div>
            
            <form onSubmit={handleSubmit} className="modal-form-body">
              <div className="form-group">
                <label>Nome de Utilizador</label>
                <input 
                  type="text" 
                  required 
                  placeholder="ex: joao_silva"
                  className="form-input"
                  value={formData.username} 
                  onChange={(e) => setFormData({...formData, username: e.target.value})} 
                />
              </div>

              <div className="form-group">
                <label>Password {editingUser && <span style={{fontSize: '0.8rem', color: '#888'}}>(Deixe em branco para não alterar)</span>}</label>
                <input 
                  type="password" 
                  required={!editingUser} 
                  placeholder={editingUser ? "••••••••" : "Insira uma palavra-passe segura"}
                  className="form-input"
                  value={formData.password} 
                  onChange={(e) => setFormData({...formData, password: e.target.value})} 
                />
              </div>

              <div className="form-group-row">
                <div className="form-group half">
                  <label>Tipo de Permissão</label>
                  <select 
                    className="form-input"
                    value={formData.type} 
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                  >
                    <option value="CLIENT">Cliente</option>
                    <option value="EMPLOYEE">Funcionário</option>
                    <option value="ADMIN">Administrador</option>
                  </select>
                </div>

                <div className="form-group half">
                  <label>Saldo Inicial (€)</label>
                  <input 
                    type="number" 
                    step="0.01" 
                    min="0"
                    required 
                    className="form-input"
                    value={formData.balance} 
                    onChange={(e) => setFormData({...formData, balance: e.target.value})} 
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn-cancel" onClick={closeModal}>Cancelar</button>
                <button type="submit" className="btn-save">
                  {editingUser ? 'Atualizar Utilizador' : 'Criar Conta'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default GestaoUtilizadores;