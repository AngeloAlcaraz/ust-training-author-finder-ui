// src/components/AuthMenu/AuthMenu.tsx
import React, { useState } from 'react'
import Button from '@mui/material/Button'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Avatar from '@mui/material/Avatar'
import PersonOutlineIcon from '@mui/icons-material/PersonOutline'
import AppRegistrationIcon from '@mui/icons-material/AppRegistration'
import LogoutIcon from '@mui/icons-material/Logout'
import { useNavigate } from 'react-router-dom'
import AuthContext from '../../context/AuthContext'

type AuthContextType = {
  user: { name: string } | null
  logout: () => void
}

const AuthMenu = () => {
  const { user, logout } = React.useContext(AuthContext) as AuthContextType
  const navigate = useNavigate()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleLogin = () => {
    navigate('/login')
    handleClose()
  }

  const handleSignUp = () => {
    navigate('/signup')
    handleClose()
  }

  const handleLogout = () => {
    logout()
    navigate('/')
    handleClose()
  }

  return (
    <div>
      {/* Botón principal con avatar */}
      <Button
        onClick={handleClick}
        sx={{
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          textTransform: 'capitalize', // Aquí forzamos que no esté en mayúsculas
        }}
      >
        <Avatar sx={{ width: 30, height: 30, bgcolor: 'secondary.main' }}>
          {user ? user.name.charAt(0) : 'U'}
        </Avatar>
        Welcome, {user ? user.name : 'Guest'}
      </Button>

      {/* Menú desplegable */}
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        {user ? (
          <>
            {/* Nombre del usuario */}
            <MenuItem
              disabled
              sx={{
                textTransform: 'capitalize',
                fontWeight: 'bold',
                color: 'text.primary',
                opacity: 0.85,
                '&.Mui-disabled': {
                  opacity: 0.7,
                  color: 'text.primary',
                },
                '& .MuiListItemIcon-root': {
                  minWidth: '30px',
                },
              }}
            >
              <PersonOutlineIcon sx={{ mr: 1 }} fontSize="small" />
              {user.name}
            </MenuItem>

            {/* Botón de Log Out */}
            <MenuItem
              onClick={handleLogout}
              sx={{
                textTransform: 'capitalize',
                color: 'error.main',
                '& .MuiListItemIcon-root': {
                  minWidth: '30px',
                },
              }}
            >
              <LogoutIcon sx={{ mr: 1 }} fontSize="small" />
              Log out
            </MenuItem>
          </>
        ) : (
          <>
            {/* Botón de Sign In */}
            <MenuItem
              onClick={handleLogin}
              sx={{
                textTransform: 'capitalize',
                '& .MuiListItemIcon-root': {
                  minWidth: '30px',
                },
              }}
            >
              <PersonOutlineIcon sx={{ mr: 1 }} fontSize="small" />
              Sign in
            </MenuItem>

            {/* Botón de Sign Up */}
            <MenuItem
              onClick={handleSignUp}
              sx={{
                textTransform: 'capitalize',
                '& .MuiListItemIcon-root': {
                  minWidth: '30px',
                },
              }}
            >
              <AppRegistrationIcon sx={{ mr: 1 }} fontSize="small" />
              Sign up
            </MenuItem>
          </>
        )}
      </Menu>
    </div>
  )
}

export default AuthMenu