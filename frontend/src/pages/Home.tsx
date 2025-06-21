// src/pages/Home/Home.tsx
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import { Link as RouterLink } from 'react-router-dom'

// Iconos de Material UI
import MenuBookIcon from '@mui/icons-material/MenuBook'
import LoginIcon from '@mui/icons-material/Login'
import PersonAddIcon from '@mui/icons-material/PersonAdd'

const Home = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '71.5vh',
        textAlign: 'center',
        px: 2,
        py: 4,
        backgroundColor: '#f9fafb',
        borderRadius: 2,
        mx: 'auto',
        maxWidth: 800,
      }}
    >
      {/* Icono principal */}
      <Box sx={{ mb: 2 }}>
        <MenuBookIcon sx={{ fontSize: '80px', color: 'primary.main' }} />
      </Box>

      {/* Título */}
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        sx={{
          fontWeight: 700,
          color: '#1a1a1a',
          fontFamily: '"Inter", "Roboto", sans-serif',
        }}
      >
        Find your favorite authors
      </Typography>

      {/* Subtítulo */}
      <Typography
        variant="h6"
        component="p"
        color="text.secondary"
        sx={{
          mb: 3,
          fontSize: '1.1rem',
        }}
      >
        Explore works by renowned authors and save your favorites.
        Sign in or register to start searching.
      </Typography>

      {/* Acciones */}
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
        <Button
          component={RouterLink}
          to="/login"
          variant="contained"
          color="primary"
          size="large"
          startIcon={<LoginIcon />}
          sx={{
            textTransform: 'capitalize',
            boxShadow: 3,
            '&:hover': {
              boxShadow: 6,
            },
          }}
        >
          Sign In
        </Button>
        <Button
          component={RouterLink}
          to="/signup"
          variant="outlined"
          color="primary"
          size="large"
          startIcon={<PersonAddIcon />}
          sx={{
            textTransform: 'capitalize',
            boxShadow: 1,
            '&:hover': {
              boxShadow: 3,
            },
          }}
        >
          Sign Up
        </Button>
      </Box>
    </Box>
  )
}

export default Home