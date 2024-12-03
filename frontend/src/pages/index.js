import Head from 'next/head';
import React, { useState } from 'react';
import LandingPage from '@/components/landingPage';
import LoginPage from '@/components/loginPage';

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <>
    <Head>
      <link rel="icon" href="/Geese Icon.webp" />
        <title>Flock Watch</title>
    </Head>
      {isAuthenticated ? (
        <LandingPage />
      ) : (
        <LoginPage setIsAuthenticated={setIsAuthenticated} />
      )}
    </>
  );
}