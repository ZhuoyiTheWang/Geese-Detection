import { Card, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination } from '@mui/material';
import { useState, useMemo } from 'react';

/**
 * Returns a stable color string for each groupId in the array.
 */
function generateColorPalette(groupIds) {
  // Provide as many distinct background colors as you expect groups
  const colors = [
    '#fff8c6',
    '#fde2e2',
    '#e2f9e1',
    '#e7e3fc',
    '#d9eaf7',
    '#fceade',
    '#e0e0e0',
    // ... add more if needed
  ];

  const map = {};
  let colorIndex = 0;

  // Assign each groupId a color from the list
  groupIds.forEach((gId) => {
    map[gId] = colors[colorIndex % colors.length];
    colorIndex++;
  });

  return map;
}

export default function MobileImageTable({ entries, onEntryClick, onCountEdit }) {
  const [page, setPage] = useState(0);
  const rowsPerPage = Math.floor(window.innerHeight / 110);

  /**
   * 1. Extract all groupIds (that are truthy) from entries
   */
  const groupIds = useMemo(() => {
    const set = new Set();
    entries.forEach((entry) => {
      if (entry.groupId) {
        set.add(entry.groupId);
      }
    });
    return Array.from(set);
  }, [entries]);

  /**
   * 2. Generate a map of groupId -> backgroundColor
   */
  const groupColorMap = useMemo(() => generateColorPalette(groupIds), [groupIds]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const rowsToDisplay = entries.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  const emptyRows = rowsPerPage - rowsToDisplay.length;

  return (
    <Card sx={{ padding: '20px', border: '5px solid black', height: '100%' }}>
      <Typography variant="h6" component="div" gutterBottom>
        Image Entries
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell style={{ width: '10%', textAlign: 'left' }}>Image</TableCell>
              <TableCell style={{ width: '61%', textAlign: 'left' }}>Park</TableCell>
              <TableCell style={{ width: '29%', textAlign: 'left' }}>Count</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rowsToDisplay.map((entry, index) => {
              // Determine background color for this entry’s groupId
              const rowBackground = entry.groupId ? groupColorMap[entry.groupId] : 'inherit';

              return (
                <TableRow key={index} sx={{ backgroundColor: rowBackground }}>
                  {entry.count === 'Uncounted' ? (
                    <TableCell
                      sx={{
                        maxWidth: '10px',
                        overflow: 'hidden',
                        whiteSpace: 'nowrap',
                        textOverflow: 'ellipsis'
                      }}
                    >
                      {entry.name}
                    </TableCell>
                  ) : (
                    <TableCell
                      sx={{
                        maxWidth: '10px',
                        color: 'blue',
                        textDecoration: 'underline',
                        cursor: 'pointer',
                        overflow: 'hidden',
                        whiteSpace: 'nowrap',
                        textOverflow: 'ellipsis'
                      }}
                      onClick={() => onEntryClick(entry.fileURL)}
                    >
                      {entry.name}
                    </TableCell>
                  )}
                  <TableCell
                    sx={{
                      overflow: 'hidden',
                      whiteSpace: 'nowrap',
                      textOverflow: 'ellipsis'
                    }}
                  >
                    {entry.park}
                  </TableCell>
                  <TableCell
                    sx={{
                      color: entry.count !== 'Uncounted' ? 'blue' : 'inherit',
                      textDecoration: entry.count !== 'Uncounted' ? 'underline' : 'none',
                      cursor: entry.count !== 'Uncounted' ? 'pointer' : 'default'
                    }}
                    onClick={() => {
                      if (entry.count !== 'Uncounted') {
                        onCountEdit(entry);
                      }
                    }}
                  >
                    {entry.count ?? 0}
                  </TableCell>
                </TableRow>
              );
            })}
            {emptyRows > 0 &&
              Array.from(Array(emptyRows)).map((_, idx) => (
                <TableRow key={`empty-${idx}`}>
                  <TableCell colSpan={3} style={{ opacity: 0 }}>
                    Placeholder
                  </TableCell>
                </TableRow>
              ))
            }
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10]}
        component="div"
        count={entries.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
      />
    </Card>
  );
}
