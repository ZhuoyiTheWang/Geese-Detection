import React, { useState } from 'react';
import bcrypt from 'bcryptjs';
import { TextField, Button, Typography, Box, Avatar } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function LoginPage({ setIsAuthenticated }) {
  const [password, setPassword] = useState('');
  const bcrypt = require('bcryptjs');

  const storedHash = process.env.NEXT_PUBLIC_HASHED_PASSWORD;

  const handleLogin = async () => {
    const isPasswordCorrect = await bcrypt.compare(password, storedHash);

    if (isPasswordCorrect) {
      setIsAuthenticated(true); // Update authentication state
    } else {
      toast.error('Incorrect Password');
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
      <Avatar
        alt="Flock Watch Logo"
        src="/Flock Watch Login Logo.webp"
        sx={{ width: 500, height: 500, mb: 2 }}
      />
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