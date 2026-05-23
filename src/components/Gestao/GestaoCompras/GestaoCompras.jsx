import { useState, useEffect } from 'react';
import './GestaoCompras.css';

function GestaoCompras() {
  const [compras, setCompras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erroValidacao, setErroValidacao] = useState('');

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

  const formatarData = (dataString) => {
    if (!dataString) return 'N/A';
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-PT', { 
      weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' 
    });
  };

  return (
    <div className="gestao-pratos-container">
      <div className="admin-header">
        <div>
          <h2>Reservas de Pratos</h2>
          <p>Listagem de compras e reservas agendadas pelos clientes.</p>
        </div>
        <button className="btn-add-primary" onClick={fetchCompras}>
          ↻ ATUALIZAR LISTA
        </button>
      </div>

      {erroValidacao && <div className="error-message">{erroValidacao}</div>}

      <div className="table-card">
        {loading ? (
          <p className="loading-text">A carregar os dados do servidor...</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID DA COMPRA</th>
                <th>CLIENTE (USERNAME)</th>
                <th>PRATO RESERVADO</th>
                <th>DATA AGENDADA</th>
              </tr>
            </thead>
            <tbody>
              {compras.length === 0 ? (
                <tr><td colSpan="4" style={{ textAlign: 'center', padding: '30px' }}>Nenhuma reserva encontrada no sistema.</td></tr>
              ) : (
                compras.map((compra) => (
                  <tr key={compra.id}>
                    <td style={{ fontFamily: 'monospace', color: '#888', fontSize: '0.85rem' }}>
                      {compra.id}
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
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default GestaoCompras;