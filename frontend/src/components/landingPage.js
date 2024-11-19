import React, { useState } from 'react';
import { Box, Button } from '@mui/material';
import Grid from '@mui/material/Grid2';
import TitleComponent from './title';
import ImageTable from './imageTable';
import TotalTable from './totalTable';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function LandingPage() {
  const [entries, setEntries] = useState([]);
  const [counts, setCounts] = useState([]);

  // Function to handle button click and add an entry
  const addEntry = () => {
    const newEntry = `Image ${entries.length + 1}.png`;
    setEntries([...entries, newEntry]);
    setCounts([...counts, 0]); // Initialize count as 0
  };

  // Function to handle Count button click and call the FastAPI backend
  const handleCountClick = async () => {
    if (entries.length === 0) {
      toast.error("No entries to process!");
      return;
    }

    const loadingToastId = toast.loading("Counting...");

    try {
      const response = await axios.post('http://127.0.0.1:8000/count', {
        images: entries,
      });
      setCounts(response.data.counts); // Update counts with response
      toast.update(loadingToastId, {
        render: "Count Complete!",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
    } catch (error) {
      console.error("Error calling count endpoint:", error);
      toast.update(loadingToastId, {
        render: "Error occurred while counting",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    }
  };

  return (
    <div>
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <TitleComponent />
        <Grid container spacing={2} sx={{ margin: '20px', marginTop: '20px', height: '100%' }}>
          {/* Left Column: Table inside the Card */}
          <Grid size={9}>
            <ImageTable entries={entries} counts={counts} />
          </Grid>

          {/* Right Column: Button */}
          <Grid size={3}>
            <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <Box>
                <Button 
                  variant="contained" 
                  onClick={addEntry} 
                  fullWidth 
                  sx={{ height: '12vh', fontSize: '2rem', marginBottom: '20px' }}
                >
                  Add Entry
                </Button>
                <Button
                  variant="contained"
                  onClick={handleCountClick}
                  fullWidth
                  color="success"
                  sx={{ height: '12vh', fontSize: '2rem', marginBottom: '20px' }}
                >
                  Count
                </Button>
              </Box>
              <TotalTable />
            </Box>
          </Grid>
        </Grid>
      </Box>
      {/* Toastify Container */}
      <ToastContainer position="top-right" />
    </div>
  );
}

