import React, { useState } from 'react';
import { TextField, Button, Typography, Box } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function LoginPage({ setIsAuthenticated }) {
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    const correctPassword = 'goose';

    if (password === correctPassword) {
      setIsAuthenticated(true); // Update authentication state
    } else {
      toast.error('Incorrect Password'); // Display Toastify error
    }
  };

  return (
    <Box 
      display="flex" 
      flexDirection="column" 
      alignItems="center" 
      justifyContent="center" 
      height="100vh"
      bgcolor="#f5f5f5"
    >
      <Typography variant="h4" gutterBottom>
        Flock Watch
      </Typography>
      <Typography variant="h6" gutterBottom>
        Welcome Back!
      </Typography>
      <TextField 
        label="Password" 
        type="password" 
        variant="outlined" 
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        sx={{ my: 2, width: '300px' }}
      />
      <Button 
        variant="contained" 
        color="primary" 
        sx={{ width: '300px' }}
        onClick={handleLogin}
      >
        Sign In
      </Button>
      <ToastContainer position="top-right" autoClose={3000} />
    </Box>
  );
}
