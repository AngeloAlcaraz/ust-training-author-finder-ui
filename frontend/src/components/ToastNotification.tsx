import React from 'react'
import Snackbar from '@mui/material/Snackbar'
import Alert, { type AlertColor } from '@mui/material/Alert'

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
      <Alert onClose={onClose} severity={severity} sx={{ width: '100%' }} icon={false}>
        {message}
      </Alert>
    </Snackbar>
  )
}

export default ToastNotification
