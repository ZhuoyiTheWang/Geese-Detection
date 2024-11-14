import React, { useState } from 'react';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography, IconButton, List, ListItem, Select, FormControl, InputLabel, MenuItem } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { Close as CloseIcon } from '@mui/icons-material'
import TitleComponent from './title';
import ImageTable from './imageTable';
import TotalTable from './totalTable';
import InputFileUpload  from './fileUpload';



export default function LandingPage() {
  const [entries, setEntries] = useState([]);
  const [openUploadDialog, setopenUploadDialog] = useState(false);
  const [currentFiles, setCurrentFiles] = useState([]);
  const [selectedPark, setSelectedPark] = useState('');
  const [selectedImageURL, setSelectedImageURL] = useState(null);
  const [openImageDialog, setOpenImageDialog] = useState(false);

  const parks = ['Central Park', 'Greenwood Park', 'Sunset Park', 'Liberty Park'];

  const handleDialogOpen = () => {
    setopenUploadDialog(true);
    setCurrentFiles([]);
    setSelectedPark('');
  };

  const handleDialogClose = () => {
    setopenUploadDialog(false);
  };

  const handleParkChange = (event) => {
    setSelectedPark(event.target.value);
  };

  const showImage = (fileURL) => {
    setSelectedImageURL(fileURL);
    setOpenImageDialog(true);
  };

  const handleImageDialogClose = () => {
    setOpenImageDialog(false);
    setSelectedImageURL(null);
  };

  const addEntries = () => {
    const newEntries = [];

    currentFiles.forEach((file) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const fileURL = e.target.result;
          const entry = {
            name: file.name,
            fileURL: fileURL,
            count: 'Uncounted',
            park: selectedPark,
          };
          newEntries.push(entry);

          // After reading all files, update the entries state
          if (newEntries.length === currentFiles.length) {
            setEntries((prevEntries) => [...prevEntries, ...newEntries]);
            handleDialogClose();
          }
        };
        reader.readAsDataURL(file);
      }
    });
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
            <ImageTable entries={entries} onEntryClick={showImage} />
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

      <Dialog open={openUploadDialog} onClose={handleDialogClose} fullWidth>
        <DialogTitle>Upload Documents</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
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
            
            <FormControl sx={{width: '5hw', mt: 2, mb: 2 }}>
              <InputLabel>Select Park</InputLabel>
              <Select value={selectedPark} onChange={handleParkChange} label="Select Park">
                {parks.map((park, index) => (
                  <MenuItem key={index} value={park}>
                    {park}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="secondary">Cancel</Button>
          <Button onClick={addEntries} color="primary" disabled={currentFiles.length === 0 || !selectedPark}>
            Add
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog maxWidth="md" fullWidth open={openImageDialog} onClose={handleImageDialogClose}>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'flex-end' }}> 
          <IconButton
            edge="end"
            color="inherit"
            onClick={handleImageDialogClose}
            aria-label="close"
            sx={{ ml: 2 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {selectedImageURL && (
            <img src={selectedImageURL} alt="Selected" style={{ width: '100%', height: 'auto' }} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}