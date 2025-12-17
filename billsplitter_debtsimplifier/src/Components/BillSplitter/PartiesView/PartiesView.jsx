import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useState } from 'react';

const PartiesView = ({partyInformation}) => {

    const [expand, setExpand] = useState();

    const handleExpand = (id) => {
        setExpand(id)
    }

    const handleShrink = () => {
        setExpand(null);
    }

    const mappedParties = partyInformation.map((party) => (
        (expand === party.trxId ? 
            (<TableRow key={party.trxId} onClick={handleShrink}>
                <TableCell>{party.debtor}</TableCell>
                
            </TableRow>)
            : 
            (<TableRow key={party.trxId} value={party.trxId} onClick={(() => {
                handleExpand(party.trxId)
            })
                }>
                <TableCell >{party.debtor}</TableCell>
                <TableCell>${party.totalAmountOwed}</TableCell>
            </TableRow>))
    ))

    return (
        <div>
            <h3>Parties</h3>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell align="left">Party</TableCell>
                            <TableCell align="left">Amount Spent</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {mappedParties}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
        
    )
}

export default PartiesView;