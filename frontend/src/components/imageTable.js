import { Card, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination } from '@mui/material';
import { useState } from 'react';

export default function ImageTable({ entries, onEntryClick }) {
  const [page, setPage] = useState(0);
  const rowsPerPage = 10;

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
              <TableCell style={{ width: '33%', textAlign: 'left' }}>Image</TableCell>
              <TableCell style={{ width: '33%', textAlign: 'left' }}>Park</TableCell>
              <TableCell style={{ width: '33%', textAlign: 'left' }}>Count</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rowsToDisplay.map((entry, index) => (
              <TableRow key={index}>
                {entry.count === 'Uncounted' ? (
                  <TableCell> {entry.name} </TableCell>
                ) : (
                  <TableCell
                    sx={{ color: 'blue', textDecoration: 'underline', cursor: 'pointer' }}
                    onClick={() => onEntryClick(entry.fileURL)}
                  >
                    {entry.name}
                  </TableCell>
                )}
                <TableCell>{entry.park}</TableCell>
                <TableCell>{entry.count ?? 0}</TableCell>
              </TableRow>
            ))}
            {emptyRows > 0 && Array.from(Array(emptyRows)).map((_, idx) => (
              <TableRow key={`empty-${idx}`}>
                <TableCell colSpan={3} style={{ opacity: 0 }}>
                  Placeholder
                </TableCell>
              </TableRow>
            ))}
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