import { Card, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

export default function TotalTable(props) {
    return (
        <Card sx={{ padding: '20px', border: '5px solid black' }}>
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
            <TableRow>
                <TableCell>Adam</TableCell>
                <TableCell>500</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    );
  }