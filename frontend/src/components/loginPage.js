import React, { useState } from 'react';
import { TextField, Button, Typography, Box, Avatar } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function LoginPage({ setIsAuthenticated }) {
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    const correctPassword = 'goose'; // Replace with process.env.REACT_APP_HASHED_PASSWORD for environment variable

    if (password === correctPassword) {
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
        src="https://files.oaiusercontent.com/file-StFIeUjxO04bFr5TjEqcK7VN?se=2024-11-19T15%3A56%3A21Z&sp=r&sv=2024-08-04&sr=b&rscc=max-age%3D604800%2C%20immutable%2C%20private&rscd=attachment%3B%20filename%3D505045ce-b8b2-4f19-b86e-cd97192e8a37.webp&sig=W032OPvq87XnL5bl0gZtUKQtZYoExeqk3B1pvZVPYgA%3D"
        sx={{ width: 160, height: 160, mb: 2 }}
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