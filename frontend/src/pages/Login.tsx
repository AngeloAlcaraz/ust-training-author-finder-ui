import React, { useState, useContext } from 'react'
import { useNavigate, Link as RouterLink } from 'react-router-dom'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import EmailIcon from '@mui/icons-material/Email'
import LockIcon from '@mui/icons-material/Lock'
import CircularProgress from '@mui/material/CircularProgress'
import { LoginService, type LoginRequest } from '../services/login-service'
import { toast } from 'react-toastify'
import AuthContext from '../context/AuthContext'

const Login = () => {
  const navigate = useNavigate()
  const { login } = useContext(AuthContext)!

  const [formData, setFormData] = useState<LoginRequest>({ email: '', password: '' })
  const [errors, setErrors] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors = { email: '', password: '' }
    let isValid = true

    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Valid email is required'
      isValid = false
    }

    if (!formData.password || formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
      isValid = false
    }

    return { isValid, newErrors }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const { isValid, newErrors } = validateForm()

    if (!isValid) {
      setErrors(newErrors)
      return
    }

    try {
      setLoading(true)
      const result = await LoginService.signin(formData)

      const { accessToken, refreshToken, name, email } = result.data

      if (!accessToken || !email || !name) {
        throw new Error('Invalid response from server')
      }

      // Guardar tokens y usuario
      localStorage.setItem('accessToken', accessToken)
      localStorage.setItem('refreshToken', refreshToken)
      localStorage.setItem('user', JSON.stringify({ name, email }))

      login({ name, email })

      setTimeout(() => navigate('/authors'), 1000)
    } catch (error: any) {
      setLoading(false)
      toast.error(error.message ?? 'Login failed. Please try again.')
    }
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '70vh' }}>
        <CircularProgress size={60} />
      </Box>
    )
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '70vh',
        py: 4,
        px: 2,
        maxWidth: 500,
        mx: 'auto',
        textAlign: 'center',
      }}
    >
      <Typography variant="h4" component="h1" gutterBottom color="gray">
        Welcome back!
      </Typography>
      <Typography variant="body1" color="text.secondary" component="p" mb={3}>
        Please login to continue
      </Typography>

      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ width: '100%', mt: 2 }}>
        <TextField
          label={<Box sx={{ display: 'flex', alignItems: 'center', color: '#666' }}><EmailIcon fontSize="small" sx={{ mr: 0.5 }} />Email Address</Box>}
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          fullWidth
          margin="normal"
          error={!!errors.email}
          helperText={errors.email}
          sx={{ backgroundColor: '#fff', '& .MuiFormHelperText-root': { color: '#d32f2f' } }}
        />
        <TextField
          label={<Box sx={{ display: 'flex', alignItems: 'center', color: '#666' }}><LockIcon fontSize="small" sx={{ mr: 0.5 }} />Password</Box>}
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          fullWidth
          margin="normal"
          error={!!errors.password}
          helperText={errors.password}
          sx={{ backgroundColor: '#fff', '& .MuiFormHelperText-root': { color: '#d32f2f' } }}
        />
        <Box sx={{ display: 'flex', gap: 2, mt: 3, justifyContent: 'center', flexDirection: { xs: 'column', sm: 'row' } }}>
          <Button type="submit" variant="contained" color="primary" fullWidth>Login</Button>
          <Button type="button" variant="outlined" color="primary" component={RouterLink} to="/signup" fullWidth>Sign Up</Button>
        </Box>
      </Box>
    </Box>
  )
}

export default Login
