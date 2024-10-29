import React, { useState } from 'react';
import { TextField, Button, Typography, Box } from '@mui/material';

export default function LoginPage({ setIsAuthenticated }) {
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    const correctPassword = 'Goose'; // Replace with your desired password

    if (password === correctPassword) {
      setIsAuthenticated(true); // Update authentication state
    } else {
      alert('Incorrect Password');
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
    </Box>
  );
}