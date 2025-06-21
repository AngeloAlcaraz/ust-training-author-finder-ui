import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Avatar from '@mui/material/Avatar'
import CircularProgress from '@mui/material/CircularProgress'
import Button from '@mui/material/Button'
import Alert from '@mui/material/Alert'
import Rating from '@mui/material/Rating'
import IconButton from '@mui/material/IconButton'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import PersonIcon from '@mui/icons-material/Person'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import FavoriteIcon from '@mui/icons-material/Favorite'

// Importa ToastNotification y los iconos para el toast
import ToastNotification from '../components/ToastNotification'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'

import { useFavorites } from '../context/FavoritesContext'  // 👈 Importa el hook de contexto

interface AuthorDetail {
    key: string
    name: string
    birth_date?: string
    date_of_death?: string
    bio?: string | { value: string }
    top_work?: string
    work_count?: number
    ratings_average?: number
    photos?: number[]
}

const normalizeKey = (key: string) => key.replace(/^\/?authors\//i, '')

const AuthorDetailsPage = () => {
    const { authorKey } = useParams<{ authorKey: string }>()
    const navigate = useNavigate()

    const [author, setAuthor] = useState<AuthorDetail | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    // Contexto para favoritos
    const { toggleFavorite, isFavorite } = useFavorites()

    // Estados para ToastNotification
    const [toastOpen, setToastOpen] = useState(false)
    const [toastMessage, setToastMessage] = useState<React.ReactNode>(null)
    const [toastSeverity, setToastSeverity] = useState<'success' | 'error' | 'info' | 'warning'>('info')

    useEffect(() => {
        const fetchAuthorDetails = async () => {
            if (!authorKey) return
            setIsLoading(true)
            setError(null)
            try {
                const response = await fetch(`https://openlibrary.org/authors/${authorKey}.json`)
                if (!response.ok) throw new Error('Error fetching author details')
                const data = await response.json()

                let fullBio = ''
                if (typeof data.bio === 'string') {
                    fullBio = data.bio
                } else if (data.bio && typeof data.bio === 'object' && 'value' in data.bio) {
                    fullBio = data.bio.value
                }

                setAuthor({
                    ...data,
                    bio: fullBio,
                })
            } catch (err) {
                setError('Failed to load author details.')
                console.error(err)
            } finally {
                setIsLoading(false)
            }
        }

        fetchAuthorDetails()
    }, [authorKey])

    const handleGoBack = () => {
        navigate(-1)
    }

    // Función para manejar el toggle de favoritos + mostrar toast
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

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                <CircularProgress size={40} thickness={4} />
            </Box>
        )
    }

    if (error || !author) {
        return (
            <Alert severity="error" sx={{ m: 3 }}>
                {error ?? 'Author not found'}
            </Alert>
        )
    }

    const id = normalizeKey(author.key)

    let bioText = ''
    if (typeof author.bio === 'string') {
        bioText = author.bio
    } else if (author.bio && typeof author.bio === 'object' && 'value' in author.bio) {
        bioText = author.bio.value
    }

    return (
        <Box sx={{ py: 4, px: 2, maxWidth: 900, mx: 'auto' }}>
            <Button
                startIcon={<ArrowBackIcon />}
                onClick={handleGoBack}
                variant="outlined"
                color="primary"
                sx={{ mb: 3 }}
            >
                Back to Authors
            </Button>

            <Card sx={{ borderRadius: 3, boxShadow: 3, overflow: 'hidden' }}>
                <CardContent
                    sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', md: 'row' },
                        gap: 3,
                        alignItems: { md: 'center' },
                    }}
                >
                    <Avatar
                        src={
                            author.photos?.[0]
                                ? `https://covers.openlibrary.org/a/id/${author.photos[0]}-L.jpg`
                                : undefined
                        }
                        alt={author.name}
                        sx={{
                            width: 120,
                            height: 120,
                            bgcolor: '#f1f1f1',
                            color: '#666',
                            boxShadow: 2,
                        }}
                    >
                        <PersonIcon fontSize="large" />
                    </Avatar>

                    <Box sx={{ flexGrow: 1 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="h5" component="h2" gutterBottom>
                                {author.name}
                            </Typography>
                            <IconButton
                                aria-label={isFavorite(id) ? 'Remove from favorites' : 'Add to favorites'}
                                onClick={() => handleToggleFavorite(id)}
                                color={isFavorite(id) ? 'error' : 'default'}
                                sx={{
                                    outline: 'none',
                                    '&:focus': {
                                        outline: 'none',
                                        boxShadow: 'none',
                                    },
                                    '&:focus-visible': {
                                        outline: 'none',
                                        boxShadow: 'none',
                                    },
                                }}
                            >
                                {isFavorite(id) ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                            </IconButton>
                        </Box>
                        {author.birth_date && (
                            <Typography variant="body1">
                                <strong>Born:</strong> {author.birth_date}
                            </Typography>
                        )}
                        {author.date_of_death && (
                            <Typography variant="body1">
                                <strong>Died:</strong> {author.date_of_death}
                            </Typography>
                        )}
                        {author.top_work && (
                            <Typography variant="body1" fontStyle="italic" color="primary" mt={1}>
                                <strong>Top Work:</strong> {author.top_work}
                            </Typography>
                        )}
                        {author.work_count !== undefined && (
                            <Typography variant="body1" mt={1}>
                                <strong>Total Works:</strong> {author.work_count}
                            </Typography>
                        )}
                        {typeof author.ratings_average === 'number' && (
                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                <Rating
                                    name="read-only"
                                    value={author.ratings_average / 2}
                                    readOnly
                                    precision={0.5}
                                    sx={{ mr: 1 }}
                                />
                                <Typography variant="body2" color="text.secondary">
                                    {author.ratings_average.toFixed(1)} average rating
                                </Typography>
                            </Box>
                        )}
                    </Box>
                </CardContent>
            </Card>

            {bioText && (
                <Card sx={{ mt: 3, p: 2 }}>
                    <Typography variant="h6" gutterBottom>
                        Biography
                    </Typography>
                    <Typography component="p" sx={{ whiteSpace: 'pre-line' }}>
                        {bioText}
                    </Typography>
                </Card>
            )}

            <Box sx={{ textAlign: 'center', mt: 4 }}>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<InfoOutlinedIcon />}
                    href={`https://openlibrary.org${author.key}`}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    View on Open Library
                </Button>
            </Box>

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

export default AuthorDetailsPage
