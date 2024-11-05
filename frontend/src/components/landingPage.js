import React, { useState } from 'react';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography, IconButton, List, ListItem } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { Close as CloseIcon } from '@mui/icons-material'
import TitleComponent from './title';
import ImageTable from './imageTable';
import TotalTable from './totalTable';
import InputFileUpload  from './fileUpload';

export default function LandingPage() {
  const [entries, setEntries] = useState([]);
  const [counts, setCounts] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentFiles, setCurrentFiles] = useState([]);

  const handleDialogOpen = () => {
    setOpenDialog(true);
    setCurrentFiles([]);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  const addEntries = () => {
    const newEntries = currentFiles.map((file) => file.name);
    setEntries((prevEntries) => [...prevEntries, ...newEntries]);

    const newCounts = currentFiles.map((_, index) => 0);
    setCounts((prevCounts) => [...prevCounts, ...newCounts]);

    handleDialogClose();
  };

  const removeFile = (fileToRemove) => {
    setCurrentFiles((prevFiles) => prevFiles.filter(file => file !== fileToRemove));
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
                <Button variant="contained" onClick={handleDialogOpen} fullWidth sx={{ height: '12vh', fontSize: '2rem', marginBottom: '20px' }}>
                  Add Entry
                </Button>
                <Button variant="contained" fullWidth color="success" sx={{ height: '12vh', fontSize: '2rem', marginBottom: '20px' }}>
                  Count
                </Button>
              </Box>
              
              <TotalTable />
            </Box>
          </Grid>
        </Grid>
      </Box>

      <Dialog open={openDialog} onClose={handleDialogClose} fullWidth>
        <DialogTitle>Upload Documents</DialogTitle>
        <DialogContent>
        {currentFiles.length > 0 && (
          <List sx={{ maxHeight: '20vh', overflowY: 'auto', mb: 2 }}>
            {currentFiles.map((file, index) => (
              <ListItem key={index} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2">{file.name}</Typography>
                <IconButton size="small" onClick={() => removeFile(file)}>
                  <CloseIcon fontSize="small" />
                </IconButton>
              </ListItem>
            ))}
          </List>
        )}
          <InputFileUpload setCurrentFiles={setCurrentFiles} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="secondary">Cancel</Button>
          <Button onClick={addEntries} color="primary" disabled={currentFiles.length === 0}>
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}