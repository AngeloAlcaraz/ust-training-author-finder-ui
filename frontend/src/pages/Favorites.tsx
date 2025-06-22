import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Avatar from '@mui/material/Avatar';
import FavoriteIcon from '@mui/icons-material/Favorite';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import { IconButton } from '@mui/material';

import { useFavorites } from '../context/FavoritesContext';

const FavoritesPage = () => {
  const { favorites, setFavorites } = useFavorites();
  const [error, setError] = useState<string | null>(null);

  // Función para cargar los favoritos
  const loadFavorites = async () => {
    const userEmail = localStorage.getItem('userEmail') ?? '';
    const token = localStorage.getItem('accessToken') ?? '';

    if (!userEmail || !token) {
      console.log("User email or token is missing");
      return;
    }

    try {
      const encodedEmail = encodeURIComponent(userEmail);
      const res = await fetch(`http://13.221.227.133:4000/api/v1/favorites/${encodedEmail}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error('Failed to load favorites');

      const result = await res.json();
      const favoritesArray = result.data;

      if (!Array.isArray(favoritesArray)) {
        console.error('La propiedad "data" no es un array:', favoritesArray);
        return;
      }

      setFavorites(new Set(favoritesArray));
      localStorage.setItem('favorites', JSON.stringify(favoritesArray));
    } catch (error) {
      console.error('Error loading favorites', error);
      setError('Error loading favorites');
    }
  };

  // Llamada a la API para eliminar un favorito
  const handleRemoveFavorite = async (authorId: string) => {
    const userEmail = localStorage.getItem('userEmail') ?? ''; // Obtener el email del usuario desde el localStorage

    if (!userEmail) {
      setError('User email is missing.');
      return;
    }

    try {
      // Hacer la solicitud DELETE a la API para eliminar el favorito
      const res = await fetch(`http://13.221.227.133:4000/api/v1/favorites/${userEmail}/${authorId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken') ?? ''}`,
        },
      });

      if (!res.ok) {
        throw new Error('Failed to remove favorite');
      }

      // Actualizar el estado de favoritos directamente sin necesidad de recargar la página
      setFavorites((prevFavorites) => {
        const updated = Array.from(prevFavorites).filter((favorite: any) => favorite.authorId !== authorId);
        return new Set(updated);
      });

      // Eliminar del localStorage
      const updatedFavoritesArray = Array.from(favorites).filter((fav: any) => fav.authorId !== authorId);
      localStorage.setItem('favorites', JSON.stringify(updatedFavoritesArray)); // Actualiza el localStorage

    } catch (error) {
      console.error('Error removing favorite:', error);
      setError('Error al eliminar el favorito');
    }
  };

  useEffect(() => {
    loadFavorites(); // Llamamos a loadFavorites cuando el componente se monte
  }, []); // Solo se ejecuta una vez al montar el componente

  return (
    <Box sx={{ py: 4, px: 2, maxWidth: 1130, mx: 'auto' }}>
      <Typography variant="h4" component="h1" gutterBottom textAlign="center" sx={{ color: '#666' }}>
        Favorite Authors
      </Typography>
      <Typography variant="body1" textAlign="center" color="text.secondary" sx={{ mb: 3 }}>
        These are the authors you've marked as your favorites.
      </Typography>

      {error && (
        <Box sx={{ color: 'red', mb: 3, textAlign: 'center' }}>
          {error}
        </Box>
      )}

      {favorites.size === 0 ? (
        <Box
          sx={{
            width: '100%',
            textAlign: 'center',
            mt: 10,
            color: '#999',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <SentimentVeryDissatisfiedIcon sx={{ fontSize: 60 }} />
          <Typography variant="h6">No favorites yet!</Typography>
        </Box>
      ) : (
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 3,
            justifyContent: 'flex-start',
            minHeight: 200,
            position: 'relative',
          }}
        >
          {Array.from(favorites).map((author: any) => (
            <Card
              key={author.authorId}
              sx={{
                flex: '0 0 calc(25% - 24px)',
                maxWidth: '230px',
                minWidth: '200px',
                height: 320,
                display: 'flex',
                flexDirection: 'column',
                p: 2,
                borderRadius: 2,
                border: '1px solid #e0e0e0',
                backgroundColor: '#fff',
                transition: 'all 0.3s ease',
                '&:hover': { boxShadow: 6 },
                overflowY: 'auto',
                scrollbarWidth: 'thin',
                '&::-webkit-scrollbar': {
                  width: '6px',
                  height: '6px',
                },
                '&::-webkit-scrollbar-thumb': {
                  background: '#ccc',
                  borderRadius: '3px',
                },
              }}
            >
              <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'start' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <Avatar sx={{ bgcolor: '#f1f1f1', color: '#666', width: 50, height: 50 }}>
                    {author.imageUrl ? (
                      <img
                        src={author.imageUrl}
                        alt={author.name}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          borderRadius: '50%',
                        }}
                      />
                    ) : (
                      <FavoriteIcon fontSize="large" color="error" />
                    )}
                  </Avatar>
                  <Typography variant="h6" noWrap>
                    {author.name}
                  </Typography>
                </Box>

                {author.birthDate && (
                  <Typography color="text.secondary" sx={{ mt: 1 }}>
                    Born: {author.birthDate}
                  </Typography>
                )}

                {author.deathDate && (
                  <Typography color="text.secondary" sx={{ mt: 1 }}>
                    Died: {author.deathDate}
                  </Typography>
                )}

                {author.topWork && (
                  <Typography variant="subtitle2" color="primary" sx={{ mt: 1, fontStyle: 'italic' }}>
                    Top Work: {author.topWork}
                  </Typography>
                )}

                <Typography color="text.secondary" sx={{ mt: 1 }}>
                  Added: {new Date(author.addedAt).toLocaleDateString()}
                </Typography>

                <Box sx={{ textAlign: 'center', mt: 2 }}>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => handleRemoveFavorite(author.authorId)} // Pasa solo el authorId
                  >
                    <FavoriteIcon fontSize="large" />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default FavoritesPage;
