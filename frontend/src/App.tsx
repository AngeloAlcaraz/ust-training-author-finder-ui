import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from '../src/context/AuthContext'
import { FavoritesProvider } from './context/FavoritesContext'

// Páginas
import Home from '../src/pages/Home'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import AuthorsPage from './pages/Authors'
import AuthorDetailsPage from './pages/AuthorDetails'
import FavoritesPage from './pages/Favorites'

// Componentes
import Header from './components/Header/Header'
import Footer from './components/Footer/Footer'
import { Box } from '@mui/material'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import RequireAuth from '../src/routes/RequireAuth'

function AppRoutes() {

  return (
    <Routes>
      {/* Ruta raíz siempre muestra Home */}
      <Route path="/" element={<Home />} />

      {/* Login y Signup sin protección */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />

      {/* Rutas protegidas */}
      <Route
        path="/authors"
        element={
          <RequireAuth>
            <AuthorsPage />
          </RequireAuth>
        }
      />
      <Route
        path="/authors/:authorKey"
        element={
          <RequireAuth>
            <AuthorDetailsPage />
          </RequireAuth>
        }
      />
      <Route
        path="/favorites"
        element={
          <RequireAuth>
            <FavoritesPage />
          </RequireAuth>
        }
      />

      {/* Redirige cualquier ruta desconocida a / */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

function App() {
  return (
    <AuthProvider>
      <FavoritesProvider>
        <Router>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              minHeight: '100vh',
            }}
          >
            <Header />
            <Box
              component="main"
              sx={{
                flex: 1,
                py: { xs: 3, sm: 4 },
                px: { xs: 2, md: 3 },
                backgroundColor: '#f9fafb',
              }}
            >
              <AppRoutes />
              <ToastContainer position="bottom-center" />
            </Box>
            <Footer />
          </Box>
        </Router>
      </FavoritesProvider>
    </AuthProvider>
  )
}

export default App
