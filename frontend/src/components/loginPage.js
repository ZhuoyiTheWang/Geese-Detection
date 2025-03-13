import React, { useState } from 'react';
import bcrypt from 'bcryptjs';
import { TextField, Button, Typography, Box, Avatar, useMediaQuery } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function LoginPage({ setIsAuthenticated }) {
  const [password, setPassword] = useState('');
  const bcrypt = require('bcryptjs');
  const isMobile = useMediaQuery('(max-width:600px)'); // Check if screen width is 600px or smaller
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
      justifyContent="space-between"
      height="100vh"
      bgcolor="#f5f5f5"
      padding={isMobile ? 2 : 0}
    >
      {/* Logo and Title */}
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        marginTop={isMobile ? 4 : 8}
      >
        <Avatar
          alt="Flock Watch Logo"
          src="/Flock Watch Login Logo.webp"
          sx={{
            width: { xs: 150, sm: 250, md: 350, lg: 400 },
            height: { xs: 150, sm: 250, md: 350, lg: 400 },
            mb: 2,
          }}
        />
        <Typography variant="h5" gutterBottom>
          Flock Watch
        </Typography>
      </Box>

      {/* Login Form */}
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        width="100%"
        sx={{
          position: 'relative',
          bottom: isMobile ? '50px' : '80px', // Adjust vertical position for "Welcome Back!" and form
        }}
      >
        <Typography variant="subtitle1" gutterBottom>
          Welcome Back!
        </Typography>
        <TextField
          label="Password"
          type="password"
          variant="outlined"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          sx={{
            my: 2,
            width: { xs: '250px', sm: '300px' }, // Adjust width for smaller screens
          }}
        />
        <Button
          variant="contained"
          color="primary"
          sx={{
            width: { xs: '250px', sm: '300px' },
          }}
          onClick={handleLogin}
        >
          Sign In
        </Button>
      </Box>
      <ToastContainer position="top-right" autoClose={3000} />
    </Box>
  );
}