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

          // TRUCO DE INGENIERÍA: Corrección de Hostname del Servidor
          // Si el servidor devuelve localhost o minio.local, lo forzamos a apuntar
          // a la IP/Dominio real de tu API para que no se rompa en tu ordenador.
          if (finalUrl.includes('minio.local') || finalUrl.includes('localhost')) {
            // Sustituye el host local por el dominio público de tu universidad
            finalUrl = finalUrl.replace(/http:\/\/(minio\.local|localhost):9000/, 'https://siws.ufp.pt'); 
            // Nota: Ajusta 'https://siws.ufp.pt' si el puerto de Minio está expuesto en otro lado (ej: siws.ufp.pt:9000)
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

  // Si está cargando, mostramos un pequeño esqueleto o texto
  if (loading) {
    return <div className={`image-loading-placeholder ${className}`} style={{ backgroundColor: '#f4f1ee', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Carregando...</div>;
  }

  // Si hay error (o el 404 de "has no image"), mostramos una imagen por defecto elegante
  if (error || !imageUrl) {
    return (
      <img 
        src="https://images.unsplash.com/photo-1495147466023-ac5c588e2e94?w=500&q=80" 
        alt={`Placeholder para ${altName}`} 
        className={className}
      />
    );
  }

  // Si todo fue bien, mostramos la imagen segura de S3/Minio
  return (
    <img 
      src={imageUrl} 
      alt={altName} 
      className={className}
      onError={(e) => {
        // Fallback final por si la firma caduca o el enlace se rompe
        e.target.onerror = null; 
        e.target.src = "https://images.unsplash.com/photo-1495147466023-ac5c588e2e94?w=500&q=80";
      }}
    />
  );
}

export default DishImage;