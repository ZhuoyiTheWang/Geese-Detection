import React, { useState } from 'react';
import { Box, Button } from '@mui/material';
import Grid from '@mui/material/Grid2';
import TitleComponent from './title';
import ImageTable from './imageTable';
import TotalTable from './totalTable';

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

  return (
    <div>
      <TitleComponent />
      <Grid container spacing={2} sx={{ margin: '20px', marginTop: '20px' }}>
        {/* Left Column: Table inside the Card */}
        <Grid size={9}>
          <ImageTable entries={entries} counts={counts}/>
        </Grid>

        {/* Right Column: Button */}
        <Grid size={3}>
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <Button variant="contained" onClick={addEntry} fullWidth sx={{ height: '16vh', fontSize: '2rem', marginBottom: '20px' }}>
              Add Entry
            </Button>
            <Button variant="contained" fullWidth color='success' sx={{ height: '16vh', fontSize: '2rem', marginBottom: '20px' }}>
              Count
            </Button>
            
            <TotalTable />
          </Box>
        </Grid>
      </Grid>
    </div>
  );
}