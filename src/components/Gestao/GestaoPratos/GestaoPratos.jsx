import { useState, useEffect, useRef } from 'react';
import DishImage from '../../DishImage/DishImage';
import './GestaoPratos.css';

function GestaoPratos() {
  const [vistaActual, setVistaActual] = useState('lista');
  const [pratos, setPratos] = useState([]);
  const [ingredientes, setIngredientes] = useState([]); 
  const [loading, setLoading] = useState(true);
  
  const [imagemFile, setImagemFile] = useState(null);
  const [imagemPreview, setImagemPreview] = useState('');
  const [uploading, setUploading] = useState(false);

  const fileInputRef = useRef(null);

  const [editingId, setEditingId] = useState(null);
  const [nome, setNome] = useState('');
  const [preco, setPreco] = useState('');
  const [ingredientesSelecionados, setIngredientesSelecionados] = useState([]); 
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

  // Gerimos a seleção de ingredientes utilizando o nome 
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

    setUploading(true);
    setErroValidacao('');

    // Criado objeto com os dados do prato
    const dishData = {
      name: nome,
      price: parseFloat(preco),
      ingredientNames: ingredientesSelecionados 
    };

    // Preparado o Form
    const formData = new FormData();
    
    formData.append('dish', new Blob([JSON.stringify(dishData)], {
      type: 'application/json'
    }));

    // Adicionamos imagem caso o utilizador tiver selecionado uma
    if (imagemFile) {
      formData.append('image', imagemFile);
    }

    try {
      const url = editingId ? `${BASE_URL}/dishes/${editingId}` : `${BASE_URL}/dishes`;
      const method = editingId ? 'PUT' : 'POST';

      // Autorização
      const token = localStorage.getItem('token');
      const headers = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(url, {
        method: method,
        headers: headers,
        body: formData //
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erro do servidor: ${errorText || response.status}`);
      }

      fetchDadosIniciais(); 
      resetForm();

    } catch (error) {
      console.error("Erro na submissão:", error);
      setErroValidacao(error.message || 'Erro ao guardar o prato e a imagem.');
    } finally {
      setUploading(false);
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
    setImagemPreview(prato.imageUrl || ''); // Mostramos a imagem atual se tiver
    setImagemFile(null);
    setVistaActual('formulario');
  };

const resetForm = () => {
    setEditingId(null);
    setNome('');
    setPreco('');
    setIngredientesSelecionados([]);
    setImagemFile(null);
    setImagemPreview('');
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; 
    }
    
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
                          <DishImage 
                            dishId={prato.id} 
                            altName={prato.name} 
                            className="prato-image" 
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
                          // Verificar se o nome está no array
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

<div className="form-group">
                <label>Imagem do Prato</label>
                <input 
                  type="file" 
                  id="imageInput"
                  ref={fileInputRef}
                  accept="image/png, image/jpeg, image/webp" 
                  style={{ display: 'none' }}
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      setImagemFile(file);
                    }
                  }}
                />

                <div 
                  className="image-upload-zone"
                  onClick={() => document.getElementById('imageInput').click()}
                  style={imagemFile ? { backgroundColor: '#f0fdf4', border: '2px dashed #16a34a' } : {}}
                >
                  {imagemFile ? (
                    <div style={{ textAlign: 'center' }}>
                      <span style={{ fontSize: '2rem', display: 'block' }}>✅</span>
                      <p style={{ color: '#16a34a', fontWeight: 'bold', margin: '10px 0 5px 0' }}>
                        Imagem carregada com sucesso!
                      </p>
                      <p style={{ color: '#555', fontSize: '0.85rem', margin: 0 }}>
                        {imagemFile.name}
                      </p>
                    </div>
                  ) : imagemPreview ? (
                    <div style={{ textAlign: 'center' }}>
                      <span style={{ fontSize: '2rem', display: 'block' }}>🖼️</span>
                      <p style={{ color: '#0b2b40', fontWeight: 'bold', margin: '10px 0 5px 0' }}>
                        Este prato já possui uma imagem.
                      </p>
                      <p style={{ color: '#888', fontSize: '0.85rem', margin: 0 }}>
                        Clique aqui para substituir por uma nova foto.
                      </p>
                    </div>
                  ) : (
                    <div style={{ textAlign: 'center' }}>
                      <span className="upload-icon">📷</span>
                      <p>Clique para selecionar uma imagem</p>
                      <span className="upload-hint">PNG, JPG ou WEBP (Max. 5MB)</span>
                    </div>
                  )}
                </div>
                
                {(imagemFile || imagemPreview) && (
                  <button 
                    type="button" 
                    className="btn-remove-image" 
                    onClick={() => {
                      setImagemFile(null);
                      setImagemPreview(''); 
                      if (fileInputRef.current) {
                        fileInputRef.current.value = '';
                      }
                    }}
                  >
                    Remover Imagem
                  </button>
                )}
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