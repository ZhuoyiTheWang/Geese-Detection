import React, { useState } from 'react';
import { Box, Button } from '@mui/material';
import Grid from '@mui/material/Grid2';
import TitleComponent from './title';
import ImageTable from './imageTable';
import TotalTable from './totalTable';
import axios from 'axios';

export default function LandingPage() {
  const [entries, setEntries] = useState([]);
  const [counts, setCounts] = useState([]);

  // Function to handle button click and add an entry
  const addEntry = () => {
    const newEntry = `Entry ${entries.length + 1}`;
    setEntries([...entries, newEntry]);
    const newCount = `Count ${entries.length + 1}`;
    setCounts([...counts, newCount]);
  };

// Function to handle Count button click and call the FastAPI backend
const handleCountClick = async () => {
  try {
    const response = await axios.get('http://127.0.0.1:8000/count');
    console.log(response.data.count);  // Logs the count value returned from the backend
  } catch (error) {
    console.error("Error calling count endpoint:", error);
  }
};

  return (
    <div>
      <Box sx={{display: 'flex', flexDirection: 'column', height: '100%'}}>
        <TitleComponent />
        <Grid container spacing={2} sx={{ margin: '20px', marginTop: '20px', height: '100%'}}>
          {/* Left Column: Table inside the Card */}
          <Grid size={9}>
            <ImageTable entries={entries} counts={counts}/>
          </Grid>

          {/* Right Column: Button */}
          <Grid size={3}>
            <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <Box>
                <Button variant="contained" onClick={addEntry} fullWidth sx={{ height: '12vh', fontSize: '2rem', marginBottom: '20px' }}>
                  Add Entry
                </Button>
                <Button 
                  variant="contained" 
                  onClick={handleCountClick} 
                  fullWidth 
                  color='success' 
                  sx={{ height: '12vh', fontSize: '2rem', marginBottom: '20px' }}>
                  Count
                </Button>
              </Box>
              
              <TotalTable />
            </Box>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
}