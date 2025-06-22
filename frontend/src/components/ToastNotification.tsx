import React from 'react'
import Snackbar from '@mui/material/Snackbar'
import Alert, { type AlertColor } from '@mui/material/Alert'
import CloseIcon from '@mui/icons-material/Close'; // Importamos el CloseIcon
import IconButton from '@mui/material/IconButton'; // Para el ícono de cierre

interface ToastNotificationProps {
  open: boolean
  onClose: () => void
  severity?: AlertColor
  message: React.ReactNode
  autoHideDuration?: number
  anchorOrigin?: {
    vertical: 'top' | 'bottom'
    horizontal: 'left' | 'center' | 'right'
  }
}

const ToastNotification: React.FC<ToastNotificationProps> = ({
  open,
  onClose,
  severity = 'info',
  message,
  autoHideDuration = 3000,
  anchorOrigin = { vertical: 'bottom', horizontal: 'center' },
}) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={onClose}
      anchorOrigin={anchorOrigin}
    >
      <Alert 
        onClose={onClose} 
        severity={severity} 
        sx={{ width: '100%' }} 
        icon={false}
        action={
          <IconButton 
            size="small" 
            color="inherit" 
            onClick={onClose} 
            aria-label="close"
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      >
        {message}
      </Alert>
    </Snackbar>
  )
}

export default ToastNotification;
