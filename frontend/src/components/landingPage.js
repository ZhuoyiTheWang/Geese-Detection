import React, { useState } from 'react';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography, IconButton, List, ListItem, Select, FormControl, InputLabel, MenuItem } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { Close as CloseIcon } from '@mui/icons-material';
import TitleComponent from './title';
import ImageTable from './imageTable';
import TotalTable from './totalTable';
import InputFileUpload from './fileUpload';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function LandingPage() {
  const [entries, setEntries] = useState([]);
  const [openUploadDialog, setOpenUploadDialog] = useState(false);
  const [currentFiles, setCurrentFiles] = useState([]);
  const [selectedPark, setSelectedPark] = useState('');
  const [selectedImageURL, setSelectedImageURL] = useState(null);
  const [openImageDialog, setOpenImageDialog] = useState(false);

  const parks = [
    'Barnum',
    'Berkeley',
    'City Park',
    'Garfield',
    'Garland',
    'Green Valley Ranch',
    'Harvey',
    'Huston',
    'Rocky Mountain',
    'Ruby Hill',
    'Sloan',
    'Vanderbilt',
    'Washington'
];


  // Open the upload dialog
  const handleDialogOpen = () => {
    setOpenUploadDialog(true);
    setCurrentFiles([]);
    setSelectedPark('');
  };

  // Close the upload dialog
  const handleDialogClose = () => {
    setOpenUploadDialog(false);
  };

  // Handle park selection change
  const handleParkChange = (event) => {
    setSelectedPark(event.target.value);
  };

  // Show the selected image in a dialog
  const showImage = (fileURL) => {
    setSelectedImageURL(fileURL);
    setOpenImageDialog(true);
  };

  // Close the image dialog
  const handleImageDialogClose = () => {
    setOpenImageDialog(false);
    setSelectedImageURL(null);
  };

  // Add entries from uploaded files
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

  // Remove a file from the current files list
  const removeFile = (fileToRemove) => {
    setCurrentFiles((prevFiles) => prevFiles.filter(file => file !== fileToRemove));
  };

  // Handle the Count button click to call the FastAPI backend
  const handleCountClick = async () => {
    if (entries.length === 0) {
        toast.error('No entries to process!');
        return;
    }

    const base64Images = entries.map(entry => entry.fileURL);

    const loadingToastId = toast.loading('Counting...');
    try {
        const response = await axios.post('http://127.0.0.1:8000/count', {
            images: base64Images,
        });

        const { counts, output_images } = response.data;

        if (counts && output_images && counts.length === entries.length) {
          const updatedEntries = entries.map((entry, index) => ({
            ...entry,
            count: counts[index],
            fileURL: output_images[index],
          }));

          setEntries(updatedEntries);
        }

        toast.update(loadingToastId, {
            render: 'Count Complete!',
            type: 'success',
            isLoading: false,
            autoClose: 3000,
        });
    } catch (error) {
        console.error('Error calling count endpoint:', error);
        toast.update(loadingToastId, {
            render: 'Error occurred while counting',
            type: 'error',
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
            <ImageTable entries={entries} onEntryClick={showImage} />
          </Grid>

          {/* Right Column: Buttons */}
          <Grid size={3}>
            <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <Box>
                <Button
                  variant="contained"
                  onClick={handleDialogOpen}
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

      {/* Dialog for file upload */}
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
            <FormControl sx={{ width: '5hw', mt: 2, mb: 2 }}>
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

      {/* Dialog to show selected image */}
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

      {/* Toastify Container for notifications */}
      <ToastContainer position="top-right" />
    </div>
  );
}