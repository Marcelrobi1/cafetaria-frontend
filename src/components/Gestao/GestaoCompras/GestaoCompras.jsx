import { useState, useEffect } from 'react';
import './GestaoCompras.css';

function GestaoCompras() {
  const [vistaActual, setVistaActual] = useState('lista');
  const [compras, setCompras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erroValidacao, setErroValidacao] = useState('');

  // Estados para el Formulario de Edición
  const [editingId, setEditingId] = useState(null);
  const [clientUsername, setClientUsername] = useState('');
  const [dishName, setDishName] = useState('');
  const [dataReserva, setDataReserva] = useState('');

  const BASE_URL = 'https://siws.ufp.pt/lwlc/api';

  useEffect(() => {
    fetchCompras();
  }, []);

  const getAuthHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  });

  const fetchCompras = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/purchases`, {
        headers: getAuthHeaders()
      });

      if (response.ok) {
        const data = await response.json();
        // Ordenamos por fecha de reserva (las más próximas primero)
        const comprasOrdenadas = data.sort((a, b) => new Date(a.date) - new Date(b.date));
        setCompras(comprasOrdenadas);
      } else {
        setErroValidacao('Não foi possível carregar o histórico de reservas.');
      }
    } catch (error) {
      setErroValidacao('Erro de conexão ao servidor.');
    } finally {
      setLoading(false);
    }
  };

  // --- LÓGICA DE EDICIÓN (PUT) ---
  const handleSubmitEdicao = async (e) => {
    e.preventDefault();
    setErroValidacao('');

    const payload = {
      clientUsername: clientUsername,
      dishName: dishName,
      date: dataReserva // Formato YYYY-MM-DD
    };

    try {
      const response = await fetch(`${BASE_URL}/purchases/${editingId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Erro ao atualizar a reserva.');
      }

      fetchCompras();
      resetForm();
    } catch (error) {
      setErroValidacao(error.message || 'Erro de comunicação com o servidor.');
    }
  };

  // --- LÓGICA DE ELIMINACIÓN (DELETE) ---
  const handleDelete = async (id) => {
    if (!window.confirm("Tem a certeza que deseja cancelar e apagar esta reserva?")) return;

    try {
      const response = await fetch(`${BASE_URL}/purchases/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });

      if (response.ok || response.status === 204) {
        setCompras(compras.filter(c => c.id !== id));
      } else {
        alert("Não foi possível eliminar a reserva.");
      }
    } catch (error) {
      alert("Erro ao comunicar com o servidor.");
    }
  };

  // Funciones de navegación internas
  const iniciarEdicao = (compra) => {
    setEditingId(compra.id);
    setClientUsername(compra.clientUsername);
    setDishName(compra.dishName);
    
    // Convertimos la fecha al formato que necesita el <input type="date"> (YYYY-MM-DD)
    if (compra.date) {
      const dateObj = new Date(compra.date);
      const formattedDate = dateObj.toISOString().split('T')[0];
      setDataReserva(formattedDate);
    } else {
      setDataReserva('');
    }
    
    setVistaActual('formulario');
  };

  const resetForm = () => {
    setEditingId(null);
    setClientUsername('');
    setDishName('');
    setDataReserva('');
    setErroValidacao('');
    setVistaActual('lista');
  };

  const formatarData = (dataString) => {
    if (!dataString) return 'N/A';
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-PT', { 
      weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' 
    });
  };

  // --- VERIFICACIÓN DE SEGURIDAD (RBAC) ---
  const userType = localStorage.getItem('userType');

  if (userType !== 'ADMIN') {
    return (
      <div className="gestao-pratos-container">
        <div className="admin-header">
          <div>
            <h2>Reservas de Pratos</h2>
            <p>Listagem de compras e reservas agendadas pelos clientes.</p>
          </div>
        </div>
        
        <div className="table-card" style={{ textAlign: 'center', padding: '60px 20px' }}>
          <div style={{ fontSize: '4rem', marginBottom: '15px' }}>🛡️</div>
          <h2 style={{ color: '#0b2b40', fontFamily: 'Georgia, serif' }}>Acesso Confidencial</h2>
          <p style={{ color: '#555', marginTop: '10px', fontSize: '1.1rem', maxWidth: '500px', margin: '10px auto 0' }}>
            Apenas utilizadores com privilégios de <strong>Administrador</strong> podem visualizar o fluxo de caixa e o histórico global de reservas.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="gestao-pratos-container">
      {vistaActual === 'lista' && (
        <>
          <div className="admin-header">
            <div>
              <h2>Reservas de Pratos</h2>
              <p>Gestão de compras e reservas agendadas.</p>
            </div>
            <button className="btn-add-primary" onClick={fetchCompras}>
              ↻ ATUALIZAR LISTA
            </button>
          </div>

          {erroValidacao && <div className="error-message" style={{color: '#d9534f', marginBottom: '15px'}}>{erroValidacao}</div>}

          <div className="table-card">
            {loading ? (
              <p className="loading-text" style={{padding: '20px'}}>A carregar os dados do servidor...</p>
            ) : (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID DA COMPRA</th>
                    <th>CLIENTE</th>
                    <th>PRATO RESERVADO</th>
                    <th>DATA AGENDADA</th>
                    <th>AÇÕES</th>
                  </tr>
                </thead>
                <tbody>
                  {compras.length === 0 ? (
                    <tr><td colSpan="5" style={{ textAlign: 'center', padding: '30px' }}>Nenhuma reserva encontrada no sistema.</td></tr>
                  ) : (
                    compras.map((compra) => (
                      <tr key={compra.id}>
                        <td style={{ fontFamily: 'monospace', color: '#888', fontSize: '0.85rem' }}>
                          {compra.id.substring(0, 8)}...
                        </td>
                        <td style={{ fontWeight: 'bold', color: '#0b2b40' }}>
                          @{compra.clientUsername}
                        </td>
                        <td>
                          <span className="admin-tag" style={{ background: '#f4f1ee', color: '#8c7355' }}>
                            {compra.dishName}
                          </span>
                        </td>
                        <td style={{ fontWeight: 'bold', color: '#333' }}>
                          {formatarData(compra.date)}
                        </td>
                        <td className="actions-cell">
                          <button className="action-icon edit" onClick={() => iniciarEdicao(compra)} title="Editar Reserva">✏️</button>
                          <button className="action-icon delete" onClick={() => handleDelete(compra.id)} title="Cancelar Reserva">🗑️</button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}

      {vistaActual === 'formulario' && (
        <>
          <div className="admin-header center-header">
            <h2>Modificar Reserva</h2>
            <p>Altere a data ou o prato associado a esta encomenda.</p>
          </div>

          <div className="form-card-centered">
            <form onSubmit={handleSubmitEdicao} className="admin-form">
              
              <div className="form-group">
                <label>Username do Cliente</label>
                <input 
                  type="text" 
                  value={clientUsername} 
                  onChange={(e) => setClientUsername(e.target.value)} 
                  required 
                  /* Lo dejamos editable en caso de que el admin necesite reasignar la compra, 
                     o puedes poner readOnly={true} si el username no debe cambiar */
                />
              </div>

              <div className="form-group form-grid-2">
                <div>
                  <label>Prato Reservado</label>
                  <input 
                    type="text" 
                    value={dishName} 
                    onChange={(e) => setDishName(e.target.value)} 
                    placeholder="Ex: Tarte de Maçã"
                    required 
                  />
                </div>
                <div>
                  <label>Data da Reserva</label>
                  <input 
                    type="date" 
                    value={dataReserva} 
                    onChange={(e) => setDataReserva(e.target.value)} 
                    required 
                  />
                </div>
              </div>

              {erroValidacao && <span className="error-text" style={{color: '#d9534f', display: 'block', marginTop: '10px'}}>{erroValidacao}</span>}

              <div className="form-footer">
                <button type="button" className="btn-text" onClick={resetForm}>CANCELAR</button>
                <button type="submit" className="btn-submit">
                  ✓ GUARDAR ALTERAÇÕES
                </button>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  );
}

export default GestaoCompras;