import { useState, useEffect } from 'react';
import './GestaoMenu.css';

function GestaoMenus() {
  const [vistaActual, setVistaActual] = useState('lista');
  const [menus, setMenus] = useState([]);
  const [pratos, setPratos] = useState([]); // Listado unificado de todos los platos reales
  const [loading, setLoading] = useState(true);
  
  // Estados del Formulario
  const [editingId, setEditingId] = useState(null);
  const [dataMenu, setDataMenu] = useState('');
  const [meatDish, setMeatDish] = useState('');
  const [fishDish, setFishDish] = useState('');
  const [vegDish, setVegDish] = useState('');
  const [erroValidacao, setErroValidacao] = useState('');

  const BASE_URL = 'https://siws.ufp.pt/lwlc/api';

  useEffect(() => {
    fetchDadosIniciais();
  }, []);

  const getAuthHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  });

  const fetchDadosIniciais = async () => {
    setLoading(true);
    try {
      // Descargamos los menús planeados y los platos registrados
      const [resMenus, resPratos] = await Promise.all([
        fetch(`${BASE_URL}/menus`, { headers: getAuthHeaders() }),
        fetch(`${BASE_URL}/dishes`, { headers: getAuthHeaders() })
      ]);

      if (resMenus.ok && resPratos.ok) {
        const menusData = await resMenus.json();
        const pratosData = await resPratos.json();
        
        // Ordenamos cronológicamente los menús por fecha
        setMenus(menusData.sort((a, b) => new Date(a.date) - new Date(b.date)));
        
        // Guardamos todos los platos del servidor sin filtros restrictivos
        setPratos(pratosData);
      } else {
        setErroValidacao('Erro ao carregar dados do servidor.');
      }
    } catch (error) {
      setErroValidacao('Erro de conexão ao servidor.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErroValidacao('');

    if (!dataMenu || !meatDish || !fishDish || !vegDish) {
      setErroValidacao('Por favor, preencha a data e selecione os três pratos obrigatórios.');
      return;
    }

    const payload = {
      date: dataMenu,
      meatDishName: meatDish,
      fishDishName: fishDish,
      vegetarianDishName: vegDish
    };

    try {
      const url = editingId ? `${BASE_URL}/menus/${editingId}` : `${BASE_URL}/menus`;
      const method = editingId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: getAuthHeaders(),
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorText = await response.text();
        setErroValidacao(errorText || 'Erro do servidor ao guardar o menu.');
        return;
      }

      fetchDadosIniciais(); 
      resetForm();

    } catch (error) {
      setErroValidacao('Erro de comunicação com o servidor.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Tem a certeza que deseja eliminar o menu deste dia?")) return;
    try {
      const response = await fetch(`${BASE_URL}/menus/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      if (response.ok) {
        setMenus(menus.filter(m => m.id !== id));
      } else {
        alert("Não foi possível apagar o menu.");
      }
    } catch (error) {
      alert("Erro ao comunicar com o servidor.");
    }
  };

  const iniciarCriacao = () => {
    resetForm();
    setVistaActual('formulario');
  };

  const iniciarEdicao = (menu) => {
    setEditingId(menu.id);
    setDataMenu(menu.date);
    setMeatDish(menu.meatDishName || '');
    setFishDish(menu.fishDishName || '');
    setVegDish(menu.vegetarianDishName || '');
    setVistaActual('formulario');
  };

  const resetForm = () => {
    setEditingId(null);
    setDataMenu('');
    setMeatDish('');
    setFishDish('');
    setVegDish('');
    setErroValidacao('');
    setVistaActual('lista');
  };

  const formatarData = (dataString) => {
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-PT', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <div className="gestao-pratos-container">
      {vistaActual === 'lista' && (
        <>
          <div className="admin-header">
            <div>
              <h2>Menu Diário</h2>
              <p>Planeamento do cardápio servido na cafetaria.</p>
            </div>
            <button className="btn-add-primary" onClick={iniciarCriacao}>
              + ADICIONAR NOVO MENU
            </button>
          </div>

          <div className="table-card">
            {loading ? (
              <p className="loading-text">A carregar o planeamento...</p>
            ) : (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>DATA DO MENU</th>
                    <th>OPÇÃO DE CARNE</th>
                    <th>OPÇÃO DE PEIXE</th>
                    <th>OPÇÃO VEGETARIANA</th>
                    <th>AÇÕES</th>
                  </tr>
                </thead>
                <tbody>
                  {menus.length === 0 ? (
                    <tr><td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>Nenhum menu planeado.</td></tr>
                  ) : (
                    menus.map((menu) => (
                      <tr key={menu.id}>
                        <td style={{ fontWeight: 'bold', color: '#0b2b40' }}>{formatarData(menu.date)}</td>
                        <td><span className="admin-tag" style={{ background: '#ffe8e8', color: '#d9534f' }}>{menu.meatDishName}</span></td>
                        <td><span className="admin-tag" style={{ background: '#e8f4ff', color: '#0275d8' }}>{menu.fishDishName}</span></td>
                        <td><span className="admin-tag" style={{ background: '#e8ffe8', color: '#5cb85c' }}>{menu.vegetarianDishName}</span></td>
                        <td className="actions-cell">
                          <button className="action-icon edit" onClick={() => iniciarEdicao(menu)}>✏️</button>
                          <button className="action-icon delete" onClick={() => handleDelete(menu.id)}>🗑️</button>
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
            <h2>{editingId ? 'Editar Menu' : 'Planear Novo Menu'}</h2>
            <p>Selecione a data e atribua os pratos correspondentes da lista central.</p>
          </div>

          <div className="form-card-centered">
            <form onSubmit={handleSubmit} className="admin-form">
              <div className="form-group">
                <label>Data de Serviço</label>
                <input 
                  type="date" 
                  value={dataMenu} 
                  onChange={(e) => setDataMenu(e.target.value)} 
                  required 
                />
              </div>

              <div className="form-group">
                <label>Prato de Carne</label>
                <select value={meatDish} onChange={(e) => setMeatDish(e.target.value)} required>
                  <option value="">-- Selecione un prato --</option>
                  {pratos.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
                </select>
              </div>

              <div className="form-group">
                <label>Prato de Peixe</label>
                <select value={fishDish} onChange={(e) => setFishDish(e.target.value)} required>
                  <option value="">-- Selecione un prato --</option>
                  {pratos.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
                </select>
              </div>

              <div className="form-group">
                <label>Prato Vegetariano</label>
                <select value={vegDish} onChange={(e) => setVegDish(e.target.value)} required>
                  <option value="">-- Selecione un prato --</option>
                  {pratos.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
                </select>
              </div>

              {erroValidacao && <div className="error-message" style={{color: '#d9534f', margin: '15px 0'}}>{erroValidacao}</div>}

              <div className="form-footer">
                <button type="button" className="btn-text" onClick={resetForm}>CANCELAR</button>
                <button type="submit" className="btn-submit">
                  {editingId ? '✓ GUARDAR ALTERAÇÕES' : '✓ SALVAR MENU'}
                </button>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  );
}

export default GestaoMenus;