import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Avatar from '@mui/material/Avatar';
import FavoriteIcon from '@mui/icons-material/Favorite';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import { IconButton, Button, TextField, Pagination, InputAdornment } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';  // Importamos el ícono de persona
import CancelIcon from '@mui/icons-material/Cancel'; // Importa el ícono de cancelación

import { useFavorites } from '../context/FavoritesContext';
import ToastNotification from '../components/ToastNotification'; // Importa el ToastNotification

const FavoritesPage = () => {
  const { favorites, setFavorites } = useFavorites();
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredFavorites, setFilteredFavorites] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8); // Puedes cambiar el número de elementos por página
  const [openToast, setOpenToast] = useState(false); // Controlar el estado del toast
  const navigate = useNavigate();

  // Función para cargar los favoritos
  const loadFavorites = async () => {
    const userEmail = localStorage.getItem('userEmail') ?? '';
    const token = localStorage.getItem('accessToken') ?? '';

    if (!userEmail || !token) {
      console.log('User email or token is missing');
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

  const handleRemoveFavorite = async (authorId: string) => {
    const userEmail = localStorage.getItem('userEmail') ?? '';
    if (!userEmail) {
      setError('User email is missing.');
      return;
    }

    try {
      const res = await fetch(`http://13.221.227.133:4000/api/v1/favorites/${userEmail}/${authorId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken') ?? ''}`,
        },
      });

      if (!res.ok) {
        throw new Error('Failed to remove favorite');
      }

      setFavorites((prevFavorites) => {
        const updated = Array.from(prevFavorites).filter((favorite: any) => favorite.authorId !== authorId);
        return new Set(updated);
      });

      const updatedFavoritesArray = Array.from(favorites).filter((fav: any) => fav.authorId !== authorId);
      localStorage.setItem('favorites', JSON.stringify(updatedFavoritesArray));

      // Mostrar el Toast al eliminar un favorito
      setOpenToast(true);

    } catch (error) {
      console.error('Error removing favorite:', error);
      setError('Error al eliminar el favorito');
    }
  };

  const onDetailsClick = (authorId: string) => {
    navigate(`/authors/${authorId}`);
  };

  // Filtro de autores basado en el nombre
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  // Filtrar favoritos por nombre
  useEffect(() => {
    if (searchTerm.trim()) {
      setFilteredFavorites(
        Array.from(favorites).filter((author: any) =>
          author.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    } else {
      setFilteredFavorites(Array.from(favorites));
    }
  }, [searchTerm, favorites]);

  // Función para cambiar de página
  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
  };

  // Obtener favoritos por página
  const currentFavorites = filteredFavorites.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    loadFavorites();
  }, []);

  return (
    <Box sx={{ py: 4, px: 2, maxWidth: 1130, mx: 'auto' }}>
      {/* Botón Back */}
      <Box sx={{ mb: 3 }}>
        <Button variant="outlined" onClick={() => navigate('/authors')}>
          Back to Authors
        </Button>
      </Box>

      <Typography variant="h4" component="h1" gutterBottom textAlign="center" sx={{ color: '#666' }}>
        Favorite Authors
      </Typography>
      <Typography variant="body1" textAlign="center" color="text.secondary" sx={{ mb: 3 }}>
        These are the authors you've marked as your favorites.
      </Typography>

      {/* Barra de búsqueda con MUI */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
        <TextField
          label="Filter by author name"
          variant="outlined"
          fullWidth
          value={searchTerm}
          onChange={handleSearchChange}
          sx={{ maxWidth: 1130 }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <FavoriteIcon />
                </InputAdornment>
              ),
            },
          }}
        />
      </Box>

      {error && (
        <Box sx={{ color: 'red', mb: 3, textAlign: 'center' }}>
          {error}
        </Box>
      )}

      {currentFavorites.length === 0 ? (
        <Box sx={{ width: '100%', textAlign: 'center', mt: 10, color: '#999', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
          <SentimentVeryDissatisfiedIcon sx={{ fontSize: 60 }} />
          <Typography variant="h6">No favorites yet!</Typography>
        </Box>
      ) : (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, justifyContent: 'flex-start', minHeight: 200 }}>
          {currentFavorites.map((author: any) => (
            <Card key={author.authorId} sx={{ flex: '0 0 calc(25% - 24px)', maxWidth: '230px', minWidth: '200px', height: 320, display: 'flex', flexDirection: 'column', p: 2, borderRadius: 2, border: '1px solid #e0e0e0', backgroundColor: '#fff', transition: 'all 0.3s ease', '&:hover': { boxShadow: 6 }, overflowY: 'auto' }}>
              <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'start' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <Avatar sx={{ bgcolor: '#f1f1f1', color: '#666', width: 50, height: 50 }}>
                    {author.imageUrl ? (
                      <img src={author.imageUrl} alt={author.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                    ) : (
                      <PersonIcon fontSize="large" color="primary" />
                    )}
                  </Avatar>
                  <Typography variant="h6" noWrap>{author.name}</Typography>
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
                  <Button variant="outlined" size="small" onClick={() => onDetailsClick(author.authorId)}>
                    Details
                  </Button>
                </Box>
                <Box sx={{ textAlign: 'center', mt: 2 }}>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => handleRemoveFavorite(author.authorId)}
                    sx={{
                      border: 'none',  // Elimina el borde
                      '&:focus': {     // Elimina el borde cuando se enfoca
                        outline: 'none'
                      }
                    }}
                  >
                    <FavoriteIcon />
                  </IconButton>

                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}

      {/* Paginación MUI */}
      {filteredFavorites.length > itemsPerPage && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Pagination
            count={Math.ceil(filteredFavorites.length / itemsPerPage)}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
            shape="rounded"
            showFirstButton
            showLastButton
          />
        </Box>
      )}

      {/* Toast Notification */}
      <ToastNotification
        open={openToast}
        onClose={() => setOpenToast(false)}
        severity="error"
        message={
          <>
            <CancelIcon color="error" sx={{ mr: 1, verticalAlign: 'middle' }} />
            Removed from favorites!
          </>
        }
        autoHideDuration={3000}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      />
    </Box>
  );
};

export default FavoritesPage;
