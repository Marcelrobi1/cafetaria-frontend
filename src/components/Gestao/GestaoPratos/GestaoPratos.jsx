import { useState, useEffect } from 'react';
import './GestaoPratos.css';

function GestaoPratos() {
  const [vistaActual, setVistaActual] = useState('lista');
  const [pratos, setPratos] = useState([]);
  const [ingredientes, setIngredientes] = useState([]); 
  const [loading, setLoading] = useState(true);
  
  // Estados del Formulario (Adaptados 100% al backend)
  const [editingId, setEditingId] = useState(null);
  const [nome, setNome] = useState('');
  const [preco, setPreco] = useState('');
  const [ingredientesSelecionados, setIngredientesSelecionados] = useState([]); // Guardará Nombres, no IDs
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
      const [resPratos, resIngredientes] = await Promise.all([
        fetch(`${BASE_URL}/dishes`, { headers: getAuthHeaders() }),
        fetch(`${BASE_URL}/ingredients`, { headers: getAuthHeaders() })
      ]);

      if (resPratos.ok && resIngredientes.ok) {
        setPratos(await resPratos.json());
        setIngredientes(await resIngredientes.json());
      } else {
        setErroValidacao('Erro ao carregar os dados do servidor.');
      }
    } catch (error) {
      setErroValidacao('Erro de conexão.');
    } finally {
      setLoading(false);
    }
  };

  // Manejamos la selección de ingredientes usando el NOMBRE
  const handleIngredientToggle = (nomeIngrediente) => {
    setIngredientesSelecionados(prev => 
      prev.includes(nomeIngrediente) 
        ? prev.filter(nome => nome !== nomeIngrediente) 
        : [...prev, nomeIngrediente]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nome.trim() || preco <= 0) {
      setErroValidacao('Por favor, preencha o nome e um preço válido.');
      return;
    }

    // PAYLOAD EXACTO DEL SERVIDOR (Sin campos extra)
    const payload = {
      name: nome,
      price: parseFloat(preco),
      ingredientNames: ingredientesSelecionados 
    };

    try {
      const url = editingId ? `${BASE_URL}/dishes/${editingId}` : `${BASE_URL}/dishes`;
      const method = editingId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: getAuthHeaders(),
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        fetchDadosIniciais(); 
        resetForm();
      } else {
        const errorData = await response.json();
        setErroValidacao(errorData.message || 'Erro ao guardar o prato no servidor.');
      }
    } catch (error) {
      setErroValidacao('Erro de comunicação.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Tem a certeza que deseja eliminar este prato?")) return;
    try {
      const response = await fetch(`${BASE_URL}/dishes/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      if (response.ok) {
        setPratos(pratos.filter(p => p.id !== id));
      } else {
        alert("Não é possível apagar. Este prato pode estar associado a um menu.");
      }
    } catch (error) {
      alert("Erro ao comunicar com o servidor.");
    }
  };

  const iniciarCriacao = () => {
    resetForm();
    setVistaActual('formulario');
  };

  const iniciarEdicao = (prato) => {
    setEditingId(prato.id);
    setNome(prato.name);
    setPreco(prato.price);
    setIngredientesSelecionados(prato.ingredientNames || []);
    setVistaActual('formulario');
  };

  const resetForm = () => {
    setEditingId(null);
    setNome('');
    setPreco('');
    setIngredientesSelecionados([]);
    setErroValidacao('');
    setVistaActual('lista');
  };

  return (
    <div className="gestao-pratos-container">
      {vistaActual === 'lista' && (
        <>
          <div className="admin-header">
            <div>
              <h2>Gestão de Pratos</h2>
              <p>Catálogo central gastronómico.</p>
            </div>
            <button className="btn-add-primary" onClick={iniciarCriacao}>
              + ADICIONAR NOVO ITEM
            </button>
          </div>

          <div className="table-card">
            {loading ? (
              <p className="loading-text">A carregar o catálogo...</p>
            ) : (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ITEM</th>
                    <th>INGREDIENTES BASE</th>
                    <th>PREÇO</th>
                    <th>AÇÕES</th>
                  </tr>
                </thead>
                <tbody>
                  {pratos.length === 0 ? (
                    <tr><td colSpan="4" style={{ textAlign: 'center', padding: '20px' }}>Nenhum prato encontrado.</td></tr>
                  ) : (
                    pratos.map((prato) => (
                      <tr key={prato.id}>
                        <td className="item-cell">
                          <img 
                            src={prato.imageUrl || 'https://images.unsplash.com/photo-1495147466023-ac5c588e2e94?w=100&q=80'} 
                            alt={prato.name} 
                            className="item-thumbnail" 
                          />
                          <div className="item-details">
                            <span className="item-name">{prato.name}</span>
                            <span className="item-id">ID: {prato.id.substring(0,8)}...</span>
                          </div>
                        </td>
                        <td>
                          <div className="tags-container">
                            {prato.ingredientNames?.length > 0 ? (
                              <>
                                {prato.ingredientNames.slice(0,2).map((ing, idx) => (
                                  <span key={idx} className="admin-tag">{ing}</span>
                                ))}
                                {prato.ingredientNames.length > 2 && (
                                  <span className="admin-tag">+{prato.ingredientNames.length - 2}</span>
                                )}
                              </>
                            ) : (
                              <span style={{color: '#aaa', fontSize: '0.8rem'}}>Sem ingredientes</span>
                            )}
                          </div>
                        </td>
                        <td className="item-price">{prato.price ? prato.price.toFixed(2) : '0.00'} €</td>
                        <td className="actions-cell">
                          <button className="action-icon edit" onClick={() => iniciarEdicao(prato)}>✏️</button>
                          <button className="action-icon delete" onClick={() => handleDelete(prato.id)}>🗑️</button>
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
            <h2>{editingId ? 'Editar Prato' : 'Adicionar Novo Prato'}</h2>
            <p>Construa a receita selecionando os ingredientes disponíveis.</p>
          </div>

          <div className="form-card-centered">
            <form onSubmit={handleSubmit} className="admin-form">
              <div className="form-group">
                <label>Nome do Prato</label>
                <input 
                  type="text" 
                  value={nome} 
                  onChange={(e) => setNome(e.target.value)} 
                  placeholder="Ex: Tosta de Abacate" 
                  required 
                />
              </div>

              <div className="form-group">
                <label>Composição (Selecione os Ingredientes do Catálogo)</label>
                <div className="ingredients-selector">
                  {ingredientes.length > 0 ? (
                    ingredientes.map(ing => (
                      <label key={ing.id} className="checkbox-label">
                        <input 
                          type="checkbox" 
                          // Ahora comprobamos si el NOMBRE está en el array
                          checked={ingredientesSelecionados.includes(ing.name)}
                          onChange={() => handleIngredientToggle(ing.name)}
                        />
                        {ing.name}
                      </label>
                    ))
                  ) : (
                    <p style={{fontSize: '0.8rem', color: '#888'}}>Nenhum ingrediente cadastrado no servidor.</p>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label>Preço (€)</label>
                <input 
                  type="number" 
                  step="0.01" 
                  min="0.1"
                  value={preco} 
                  onChange={(e) => setPreco(e.target.value)} 
                  placeholder="0.00" 
                  required 
                />
              </div>

              {/* Se eliminó el toggle de disponibilidad porque el backend no lo soporta */}

              <div className="form-group">
                <label>Imagem do Item</label>
                <div className="image-upload-zone">
                  <span className="upload-icon">🖼️</span>
                  <p>O upload de imagens requer integração com Amazon S3 / Minio.</p>
                  <span className="upload-hint">Funcionalidade a ser ativada posteriormente.</span>
                </div>
              </div>

              {erroValidacao && <div className="error-message" style={{color: 'red', marginTop: '10px'}}>{erroValidacao}</div>}

              <div className="form-footer">
                <button type="button" className="btn-text" onClick={resetForm}>CANCELAR</button>
                <button type="submit" className="btn-submit">
                  {editingId ? '✓ GUARDAR ALTERAÇÕES' : '✓ CRIAR PRATO'}
                </button>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  );
}

export default GestaoPratos;