import React, { useState } from 'react';
import {
  Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography,
  IconButton, List, ListItem, Select, FormControl, InputLabel, MenuItem,
  FormControlLabel, Checkbox
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import { Close as CloseIcon } from '@mui/icons-material';
import TitleComponent from './title';
import ImageTable from './imageTable';
import TotalTable from './totalTable';
import InputFileUpload from './fileUpload';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { v4 as uuidv4 } from 'uuid';

export default function LandingPage() {
  const [entries, setEntries] = useState([]);
  const [openUploadDialog, setOpenUploadDialog] = useState(false);
  const [currentFiles, setCurrentFiles] = useState([]);
  const [selectedPark, setSelectedPark] = useState('');
  const [selectedImageURL, setSelectedImageURL] = useState(null);
  const [openImageDialog, setOpenImageDialog] = useState(false);
  // <-- Make sure to reset this whenever the user opens the dialog:
  const [grouped, setGrouped] = useState(false);

  const parks = [
    'Barnum', 'Berkeley', 'City Park', 'Garfield', 'Garland',
    'Green Valley Ranch', 'Harvey', 'Huston', 'Rocky Mountain',
    'Ruby Hill', 'Sloan', 'Vanderbilt', 'Washington'
  ];

  // ---------------------------
  // 1. Open/Close upload dialog
  // ---------------------------
  const handleDialogOpen = () => {
    setOpenUploadDialog(true);
    setCurrentFiles([]);
    setSelectedPark('');
    // Reset checkbox to "unchecked"
    setGrouped(false);
  };

  const handleDialogClose = () => {
    setOpenUploadDialog(false);
  };

  // ---------------------------
  // Park dropdown change
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
  // Calculate Park Totals
  // ---------------------------
  /**
   * If a set of entries share a groupId, they are “grouped”.
   * We only add their average ONCE for that entire group.
   * Ungrouped entries are counted individually.
   */
  const calculateParkTotals = (entries, parks) => {
    // Initialize totals to 0 for each park
    const parkTotals = {};
    parks.forEach((p) => { parkTotals[p] = 0; });

    // Group by (park -> { groupId -> [entries] })
    const groupedByPark = {};
    entries.forEach((entry) => {
      const { park, groupId } = entry;
      if (!groupedByPark[park]) {
        groupedByPark[park] = {};
      }
      // For ungrouped items, treat each as its own “group” using the entry’s id
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
        // If they share a groupId, they should all have the same .count after averaging
        // so just read the .count from the first item
        const groupCount = parseInt(first.count, 10) || 0;
        parkSum += groupCount;
      });
      parkTotals[park] = parkSum;
    });

    return parkTotals;
  };

  // ---------------------------
  // Add (upload) new files
  // ---------------------------
  const addEntries = () => {
    const newEntries = [];
    // If “Average these images” is checked, generate one groupId
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
            groupId: newGroupId,
            // We'll later store the raw count from the backend in an internal field if needed
          };
          newEntries.push(entry);

          // After the last file is read, update state
          if (newEntries.length === currentFiles.length) {
            setEntries((prevEntries) => [...prevEntries, ...newEntries]);
            handleDialogClose();
          }
        };
        reader.readAsDataURL(file);
      }
    });
  };

  // Remove a file from the current files list (before hitting “Add”)
  const removeFile = (fileToRemove) => {
    setCurrentFiles((prevFiles) => prevFiles.filter(file => file !== fileToRemove));
  };

  // ---------------------------
  // Counting Logic
  // ---------------------------
  const handleCountClick = async () => {
    const uncountedEntries = entries.filter((e) => e.count === 'Uncounted');

    if (uncountedEntries.length === 0) {
      toast.error('No uncounted entries to process!');
      return;
    }

    const loadingToastId = toast.loading('Counting...');
    
    // Make a local copy that we can modify before doing one final setEntries
    let updatedEntries = [...entries];

    // Process uncounted images in batches of 10
    for (let i = 0; i < uncountedEntries.length; i += 10) {
      const batch = uncountedEntries.slice(i, i + 10);
      const base64Images = batch.map((entry) => entry.fileURL);

      try {
        const response = await axios.post('https://goose.backend.minigathering.com/count', {
          images: base64Images,
        });

        const { counts, output_images } = response.data;

        if (counts && output_images && counts.length === batch.length) {
          // Temporarily store the raw backendCount + updated fileURL
          // in updatedEntries — but do NOT finalize .count yet
          batch.forEach((entry, idx) => {
            const entryIndex = updatedEntries.findIndex((e) => e.id === entry.id);
            if (entryIndex !== -1) {
              updatedEntries[entryIndex] = {
                ...updatedEntries[entryIndex],
                backendCount: counts[idx],    // raw count from backend
                fileURL: output_images[idx],  // update bounding-box overlay
              };
            }
          });
        } else {
          toast.error('Mismatch in counts and output images for a batch');
        }
      } catch (error) {
        console.error('Error calling count endpoint for a batch:', error);
        toast.error('Error occurred while counting a batch');
      }
    }

    //
    // AFTER all batches finish, compute final counts for each entry:
    // If groupId != null, we want the same average for that entire group.
    //
    // 1) Build a map of groupId -> all raw counts
    // 2) If groupId is null => no average, final = backendCount
    // 3) If groupId is not null => average all backendCount, assign that as .count
    //
    const groupedCounts = {};
    updatedEntries.forEach((item) => {
      // Only compute for items that had a backendCount (newly counted)
      // or were "Uncounted" (some leftover). If item.count !== 'Uncounted',
      // it might already have a final count from a previous run.
      if (item.count === 'Uncounted') {
        const gId = item.groupId ?? item.id; // if no group, treat each individually
        if (!groupedCounts[gId]) {
          groupedCounts[gId] = [];
        }
        // If some reason we never got a backendCount (like an error?), treat it as 0
        const rawValue = item.backendCount ? parseInt(item.backendCount, 10) : 0;
        groupedCounts[gId].push({ ...item, rawValue });
      }
    });

    // For each groupId, compute the average if actually grouped; otherwise use rawValue
    Object.keys(groupedCounts).forEach((gId) => {
      const groupItems = groupedCounts[gId];
      if (!groupItems || !groupItems.length) return;

      // Check if actual grouping or single
      // If grouped, groupItems[0].groupId != null => average them
      const isGrouped = groupItems[0].groupId != null;

      if (isGrouped) {
        const sum = groupItems.reduce((acc, it) => acc + it.rawValue, 0);
        const avg = Math.floor(sum / groupItems.length);

        // Assign that .count to each item in the group
        groupItems.forEach((it) => {
          const idx = updatedEntries.findIndex((e) => e.id === it.id);
          if (idx !== -1) {
            updatedEntries[idx] = {
              ...updatedEntries[idx],
              count: avg.toString(), // store final as string
            };
          }
        });
      } else {
        // Not grouped => final = rawValue for each
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

    // Now we have final .count for all items.
    // Commit everything to state
    setEntries(updatedEntries);

    toast.update(loadingToastId, {
      render: 'Count Complete!',
      type: 'success',
      isLoading: false,
      autoClose: 3000,
    });
  };

  // ---------------------------
  // Render
  // ---------------------------
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
              <Select
                value={selectedPark}
                onChange={handleParkChange}
                label="Select Park"
              >
                {parks.map((park, index) => (
                  <MenuItem key={index} value={park}>
                    {park}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

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
          <Button onClick={handleDialogClose} color="secondary">Cancel</Button>
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

      {/* Toastify Container for notifications */}
      <ToastContainer position="top-right" />
    </div>
  );
}
