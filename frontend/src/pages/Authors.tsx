import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Pagination from '@mui/material/Pagination'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Alert from '@mui/material/Alert'
import Rating from '@mui/material/Rating'
import Avatar from '@mui/material/Avatar'
import PersonIcon from '@mui/icons-material/Person'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import FavoriteIcon from '@mui/icons-material/Favorite'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied'
import SearchIcon from '@mui/icons-material/Search'
import Button from '@mui/material/Button'

// Importa el ToastNotification y los iconos para los toasts
import ToastNotification from '../components/ToastNotification'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'

import { useFavorites } from '../context/FavoritesContext'

interface Author {
  key: string
  name: string
  birth_date?: string
  bio?: string | { value: string }
  top_work?: string
  work_count?: number
  ratings_average?: number
}

const AuthorsPage = () => {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const searchTerm = searchParams.get('q') ?? ''
  const page = Number(searchParams.get('page') ?? '1')
  const [authors, setAuthors] = useState<Author[]>([])
  const [totalPages, setTotalPages] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { toggleFavorite, isFavorite } = useFavorites()

  // Estados para Toast
  const [toastOpen, setToastOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState<React.ReactNode>(null)
  const [toastSeverity, setToastSeverity] = useState<'success' | 'error' | 'info' | 'warning'>('info')

  const fetchAuthors = async (query: string, pageNumber: number) => {
    if (!query.trim()) return
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch(
        `https://openlibrary.org/search/authors.json?q=${encodeURIComponent(query)}&page=${pageNumber}&limit=8`
      )
      if (!response.ok) throw new Error('Error fetching authors')
      const data = await response.json()
      setAuthors(data.docs ?? [])
      setTotalPages(Math.ceil(data.numFound / 8))
    } catch (err) {
      setError('Failed to load authors. Please try again.')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (searchTerm.trim()) {
      fetchAuthors(searchTerm, page)
    } else {
      setAuthors([])
      setTotalPages(1)
      setError(null)
    }
  }, [searchTerm, page])

  const [inputValue, setInputValue] = useState(searchTerm)
  useEffect(() => {
    setInputValue(searchTerm)
  }, [searchTerm])

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
  }

  const handleSearchClick = () => {
    if (inputValue.trim()) {
      setSearchParams({ q: inputValue.trim(), page: '1' })
    }
  }

  const handleChangePage = (_event: React.ChangeEvent<unknown>, value: number) => {
    setSearchParams({ q: searchTerm, page: value.toString() })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const onDetailsClick = (author: Author) => {
    navigate(`/authors/${author.key.replace('/authors/', '')}`)
  }

  // Función actualizada que muestra toast al agregar o quitar favorito
  const handleToggleFavorite = (key: string) => {
    const currentlyFavorite = isFavorite(key)
    toggleFavorite(key)

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

  const searchFieldSx = {
    backgroundColor: !isLoading && authors.length === 0 ? '#f5f5f5' : '#fff',
    transition: 'background-color 0.3s ease',
    maxWidth: 1160,
    mx: 'auto',
  }

  return (
    <Box sx={{ py: 4, px: 2, maxWidth: 1130, mx: 'auto' }}>
      <Typography variant="h4" component="h1" gutterBottom textAlign="center" sx={{ color: '#666' }}>
        Search Authors
      </Typography>
      <Typography variant="body1" textAlign="center" color="text.secondary" sx={{ mb: 3 }}>
        Enter the name of an author to find their books and details.
      </Typography>
      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mb: 4, flexWrap: 'wrap' }}>
        <TextField
          label="Search by author name"
          placeholder="Search by author name"
          variant="outlined"
          fullWidth
          value={inputValue}
          onChange={handleSearchChange}
          slotProps={{
            input: {
              startAdornment: <SearchIcon color="action" />,
            },
          }}
          sx={searchFieldSx}
        />
        <Button
          loading={isLoading}
          loadingPosition="start"
          startIcon={<SearchIcon />}
          variant="contained"
          color="primary"
          onClick={handleSearchClick}
          disabled={isLoading || !inputValue.trim()}
          sx={{ minWidth: 120, alignSelf: 'center' }}
        >
          Search
        </Button>
      </Box>
      {error && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      )}
      {!isLoading && !error && (
        <>
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
            {authors.length > 0 ? (
              authors.map((author) => {
                let bioContent: React.ReactNode = null
                if (typeof author.bio === 'string') {
                  bioContent = (
                    <Typography variant="body2">
                      {author.bio.length > 150 ? `${author.bio.substring(0, 150)}...` : author.bio}
                    </Typography>
                  )
                } else if (typeof author.bio === 'object' && author.bio && 'value' in author.bio) {
                  const bioValue = (author.bio as { value: string }).value
                  bioContent = <Typography variant="body2">{bioValue.substring(0, 150)}...</Typography>
                }
                return (
                  <Card
                    key={author.key}
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
                          <PersonIcon fontSize="large" color="action" />
                        </Avatar>
                        <Typography variant="h6" noWrap>
                          {author.name}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <button
                          type="button"
                          onClick={() => handleToggleFavorite(author.key)}
                          aria-label={isFavorite(author.key) ? 'Remove from favorites' : 'Add to favorites'}
                          style={{
                            background: 'none',
                            border: 'none',
                            padding: 0,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            outline: 'none',
                          }}
                        >
                          {isFavorite(author.key) ? (
                            <FavoriteIcon color="error" />
                          ) : (
                            <FavoriteBorderIcon color="error" />
                          )}
                        </button>
                      </Box>
                      {author.birth_date && (
                        <Typography color="text.secondary" sx={{ mt: 1 }}>
                          Born: {author.birth_date}
                        </Typography>
                      )}
                      {author.top_work && (
                        <Typography variant="subtitle2" color="primary" sx={{ mt: 1, fontStyle: 'italic' }}>
                          Top Work: {author.top_work}
                        </Typography>
                      )}
                      {typeof author.ratings_average === 'number' && author.ratings_average > 0 && (
                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                          <Rating
                            name="read-only"
                            value={author.ratings_average / 2}
                            readOnly
                            precision={0.5}
                            sx={{ mr: 1, fontSize: '1rem' }}
                          />
                          <Typography variant="body2" color="text.secondary">
                            {author.ratings_average?.toFixed(1)}
                          </Typography>
                        </Box>
                      )}
                      {typeof author.work_count === 'number' && (
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                          Works: {author.work_count}
                        </Typography>
                      )}
                      {bioContent && (
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1, flexGrow: 1 }}>
                          {bioContent}
                        </Typography>
                      )}
                    </CardContent>
                    <Box sx={{ textAlign: 'center', mt: 1 }}>
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<InfoOutlinedIcon />}
                        onClick={() => onDetailsClick(author)}
                      >
                        Details
                      </Button>
                    </Box>
                  </Card>
                )
              })
            ) : (
              searchTerm.trim() !== '' && (
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
                  <Typography variant="h6">No authors found.</Typography>
                </Box>
              )
            )}
          </Box>
          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, mb: 4 }}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={handleChangePage}
                color="primary"
                shape="rounded"
                showFirstButton
                showLastButton
                sx={{
                  '& .MuiPaginationItem-root': {
                    borderRadius: 2,
                    transition: 'background-color 0.3s',
                    '&:hover': {
                      backgroundColor: '#e3f2fd',
                    },
                  },
                }}
              />
            </Box>
          )}
        </>
      )}
      {/* Toast Notification */}
      <ToastNotification
        open={toastOpen}
        onClose={() => setToastOpen(false)}
        severity={toastSeverity}
        message={toastMessage}
      />
    </Box>
  )
}

export default AuthorsPage
