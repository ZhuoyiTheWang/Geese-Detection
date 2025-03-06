import { Card, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination } from '@mui/material';
import { useState } from 'react';

export default function MobileTotalTable({parkTotals}) {
    const [page, setPage] = useState(0);
    const rowsPerPage = Math.floor(window.innerHeight / 110);;

    const data = Object.entries(parkTotals).map(([park, count]) => ({ park, count }));

    // Handle page change
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    // Calculate the rows to display based on pagination
    const rowsToDisplay = data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
    const emptyRows = rowsPerPage - rowsToDisplay.length;
  
    return (
      <Card sx={{ padding: '20px', border: '5px solid black', height: '100%' }}>
        <Typography variant="h6" component="div" gutterBottom>
          Total Counts
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ width: '70%' }}>Park</TableCell>
                <TableCell sx={{ width: '30%', textAlign: 'center' }}>Count</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rowsToDisplay.map((row, index) => (
                <TableRow key={index}>
                  <TableCell sx={{ width: '70%' }}>{row.park}</TableCell>
                  <TableCell sx={{ width: '30%', textAlign: 'center' }}>{row.count}</TableCell>
                </TableRow>
              ))}
              {emptyRows > 0 &&
                Array.from(Array(emptyRows)).map((_, idx) => (
                  <TableRow key={`empty-${idx}`}>
                    <TableCell colSpan={2} style={{ opacity: 0 }}>
                      Placeholder
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5]} // You can adjust this to other page sizes
          component="div"
          count={data.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
        />
      </Card>
    );
  }