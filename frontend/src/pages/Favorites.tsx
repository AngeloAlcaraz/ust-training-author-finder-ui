import React, { useContext, useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Pagination from '@mui/material/Pagination'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Avatar from '@mui/material/Avatar'
import FavoriteIcon from '@mui/icons-material/Favorite'
import Button from '@mui/material/Button'
import PersonIcon from '@mui/icons-material/Person'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import SearchIcon from '@mui/icons-material/Search'
import CancelIcon from '@mui/icons-material/Cancel'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CircularProgress from '@mui/material/CircularProgress'
import { useNavigate } from 'react-router-dom'

// Importa contexto y componentes
import { FavoritesContext } from '../context/FavoritesContext'
import ToastNotification from '../components/ToastNotification'
import { FavoritesService, type FavoriteAuthorResponse } from '../services/favorites-service'

const FavoritesPage = () => {
  const navigate = useNavigate()
  const context = useContext(FavoritesContext)
  if (!context) {
    throw new Error('FavoritesContext must be used within a FavoritesProvider')
  }
  const { toggleFavorite } = context

  // Estado para lista con datos completos
  const [favoriteAuthors, setFavoriteAuthors] = useState<FavoriteAuthorResponse[]>([])
  const [loading, setLoading] = useState(true)

  const [searchTerm, setSearchTerm] = useState<string>('')

  const [toastOpen, setToastOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState<React.ReactNode>(null)
  const [toastSeverity, setToastSeverity] = useState<'success' | 'error' | 'info' | 'warning'>('info')

  const [loadingFavoriteKey, setLoadingFavoriteKey] = useState<string | null>(null)

  // Carga favoritos reales desde backend al montar
  useEffect(() => {
    const loadFavorites = async () => {
      const userEmail = localStorage.getItem('userEmail') ?? ''
      if (!userEmail) {
        setLoading(false)
        return
      }
      try {
        const favs = await FavoritesService.getFavorites(userEmail)
        setFavoriteAuthors(favs) // Guarda los favoritos cargados
      } catch (error) {
        console.error('Error loading favorites', error)
      } finally {
        setLoading(false)
      }
    }
    loadFavorites()
  }, [])

  // Verificar si un autor está en los favoritos
  const isFavoriteAuthor = (authorId: string) => {
    return favoriteAuthors.some(author => author.authorId === authorId)
  }

  // Filtrado y paginado
  const [page, setPage] = useState(1)

  const filteredFavorites = Array.isArray(favoriteAuthors)
    ? favoriteAuthors.filter(author =>
        author.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : []

  const totalPages = Math.ceil(filteredFavorites.length / 8)
  const paginatedFavorites = filteredFavorites.slice(
    (page - 1) * 8, page * 8
  )

  const showNotification = (authorId: string) => {
    const currentlyFavorite = isFavoriteAuthor(authorId) // Verificar si es favorito
    if (currentlyFavorite) {
      setToastMessage(
        <>
          <CancelIcon color="error" sx={{ mr: 1, verticalAlign: 'middle' }} />
          Removed from favorites
        </>
      )
      setToastSeverity('error')
    } else {
      setToastMessage(
        <>
          <CheckCircleIcon color="success" sx={{ mr: 1, verticalAlign: 'middle' }} />
          Added to favorites
        </>
      )
      setToastSeverity('success')
    }
    setToastOpen(true)
  }

  return (
    <Box sx={{ py: 4, px: 2, maxWidth: 1130, mx: 'auto' }}>
      <Typography variant="h4" component="h1" gutterBottom textAlign="center" sx={{ color: '#666' }}>
        My Favorite Authors
      </Typography>

      <Typography variant="body1" textAlign="center" color="text.secondary" sx={{ mb: 3 }}>
        These are the authors you've marked as favorites.
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mb: 4, flexWrap: 'wrap' }}>
        <TextField
          label="Search by author name"
          placeholder="Search by author name"
          variant="outlined"
          fullWidth
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value)
          }}
          slotProps={{
            input: {
              startAdornment: <SearchIcon color="action" />,
            },
          }}
        />
      </Box>

      {loading ? (
        <Box sx={{ width: '100%', textAlign: 'center', mt: 6 }}>
          <CircularProgress size={40} />
        </Box>
      ) : (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, justifyContent: 'flex-start', minHeight: 200 }}>
          {paginatedFavorites.map((author) => {
            const favoriteLoading = loadingFavoriteKey === author.authorId
            const key = author.authorId
            return (
              <Card
                key={key}
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
                    <Avatar
                      src={author.imageUrl}
                      sx={{ bgcolor: '#f1f1f1', color: '#666', width: 50, height: 50 }}
                    >
                      <PersonIcon fontSize="large" color="action" />
                    </Avatar>
                    <Typography variant="h6" noWrap>
                      {author.name}
                    </Typography>
                  </Box>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Birth Date: {author.birthDate || 'Unknown'}
                    </Typography>
                    {author.deathDate && (
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        Death Date: {author.deathDate}
                      </Typography>
                    )}
                    {author.topWork && (
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        Top Work: {author.topWork}
                      </Typography>
                    )}
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <button
                      type="button"
                      disabled={favoriteLoading}
                      onClick={async () => {
                        setLoadingFavoriteKey(author.authorId)
                        try {
                          await toggleFavorite(key)
                          showNotification(key)
                          // Actualizar la lista local tras toggle, recargando
                          const userEmail = localStorage.getItem('userEmail') ?? ''
                          if (userEmail) {
                            const updatedFavs = await FavoritesService.getFavorites(userEmail)
                            setFavoriteAuthors(updatedFavs)
                          }
                        } catch {
                          setToastMessage(
                            <CancelIcon color="error" sx={{ mr: 1, verticalAlign: 'middle' }} />
                          )
                          setToastSeverity('error')
                          setToastOpen(true)
                        } finally {
                          setLoadingFavoriteKey(null)
                        }
                      }}
                      aria-label={isFavoriteAuthor(key) ? 'Remove from favorites' : 'Add to favorites'}
                      style={{
                        background: 'none',
                        border: 'none',
                        padding: 0,
                        cursor: favoriteLoading ? 'wait' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        outline: 'none',
                        minWidth: 24,
                        minHeight: 24,
                      }}
                    >
                      {favoriteLoading ? (
                        <CircularProgress size={20} />
                      ) : (
                        <FavoriteIcon color={isFavoriteAuthor(key) ? 'error' : 'disabled'} />
                      )}
                    </button>
                  </Box>
                </CardContent>
                <Box sx={{ textAlign: 'center', mt: 1 }}>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate(`/authors/${author.authorId}`)}
                  >
                    Details
                  </Button>
                </Box>
              </Card>
            )
          })}
        </Box>
      )}

      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, mb: 2 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(_event, value) => {
              setPage(value)
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
            color="primary"
            shape="rounded"
            showFirstButton
            showLastButton
          />
        </Box>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
        >
          Back to Authors
        </Button>
      </Box>

      <ToastNotification
        open={toastOpen}
        onClose={() => setToastOpen(false)}
        severity={toastSeverity}
        message={toastMessage}
      />
    </Box>
  )
}

export default FavoritesPage
