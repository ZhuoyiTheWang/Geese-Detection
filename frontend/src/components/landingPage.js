import React, { useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  IconButton,
  List,
  ListItem,
  Select,
  FormControl,
  InputLabel,
  MenuItem,
  FormControlLabel,
  Checkbox
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import { Close as CloseIcon } from '@mui/icons-material';
import TitleComponent from './title';
import MobileTitleComponent from './mobileTitle';
import MobileImageTable from './mobileImageTable';
import MobileTotalTable from './mobileTotalTable';
import ImageTable from './imageTable';
import TotalTable from './totalTable';
import InputFileUpload from './fileUpload';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { v4 as uuidv4 } from 'uuid';

// For responsive checks
import { useMediaQuery, Tabs, Tab } from '@mui/material';

export default function LandingPage() {
  // ---------------------------
  // State
  // ---------------------------
  const [entries, setEntries] = useState([]);
  const [openUploadDialog, setOpenUploadDialog] = useState(false);
  const [currentFiles, setCurrentFiles] = useState([]);
  const [selectedPark, setSelectedPark] = useState('');
  const [selectedImageURL, setSelectedImageURL] = useState(null);
  const [openImageDialog, setOpenImageDialog] = useState(false);
  const [grouped, setGrouped] = useState(false); // For "average these images"

  // Mobile tab
  const [selectedTab, setSelectedTab] = useState(0);
  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  // Check if mobile
  const isMobile = useMediaQuery('(max-width:600px)');

  // Park array
  const parks = [
    'Barnum', 'Berkeley', 'City Park', 'Garfield', 'Garland',
    'Green Valley Ranch', 'Harvey', 'Huston', 'Rocky Mountain',
    'Ruby Hill', 'Sloan', 'Vanderbilt', 'Washington'
  ];

  // ---------------------------
  // Dialog open/close
  // ---------------------------
  const handleDialogOpen = () => {
    setOpenUploadDialog(true);
    setCurrentFiles([]);
    setSelectedPark('');
    setGrouped(false); // Reset grouping checkbox each time
  };

  const handleDialogClose = () => {
    setOpenUploadDialog(false);
  };

  // ---------------------------
  // Park change
  // ---------------------------
  const handleParkChange = (event) => {
    setSelectedPark(event.target.value);
  };

  // ---------------------------
  // Show/Hide full-size image
  // ---------------------------
  const showImage = (fileURL) => {
    setSelectedImageURL(fileURL);
    setOpenImageDialog(true);
  };

  const handleImageDialogClose = () => {
    setOpenImageDialog(false);
    setSelectedImageURL(null);
  };

  // ---------------------------
  // Remove a file before upload
  // ---------------------------
  const removeFile = (fileToRemove) => {
    setCurrentFiles((prevFiles) => prevFiles.filter((file) => file !== fileToRemove));
  };

  // ---------------------------
  // Calculate park totals
  // (Honors grouping: each group's average counted once)
  // ---------------------------
  const calculateParkTotals = (entries, parks) => {
    const parkTotals = {};
    parks.forEach((p) => { parkTotals[p] = 0; });

    // Group by (park -> { groupId -> [entries] })
    const groupedByPark = {};
    entries.forEach((entry) => {
      const { park, groupId } = entry;
      if (!groupedByPark[park]) {
        groupedByPark[park] = {};
      }
      // If ungrouped, treat each as its own “group” using the entry’s id
      const key = groupId ?? `individual-${entry.id}`;
      if (!groupedByPark[park][key]) {
        groupedByPark[park][key] = [];
      }
      groupedByPark[park][key].push(entry);
    });

    // For each park, sum the counts but only once per group
    Object.keys(groupedByPark).forEach((park) => {
      let parkSum = 0;
      const groupBuckets = groupedByPark[park];
      Object.values(groupBuckets).forEach((entriesInGroup) => {
        if (!entriesInGroup.length) return;
        const first = entriesInGroup[0];
        // If they share a groupId, they should all have the same .count
        const groupCount = parseInt(first.count, 10) || 0;
        parkSum += groupCount;
      });
      parkTotals[park] = parkSum;
    });

    return parkTotals;
  };

  // ---------------------------
  // Add new entries
  // (If "average these images" is checked => groupId is the same)
  // ---------------------------
  const addEntries = () => {
    const newEntries = [];
    const newGroupId = grouped ? uuidv4() : null;

    currentFiles.forEach((file) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const fileURL = e.target.result;
          const entry = {
            id: uuidv4(),
            name: file.name,
            fileURL,
            count: 'Uncounted',
            park: selectedPark,
            groupId: newGroupId
          };
          newEntries.push(entry);

          // Update state after all files are read
          if (newEntries.length === currentFiles.length) {
            setEntries((prevEntries) => [...prevEntries, ...newEntries]);
            handleDialogClose();
          }
        };
        reader.readAsDataURL(file);
      }
    });
  };

  // ---------------------------
  // Count uncounted entries
  // Batching + grouping logic
  // ---------------------------
  const handleCountClick = async () => {
    const uncountedEntries = entries.filter((e) => e.count === 'Uncounted');

    if (uncountedEntries.length === 0) {
      toast.error('No uncounted entries to process!');
      return;
    }

    const loadingToastId = toast.loading('Counting...');
    let updatedEntries = [...entries];

    // Process in batches of 10
    for (let i = 0; i < uncountedEntries.length; i += 10) {
      const batch = uncountedEntries.slice(i, i + 10);
      const base64Images = batch.map((entry) => entry.fileURL);

      try {
        const response = await axios.post('http://127.0.0.1:8000/count', {
          images: base64Images,
        });
        const { counts, output_images } = response.data;

        if (counts && output_images && counts.length === batch.length) {
          batch.forEach((entry, idx) => {
            const entryIndex = updatedEntries.findIndex((e) => e.id === entry.id);
            if (entryIndex !== -1) {
              updatedEntries[entryIndex] = {
                ...updatedEntries[entryIndex],
                backendCount: counts[idx],     // raw count from backend
                fileURL: output_images[idx],   // bounding-box overlay
              };
            }
          });
        } else {
          toast.error('Mismatch in counts and output_images for this batch');
        }
      } catch (error) {
        console.error('Error calling count endpoint for a batch:', error);
        toast.error('Error occurred while counting a batch');
      }
    }

    // After all batches, compute final .count for each group
    const groupedCounts = {};
    updatedEntries.forEach((item) => {
      if (item.count === 'Uncounted') {
        const gId = item.groupId ?? item.id;
        if (!groupedCounts[gId]) {
          groupedCounts[gId] = [];
        }
        const rawValue = item.backendCount ? parseInt(item.backendCount, 10) : 0;
        groupedCounts[gId].push({ ...item, rawValue });
      }
    });

    Object.keys(groupedCounts).forEach((gId) => {
      const groupItems = groupedCounts[gId];
      if (!groupItems || !groupItems.length) return;

      // Check if actual grouping or single
      const isGrouped = groupItems[0].groupId != null;
      if (isGrouped) {
        const sum = groupItems.reduce((acc, it) => acc + it.rawValue, 0);
        const avg = Math.floor(sum / groupItems.length);
        groupItems.forEach((it) => {
          const idx = updatedEntries.findIndex((e) => e.id === it.id);
          if (idx !== -1) {
            updatedEntries[idx] = {
              ...updatedEntries[idx],
              count: avg.toString(),
            };
          }
        });
      } else {
        // Not grouped => final = rawValue
        groupItems.forEach((it) => {
          const idx = updatedEntries.findIndex((e) => e.id === it.id);
          if (idx !== -1) {
            updatedEntries[idx] = {
              ...updatedEntries[idx],
              count: it.rawValue.toString(),
            };
          }
        });
      }
    });

    setEntries(updatedEntries);

    toast.update(loadingToastId, {
      render: 'Count Complete!',
      type: 'success',
      isLoading: false,
      autoClose: 3000,
    });
  };

  // ---------------------------
  // Rendering
  // ---------------------------
  return isMobile ? (
    // ------------------------------------------
    // MOBILE LAYOUT
    // ------------------------------------------
    <div>
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <MobileTitleComponent />
        <Tabs value={selectedTab} onChange={handleTabChange} centered sx={{ marginBottom: 3 }}>
          <Tab label="Images" />
          <Tab label="Results" />
        </Tabs>

        {selectedTab === 0 && (
          <Grid item xs={12} sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <MobileImageTable
              entries={entries}
              onEntryClick={showImage}
              sx={{ flex: 1, minHeight: 0 }}
            />
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
                height: '14vh',
              }}
            >
              <Button
                variant="contained"
                onClick={handleDialogOpen}
                sx={{
                  fontSize: '1.5rem',
                  width: '90%',
                  height: '50%',
                }}
              >
                Add Entry
              </Button>
            </Box>
          </Grid>
        )}

        {selectedTab === 1 && (
          <Grid item xs={12} sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <MobileTotalTable
              parkTotals={calculateParkTotals(entries, parks)}
              sx={{ flex: 1, minHeight: 0, width: '100%', overflowX: 'auto' }}
            />
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
                height: '14vh',
                gap: '5px',
              }}
            >
              <Button
                variant="contained"
                color="success"
                onClick={handleCountClick}
                sx={{ fontSize: '1.5rem', width: '48%', height: '50%' }}
              >
                Count
              </Button>
              <Button
                variant="contained"
                color="warning"
                //onClick={handleDownloadClick}
                sx={{ fontSize: '1.5rem', width: '48%', height: '50%' }}
              >
                Download
              </Button>
            </Box>
          </Grid>
        )}
      </Box>

      {/* Dialog for file upload */}
      <Dialog open={openUploadDialog} onClose={handleDialogClose} fullWidth>
        <DialogTitle>Upload Documents</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            {currentFiles.length > 0 && (
              <List sx={{ maxHeight: '20vh', overflowY: 'auto', mb: 2 }}>
                {currentFiles.map((file, index) => (
                  <ListItem
                    key={index}
                    sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                  >
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

            {/* Grouping checkbox */}
            <FormControlLabel
              control={
                <Checkbox
                  checked={grouped}
                  onChange={(e) => setGrouped(e.target.checked)}
                  color="primary"
                />
              }
              label="Average these images"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="secondary">
            Cancel
          </Button>
          <Button
            onClick={addEntries}
            color="primary"
            disabled={currentFiles.length === 0 || !selectedPark}
          >
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
            <img
              src={selectedImageURL}
              alt="Selected"
              style={{ width: '100%', height: 'auto' }}
            />
          )}
        </DialogContent>
      </Dialog>

      <ToastContainer position="top-right" />
    </div>
  ) : (
    // ------------------------------------------
    // DESKTOP LAYOUT
    // ------------------------------------------
    <div>
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <TitleComponent />
        <Grid container spacing={2} sx={{ margin: '20px', marginTop: '5px', height: '100%' }}>
          <Grid size={9}>
            <ImageTable entries={entries} onEntryClick={showImage} />
          </Grid>

          <Grid size={3}>
            <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <Button
                variant="contained"
                onClick={handleDialogOpen}
                fullWidth
                sx={{ height: '8vh', fontSize: '2rem', marginBottom: '15px' }}
              >
                Add Entry
              </Button>
              <Button
                variant="contained"
                onClick={handleCountClick}
                fullWidth
                color="success"
                sx={{ height: '8vh', fontSize: '2rem', marginBottom: '15px' }}
              >
                Count
              </Button>
              <Button
                variant="contained"
                //onClick={handleDownloadClick}
                fullWidth
                color="warning"
                sx={{ height: '8vh', fontSize: '2rem', marginBottom: '15px' }}
              >
                Download
              </Button>
              <TotalTable parkTotals={calculateParkTotals(entries, parks)} />
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
                  <ListItem
                    key={index}
                    sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                  >
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

            {/* Grouping checkbox */}
            <FormControlLabel
              control={
                <Checkbox
                  checked={grouped}
                  onChange={(e) => setGrouped(e.target.checked)}
                  color="primary"
                />
              }
              label="Average these images"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="secondary">
            Cancel
          </Button>
          <Button
            onClick={addEntries}
            color="primary"
            disabled={currentFiles.length === 0 || !selectedPark}
          >
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
            <img
              src={selectedImageURL}
              alt="Selected"
              style={{ width: '100%', height: 'auto' }}
            />
          )}
        </DialogContent>
      </Dialog>

      <ToastContainer position="top-right" />
    </div>
  );
}
