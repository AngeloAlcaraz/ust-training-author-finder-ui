import React, { type JSX } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import AuthContext from '../context/AuthContext'
import CircularProgress from '@mui/material/CircularProgress'
import Box from '@mui/material/Box'

interface RequireAuthProps {
  children: JSX.Element
}

const RequireAuth = ({ children }: RequireAuthProps) => {
  const { user, loading } = React.useContext(AuthContext)!
  const location = useLocation()

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '70vh',
        }}
      >
        <CircularProgress size={60} />
      </Box>
    )
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}

export default RequireAuth
