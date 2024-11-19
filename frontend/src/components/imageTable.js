import { Card, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination } from '@mui/material';
import { useState } from 'react';

export default function ImageTable({ entries, counts }) {
    const [page, setPage] = useState(0);
    const rowsPerPage = 10;

    // Handle page change
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    // Calculate the rows to display based on pagination
    const rowsToDisplay = entries.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
    const emptyRows = rowsPerPage - rowsToDisplay.length;

    return (
        <Card sx={{ padding: '20px', border: '5px solid black', height: '100%' }}>
            <Typography variant="h6" component="div" gutterBottom>
                Image Entries
            </Typography>

            {/* Table to display entries */}
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
                                <TableCell sx={{ color: 'blue', textDecoration: 'underline' }}>
                                    {entry}
                                </TableCell>
                                <TableCell>Adam</TableCell>
                                {/* Display the corresponding count */}
                                <TableCell>{counts[index] ?? 0}</TableCell>
                            </TableRow>
                        ))}
                        {emptyRows > 0 && Array.from(Array(emptyRows)).map((_, idx) => (
                            <TableRow key={`empty-${idx}`} >
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
