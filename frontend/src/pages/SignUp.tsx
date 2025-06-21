import React, { useState } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Select, { type SelectChangeEvent } from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import { useNavigate } from 'react-router-dom'

// Importa función de registro
import { signup } from '../services/auth-service'
import type { SignUpRequest } from '../types/authTypes'

// Iconos
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import EmailIcon from '@mui/icons-material/Email'
import LockIcon from '@mui/icons-material/Lock'
import MaleIcon from '@mui/icons-material/Male'
import FemaleIcon from '@mui/icons-material/Female'
import AccessibilityNewIcon from '@mui/icons-material/AccessibilityNew'

const SignUp = () => {
  const navigate = useNavigate()

  const [formData, setFormData] = useState<SignUpRequest>({
    name: '',
    email: '',
    password: '',
    gender: '',
  })

  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: '',
    gender: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  const handleSelectChange = (event: SelectChangeEvent) => {
    const name = event.target.name
    const value = event.target.value
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors = {
      name: '',
      email: '',
      password: '',
      gender: '',
    }
    let isValid = true

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
      isValid = false
    }

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
    if (isValid) {
      try {
        await signup(formData)
        // La redirección se hace desde aquí, no desde el servicio
        setTimeout(() => {
          navigate('/login')
        }, 1500)
      } catch (err) {
        console.error('Registration failed:', err)
      }
    } else {
      setErrors(newErrors)
    }
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
      {/* Título */}
      <Typography variant="h4" component="h1" gutterBottom color="gray">
        Create your account
      </Typography>
      {/* Subtítulo */}
      <Typography variant="body1" color="text.secondary" component="p">
        Fill in the form below to start exploring authors and favorites.
      </Typography>

      {/* Formulario */}
      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ width: '100%', mt: 2 }}>
        {/* Campo: Nombre */}
        <TextField
          label={
            <Box sx={{ display: 'flex', alignItems: 'center', color: '#666' }}>
              <AccountCircleIcon fontSize="small" sx={{ mr: 0.5 }} />
              Full Name
            </Box>
          }
          name="name"
          value={formData.name}
          onChange={handleChange}
          fullWidth
          margin="normal"
          error={!!errors.name}
          helperText={errors.name}
          sx={{
            backgroundColor: '#fff',
            '& label': { color: '#666' },
            '& input': { color: '#666' },
            '& .MuiFormHelperText-root': { color: '#d32f2f' },
          }}
        />

        {/* Campo: Email */}
        <TextField
          label={
            <Box sx={{ display: 'flex', alignItems: 'center', color: '#666' }}>
              <EmailIcon fontSize="small" sx={{ mr: 0.5 }} />
              Email Address
            </Box>
          }
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          fullWidth
          margin="normal"
          error={!!errors.email}
          helperText={errors.email}
          sx={{
            backgroundColor: '#fff',
            '& label': { color: '#666' },
            '& input': { color: '#666' },
            '& .MuiFormHelperText-root': { color: '#d32f2f' },
          }}
        />

        {/* Campo: Contraseña */}
        <TextField
          label={
            <Box sx={{ display: 'flex', alignItems: 'center', color: '#666' }}>
              <LockIcon fontSize="small" sx={{ mr: 0.5 }} />
              Password
            </Box>
          }
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          fullWidth
          margin="normal"
          error={!!errors.password}
          helperText={errors.password}
          sx={{
            backgroundColor: '#fff',
            '& label': { color: '#666' },
            '& input': { color: '#666' },
            '& .MuiFormHelperText-root': { color: '#d32f2f' },
          }}
        />

        {/* Campo: Género */}
        <FormControl fullWidth margin="normal" error={!!errors.gender}>
          <InputLabel id="gender-label">
            <Box sx={{ display: 'flex', alignItems: 'center', color: '#666' }}>
              <AccessibilityNewIcon fontSize="small" sx={{ mr: 0.5 }} />
              Gender
            </Box>
          </InputLabel>
          <Select
            labelId="gender-label"
            id="gender"
            name="gender"
            value={formData.gender}
            label="Gender"
            onChange={handleSelectChange}
            renderValue={(selected) => {
              if (!selected) {
                return (
                  <Box sx={{ display: 'flex', alignItems: 'center', color: '#666' }}>
                    <AccessibilityNewIcon fontSize="small" sx={{ mr: 0.5 }} />
                    Select your gender
                  </Box>
                )
              }
              if (selected === 'female') {
                return (
                  <Box sx={{ display: 'flex', alignItems: 'center', color: '#666' }}>
                    <FemaleIcon fontSize="small" sx={{ mr: 0.5 }} />
                    Female
                  </Box>
                )
              } else if (selected === 'male') {
                return (
                  <Box sx={{ display: 'flex', alignItems: 'center', color: '#666' }}>
                    <MaleIcon fontSize="small" sx={{ mr: 0.5 }} />
                    Male
                  </Box>
                )
              } else {
                return (
                  <Box sx={{ display: 'flex', alignItems: 'center', color: '#666' }}>
                    <AccessibilityNewIcon fontSize="small" sx={{ mr: 0.5 }} />
                    Other / Prefer not to say
                  </Box>
                )
              }
            }}
            sx={{
              color: '#666',
              '.MuiSelect-icon': { color: '#666' },
            }}
          >
            <MenuItem value="" disabled>
              <em>Select your gender</em>
            </MenuItem>
            <MenuItem value="female">
              <Box sx={{ display: 'flex', alignItems: 'center', color: '#666' }}>
                <FemaleIcon fontSize="small" sx={{ mr: 0.5 }} />
                Female
              </Box>
            </MenuItem>
            <MenuItem value="male">
              <Box sx={{ display: 'flex', alignItems: 'center', color: '#666' }}>
                <MaleIcon fontSize="small" sx={{ mr: 0.5 }} />
                Male
              </Box>
            </MenuItem>
            <MenuItem value="other">
              <Box sx={{ display: 'flex', alignItems: 'center', color: '#666' }}>
                <AccessibilityNewIcon fontSize="small" sx={{ mr: 0.5 }} />
                Other / Prefer not to say
              </Box>
            </MenuItem>
          </Select>
          {errors.gender && (
            <Typography variant="caption" color="error" sx={{ mt: 1, ml: 1.5, textAlign: 'left', display: 'block' }}>
              {errors.gender}
            </Typography>
          )}
        </FormControl>

        {/* Botones */}
        <Box sx={{ display: 'flex', gap: 2, mt: 3, justifyContent: 'center' }}>
          <Button type="button" variant="outlined" color="primary" onClick={() => navigate(-1)}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" color="primary">
            Register
          </Button>
        </Box>
      </Box>
    </Box>
  )
}

export default SignUp