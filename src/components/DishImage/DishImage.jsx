import { useState, useEffect } from 'react';

function DishImage({ dishId, altName, className }) {
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const BASE_URL = 'https://siws.ufp.pt/lwlc/api';

  useEffect(() => {
    if (!dishId) return;

    const fetchPresignedUrl = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${BASE_URL}/dishes/${dishId}/image-url`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
          }
        });

        if (response.ok) {
          const data = await response.json();
          let finalUrl = data.url;

          // Correção do nome do host do server
          // Se o server devolver localhost ou minio.local é forçada a alteração para o endereço da API para evitar problemas 
          if (finalUrl.includes('minio.local') || finalUrl.includes('localhost')) {  
          finalUrl = finalUrl.replace(/http:\/\/(minio\.local|localhost):9000/, 'https://siws.ufp.pt'); 
          }

          setImageUrl(finalUrl);
        } else {
          setError(true);
        }
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchPresignedUrl();
  }, [dishId]);

  // Se estiver a carregar aparece Carregando...
  if (loading) {
    return <div className={`image-loading-placeholder ${className}`} style={{ backgroundColor: '#f4f1ee', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Carregando...</div>;
  }

  // Se houver algum erro mostramos esta imagem 
  if (error || !imageUrl) {
    return (
      <img 
        src="https://images.unsplash.com/photo-1495147466023-ac5c588e2e94?w=500&q=80" 
        alt={`Placeholder para ${altName}`} 
        className={className}
      />
    );
  }

  // Se tudo correr
  return (
    <img 
      src={imageUrl} 
      alt={altName} 
      className={className}
      onError={(e) => {
        // Fallback final para caso a sessão expire ou o link acabe
        e.target.onerror = null; 
        e.target.src = "https://images.unsplash.com/photo-1495147466023-ac5c588e2e94?w=500&q=80";
      }}
    />
  );
}

export default DishImage;