import { Card, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination } from '@mui/material';
import { useState } from 'react';

export default function TotalTable(props) {
    const [page, setPage] = useState(0);
    const rowsPerPage = 5;

    // Placeholder data for demonstration
    const data = [
        { park: 'Adam', count: 500 },
        { park: 'Albert', count: 1000 },
        { park: 'Alex', count: 700 },
        { park: 'Alfred', count: 200 },
        { park: 'Alfred', count: 200 },
        { park: 'Alfred', count: 200 },
        { park: 'Alfred', count: 200 },
        // Add more placeholder rows if needed
    ];

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
                            <TableCell>Park</TableCell>
                            <TableCell>Count</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rowsToDisplay.map((row, index) => (
                            <TableRow key={index}>
                                <TableCell>{row.park}</TableCell>
                                <TableCell>{row.count}</TableCell>
                            </TableRow>
                        ))}
                        {emptyRows > 0 && Array.from(Array(emptyRows)).map((_, idx) => (
                            <TableRow key={`empty-${idx}`}>
                                <TableCell colSpan={2} style={{ opacity: 0 }}>Placeholder</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[6]}
                component="div"
                count={data.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
            />
        </Card>
    );
}