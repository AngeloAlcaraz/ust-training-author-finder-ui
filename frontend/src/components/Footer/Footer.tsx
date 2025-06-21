import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        textAlign: 'center',
        backgroundColor: '#0f172a', // Azul oscuro elegante
        color: 'white',
        fontFamily: '"Inter", "Roboto", sans-serif',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 -1px 4px rgba(0, 0, 0, 0.1)',
      }}
    >
      {/* Copyright */}
      <Typography variant="body2" color="inherit">
       Author Finder &copy; {currentYear} — Powered by Team 1
      </Typography>      
    </Box>
  )
}

export default Footer