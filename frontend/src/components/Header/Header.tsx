import React from 'react'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import MenuIcon from '@mui/icons-material/Menu'
import PeopleIcon from '@mui/icons-material/People'
import FavoriteIcon from '@mui/icons-material/Favorite'
import PersonOutlineIcon from '@mui/icons-material/PersonOutline'
import LogoutIcon from '@mui/icons-material/Logout'
import AppRegistrationIcon from '@mui/icons-material/AppRegistration'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import AuthContext from '../../context/AuthContext'
import { logout as logoutService } from '../../services/auth-service'

const Header = () => {
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null)
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null)
  const { user, logout } = React.useContext(AuthContext)!
  const navigate = useNavigate()

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget)
  }

  const handleCloseNavMenu = () => {
    setAnchorElNav(null)
  }

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget)
  }

  const handleCloseUserMenu = () => {
    setAnchorElUser(null)
  }

  const handleLogout = async () => {
    try {
      await logoutService()
    } catch (err) {
      console.error('Logout error:', err)
    } finally {
      logout()
      handleCloseUserMenu()
      navigate('/')
    }
  }

  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: '#0f172a',
        boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.15)',
        backdropFilter: 'blur(6px)',
      }}
    >
      <Toolbar disableGutters>
        <Typography
          component={RouterLink}
          to="/"
          sx={{
            ml: 2,
            flexGrow: 1,
            display: 'flex',
            alignItems: 'center',
            textDecoration: 'none',
            color: 'inherit',
            fontWeight: 700,
            fontSize: {
              xs: '1.1rem',
              sm: '1.3rem',
              md: '1.5rem',
            },
            fontFamily: '"Inter", "Roboto", "Helvetica Neue", sans-serif',
            letterSpacing: '0.5px',
            transition: 'color 0.3s ease',
            '&:hover': {
              color: 'secondary.main',
            },
          }}
        >
          <img
            src="icons/author-finder.png"
            alt="Logo"
            style={{ width: 40, height: 40, marginRight: 8 }}
          />
          {' '}
          Author Finder
        </Typography>

        {user ? (
          <React.Fragment>
            <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 3, mr: 5 }}>
              <Button
                color="inherit"
                component={RouterLink}
                to="/authors"
                startIcon={<PeopleIcon fontSize="medium" />}
                sx={{ textTransform: 'capitalize', fontSize: '1.05rem' }}
              >
                Authors
              </Button>
              <Button
                color="inherit"
                component={RouterLink}
                to="/favorites"
                startIcon={<FavoriteIcon fontSize="medium" />}
                sx={{ textTransform: 'capitalize', fontSize: '1.05rem' }}
              >
                Favorites
              </Button>
            </Box>

            <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1, mr: 3 }}>
              <Typography variant="body1" color="inherit" sx={{ userSelect: 'none' }}>
                Welcome, {user.name}
              </Typography>
              <IconButton onClick={handleOpenUserMenu} color="inherit">
                <AccountCircleIcon fontSize="medium" />
              </IconButton>
              <Menu
                anchorEl={anchorElUser}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              >
                <Box>
                  <MenuItem onClick={handleLogout}>
                    <LogoutIcon sx={{ mr: 1 }} fontSize="small" />
                    Log out
                  </MenuItem>
                </Box>
              </Menu>
            </Box>
          </React.Fragment>
        ) : (
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2, mr: 2 }}>
            <Button
              color="inherit"
              component={RouterLink}
              to="/login"
              startIcon={<PersonOutlineIcon fontSize="medium" />}
              sx={{ textTransform: 'capitalize' }}
            >
              Sign In
            </Button>
            <Button
              color="inherit"
              component={RouterLink}
              to="/signup"
              startIcon={<AppRegistrationIcon fontSize="medium" />}
              sx={{ textTransform: 'capitalize' }}
            >
              Sign Up
            </Button>
          </Box>
        )}

        <Box sx={{ display: { xs: 'flex', md: 'none' }, mr: 2 }}>
          <IconButton size="large" aria-label="menu" onClick={handleOpenNavMenu} color="inherit">
            <MenuIcon />
          </IconButton>
          <Menu
            anchorEl={anchorElNav}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            keepMounted
            transformOrigin={{ vertical: 'top', horizontal: 'left' }}
            open={Boolean(anchorElNav)}
            onClose={handleCloseNavMenu}
            sx={{ display: { xs: 'block', md: 'none' } }}
          >
            {user ? (
              <Box>
                <MenuItem onClick={handleCloseNavMenu} component={RouterLink} to="/authors">
                  <PeopleIcon sx={{ mr: 1 }} fontSize="medium" /> Authors
                </MenuItem>
                <MenuItem onClick={handleCloseNavMenu} component={RouterLink} to="/favorites">
                  <FavoriteIcon sx={{ mr: 1 }} fontSize="medium" /> Favorites
                </MenuItem>
                <MenuItem disabled sx={{ textTransform: 'capitalize', fontWeight: 'bold' }}>
                  <PersonOutlineIcon sx={{ mr: 1 }} fontSize="small" />
                  Welcome, {user.name}
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    handleCloseNavMenu()
                    handleLogout()
                  }}
                  sx={{ color: 'error.main', textTransform: 'capitalize' }}
                >
                  <LogoutIcon sx={{ mr: 1 }} fontSize="small" />
                  Log out
                </MenuItem>
              </Box>
            ) : (
              <Box>
                <MenuItem disabled sx={{ textTransform: 'capitalize', fontWeight: 'bold' }}>
                  <PersonOutlineIcon sx={{ mr: 1 }} fontSize="small" />
                  Welcome, Guest
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    handleCloseNavMenu()
                    navigate('/login')
                  }}
                >
                  <PersonOutlineIcon sx={{ mr: 1 }} fontSize="small" />
                  Sign in
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    handleCloseNavMenu()
                    navigate('/signup')
                  }}
                >
                  <AppRegistrationIcon sx={{ mr: 1 }} fontSize="small" />
                  Sign up
                </MenuItem>
              </Box>
            )}
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  )
}

export default Header
