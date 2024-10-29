import React, { useState } from 'react';
import LandingPage from '@/components/landingPage';
import LoginPage from '@/components/loginPage';

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <>
      {isAuthenticated ? (
        <LandingPage />
      ) : (
        <LoginPage setIsAuthenticated={setIsAuthenticated} />
      )}
    </>
  );
}

