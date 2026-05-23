import { useState, useEffect } from 'react';
import './GestaoUtilizadores.css'; // Vamos criar este ficheiro no próximo passo

function GestaoUtilizadores() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Estados para o Modal (Formulário)
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

  // --- MÉTODOS DA API ---
  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${BASE_URL}/users`, {
        headers: { 'Authorization': `Bearer ${token}` }
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
    if (!window.confirm(`Tem a certeza que quer apagar o utilizador ${username}?`)) return;
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${BASE_URL}/users/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Erro ao apagar utilizador.');
      setUsers(users.filter(user => user.id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const url = editingUser ? `${BASE_URL}/users/${editingUser.id}` : `${BASE_URL}/users`;
    const method = editingUser ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          balance: parseFloat(formData.balance)
        })
      });

      if (!response.ok) throw new Error(`Erro ao ${editingUser ? 'atualizar' : 'criar'} utilizador.`);
      fetchUsers();
      closeModal();
    } catch (err) {
      alert(err.message);
    }
  };

  // --- CONTROLADORES DO MODAL ---
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
      balance: user.balance
    });
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  // --- RENDER ---
  if (loading) return <p>A carregar utilizadores da API...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div className="gestao-container">
      <div className="gestao-header">
        <h2>Gestão de Utilizadores</h2>
        <button className="add-btn" onClick={openAddModal}>➕ Novo Utilizador</button>
      </div>
      
      <table className="data-table">
        <thead>
          <tr>
            <th>Username</th>
            <th>Tipo</th>
            <th>Saldo</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.username}</td>
              <td>{user.type}</td>
              <td>{user.balance ? `${user.balance}€` : '0.00€'}</td>
              <td className="actions-cell">
                <button className="edit-btn" onClick={() => openEditModal(user)}>Editar</button>
                <button className="delete-btn" onClick={() => handleDelete(user.id, user.username)}>
                  Apagar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* MODAL */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>{editingUser ? 'Editar Utilizador' : 'Novo Utilizador'}</h2>
            <form onSubmit={handleSubmit} className="modal-form">
              <label>
                Username:
                <input type="text" required value={formData.username} onChange={(e) => setFormData({...formData, username: e.target.value})} />
              </label>
              <label>
                Password {editingUser && '(Deixe em branco para manter)'}:
                <input type="password" required={!editingUser} value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} />
              </label>
              <label>
                Tipo:
                <select value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})}>
                  <option value="CLIENT">Client</option>
                  <option value="EMPLOYEE">Employee</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </label>
              <label>
                Saldo (€):
                <input type="number" step="0.01" required value={formData.balance} onChange={(e) => setFormData({...formData, balance: e.target.value})} />
              </label>
              <div className="modal-actions">
                <button type="button" className="cancel-btn" onClick={closeModal}>Cancelar</button>
                <button type="submit" className="save-btn">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default GestaoUtilizadores;