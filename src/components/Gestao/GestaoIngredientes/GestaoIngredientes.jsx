import { useState, useEffect } from 'react';
import './GestaoIngredientes.css';

function GestaoIngredientes() {
  const [vistaActual, setVistaActual] = useState('lista');
  const [ingredientes, setIngredientes] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [editingId, setEditingId] = useState(null);
  
  const [nome, setNome] = useState('');
  const [tipo, setTipo] = useState('VEGETABLES');
  const [alergenio, setAlergenio] = useState('NONE');
  
  const [erroValidacao, setErroValidacao] = useState('');

  const BASE_URL = 'https://siws.ufp.pt/lwlc/api';

  useEffect(() => {
    fetchIngredientes();
  }, []);

  const getAuthHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  });

  const fetchIngredientes = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${BASE_URL}/ingredients`, {
        headers: getAuthHeaders()
      });
      if (response.ok) {
        const data = await response.json();
        setIngredientes(data);
      } else {
        console.error("Erro ao carregar ingredientes do servidor.");
      }
    } catch (error) {
      console.error("Erro de conexão:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleNomeChange = (e) => {
    const valor = e.target.value;
    if (/^[a-zA-ZÀ-ÿ\s]*$/.test(valor) || valor === '') {
      setNome(valor);
      setErroValidacao('');
    } else {
      setErroValidacao('O nome só pode conter letras e espaços (Regra do Sistema).');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nome.trim() || erroValidacao) {
      setErroValidacao('Verifique os erros antes de guardar.');
      return;
    }

    const payload = {
      name: nome,
      type: tipo,
      allergen: alergenio
    };

    try {
      const url = editingId 
        ? `${BASE_URL}/ingredients/${editingId}` 
        : `${BASE_URL}/ingredients`;
      
      const method = editingId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: getAuthHeaders(),
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `Erro do servidor (Status: ${response.status})`);
      }

      fetchIngredientes(); 
      resetForm();
      
    } catch (error) {
      setErroValidacao(error.message || 'Erro de comunicação com o servidor.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Tem a certeza que deseja eliminar este ingrediente?")) return;

    try {
      const response = await fetch(`${BASE_URL}/ingredients/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });

      if (response.ok) {
        setIngredientes(ingredientes.filter(ing => ing.id !== id));
      } else {
        alert("Não é possível apagar. Este ingrediente está a ser usado num prato do menu.");
      }
    } catch (error) {
      alert("Erro ao comunicar com o servidor.");
    }
  };

  const iniciarCriacao = () => {
    resetForm();
    setVistaActual('formulario');
  };

  const iniciarEdicao = (ingrediente) => {
    setEditingId(ingrediente.id);
    setNome(ingrediente.name);
    setTipo(ingrediente.type || 'VEGETABLES');
    setAlergenio(ingrediente.allergen || 'NONE');
    setVistaActual('formulario');
  };

  const resetForm = () => {
    setEditingId(null);
    setNome(''); 
    setTipo('VEGETABLES'); 
    setAlergenio('NONE');
    setErroValidacao('');
    setVistaActual('lista');
  };

  // Tradução dos tipos
  const traduzirTipo = (type) => {
    const traducoes = {
      'DAIRY_PRODUCTS': 'Laticínios',
      'VEGETABLES': 'Vegetais',
      'FRUIT': 'Frutas',
      'TUBERS': 'Tubérculos',
      'CEREALS_AND_DERIVATIVES': 'Grãos/Cereais',
      'MEAT': 'Carne',
      'FATS_AND_OILS': 'Gorduras/Óleos',
      'LEGUMES': 'Leguminosas',
      'FISH': 'Peixe',
      'EGGS': 'Ovos'
    };
    return traducoes[type] || type;
  };

  // Tradução alergenios
  const traduzirAlergenio = (allergen) => {
    const traducoes = {
      'CELERY': 'Aipo',
      'NUTS': 'Frutos Casca Rija',
      'LUPINS': 'Tremoços',
      'CRUSTACEANS': 'Crustáceos',
      'EGGS': 'Ovos',
      'MOLLUSCS': 'Moluscos',
      'PEANUTS': 'Amendoins',
      'GLUTEN_CONTAINING_CEREALS': 'Glúten',
      'FISH': 'Peixe',
      'SULPHITES': 'Sulfitos',
      'MILK_AND_MILK_PRODUCTS': 'Laticínios',
      'SOYBEANS': 'Soja',
      'MUSTARD': 'Mostarda',
      'NONE': 'Nenhum',
      'SESAME_SEEDS': 'Sésamo'
    };
    return traducoes[allergen] || allergen;
  };

  return (
    <div className="gestao-pratos-container">
      {vistaActual === 'lista' && (
        <>
          <div className="admin-header">
            <div>
              <h2>Gestão de Ingredientes</h2>
              <p>Catálogo central do sistema (Sem gestão de stock)</p>
            </div>
            <button className="btn-add-primary" onClick={iniciarCriacao}>
              + ADICIONAR NOVO
            </button>
          </div>

          <div className="table-card">
            {loading ? (
              <p className="loading-text">A carregar dados do servidor...</p>
            ) : (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>NOME DO INGREDIENTE</th>
                    <th>TIPO</th>
                    <th>ALERGÉNIO</th>
                    <th>AÇÕES</th>
                  </tr>
                </thead>
                <tbody>
                  {ingredientes.length === 0 ? (
                    <tr><td colSpan="4" style={{ textAlign: 'center', padding: '20px' }}>Nenhum ingrediente encontrado.</td></tr>
                  ) : (
                    ingredientes.map((ing) => (
                      <tr key={ing.id}>
                        <td>
                          <div className="item-details">
                            <span className="item-name">{ing.name}</span>
                            <span className="item-id">ID: {ing.id.substring(0,8)}...</span>
                          </div>
                        </td>
                        <td><span className="admin-tag">{traduzirTipo(ing.type)}</span></td>
                        <td>
                          <span style={{ 
                            color: ing.allergen === 'NONE' ? '#aaa' : '#d9534f', 
                            fontWeight: ing.allergen !== 'NONE' ? 'bold' : 'normal',
                            backgroundColor: ing.allergen !== 'NONE' ? '#fdeaea' : 'transparent',
                            padding: ing.allergen !== 'NONE' ? '3px 8px' : '0',
                            borderRadius: '4px'
                          }}>
                            {traduzirAlergenio(ing.allergen)}
                          </span>
                        </td>
                        <td className="actions-cell">
                          <button className="action-icon edit" onClick={() => iniciarEdicao(ing)}>✏️</button>
                          <button className="action-icon delete" onClick={() => handleDelete(ing.id)}>🗑️</button>
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
            <h2>{editingId ? 'Editar Ingrediente' : 'Adicionar Ingrediente'}</h2>
            <p>Registe a base nutricional respeitando o esquema do servidor.</p>
          </div>

          <div className="form-card-centered">
            <form onSubmit={handleSubmit} className="admin-form">
              <div className="form-group">
                <label>Nome do Ingrediente (Apenas letras e espaços)</label>
                <input 
                  type="text" 
                  value={nome} 
                  onChange={handleNomeChange} 
                  placeholder="Ex: Tomate Cherry" 
                  required 
                />
                {erroValidacao && <span className="error-text" style={{color: '#d9534f', display: 'block', marginTop: '5px'}}>{erroValidacao}</span>}
              </div>

              <div className="form-group form-grid-2">
                <div>
                  <label>Tipo de Ingrediente</label>
                  <select value={tipo} onChange={(e) => setTipo(e.target.value)} required>
                    <option value="VEGETABLES">Vegetais</option>
                    <option value="MEAT">Carne</option>
                    <option value="FISH">Peixe</option>
                    <option value="DAIRY_PRODUCTS">Laticínios</option>
                    <option value="CEREALS_AND_DERIVATIVES">Grãos / Cereais</option>
                    <option value="FRUIT">Frutas</option>
                    <option value="TUBERS">Tubérculos</option>
                    <option value="LEGUMES">Leguminosas</option>
                    <option value="FATS_AND_OILS">Gorduras e Óleos</option>
                    <option value="EGGS">Ovos</option>
                  </select>
                </div>
                <div>
                  <label>Alergénios</label>
                  <select value={alergenio} onChange={(e) => setAlergenio(e.target.value)} required>
                    <option value="NONE">Nenhum</option>
                    <option value="GLUTEN_CONTAINING_CEREALS">Glúten (Cereais)</option>
                    <option value="MILK_AND_MILK_PRODUCTS">Laticínios</option>
                    <option value="NUTS">Frutos de Casca Rija</option>
                    <option value="PEANUTS">Amendoins</option>
                    <option value="CRUSTACEANS">Crustáceos</option>
                    <option value="MOLLUSCS">Moluscos</option>
                    <option value="FISH">Peixe</option>
                    <option value="EGGS">Ovos</option>
                    <option value="SOYBEANS">Soja</option>
                    <option value="CELERY">Aipo</option>
                    <option value="MUSTARD">Mostarda</option>
                    <option value="SESAME_SEEDS">Sementes de Sésamo</option>
                    <option value="SULPHITES">Sulfitos</option>
                    <option value="LUPINS">Tremoços</option>
                  </select>
                </div>
              </div>

              <div className="form-footer">
                <button type="button" className="btn-text" onClick={resetForm}>CANCELAR</button>
                <button type="submit" className="btn-submit" disabled={!!erroValidacao}>
                  {editingId ? '✓ GUARDAR ALTERAÇÕES' : '✓ SALVAR NO SERVIDOR'}
                </button>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  );
}

export default GestaoIngredientes;