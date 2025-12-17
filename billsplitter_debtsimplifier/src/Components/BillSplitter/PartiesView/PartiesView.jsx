import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useState } from 'react';

const PartiesView = ({partyInformation}) => {

    const [expand, setExpand] = useState([]);

    const handleExpand = (trxId) => {
        const temp = structuredClone(expand);
        temp.push(trxId);
        setExpand(temp);
    }

    const handleShrink = (trxId) => {
        const filteredExpand = expand.filter((id) => (
            id !== trxId
        ));
        setExpand(filteredExpand);
    }

    const mappedParties = partyInformation.map((party) => (
        (expand.includes(party.trxId) ? 
            (<Table key={party.trxId} onClick={(()=> {
                handleShrink(party.trxId);
            })}>
                    <TableBody>
                        <TableRow>
                            <TableCell align="left">Name:</TableCell>
                            <TableCell align="left">{party.debtor}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell align="left">Base:</TableCell>
                            <TableCell align="left">${parseFloat(party.baseAmount.toFixed(2))}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell align="left">Tax:</TableCell>
                            <TableCell align="left">${parseFloat(party.taxAmount.toFixed(2))}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell align="left">Tip:</TableCell>
                            <TableCell align="left">${parseFloat(party.tipAmount.toFixed(2))}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell align="left">Total:</TableCell>
                            <TableCell align="left">${parseFloat(party.totalAmountOwed.toFixed(2))}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell align="left">Items:</TableCell>
                            <TableCell align="left">
                                <ul>
                                    {party.items.map((item)=> (
                                        <li key={item.itemId}>{item.itemName}</li>
                                    ))}
                                </ul>
                                
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>)
            : 
            (<Table key={party.trxId} onClick={(()=> {
                handleExpand(party.trxId);
            })}>
                    <TableBody>
                        <TableRow>
                            <TableCell align="left">Name:</TableCell>
                            <TableCell align="left">{party.debtor}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell align="left">Total Amount Owed:</TableCell>
                            <TableCell align="left">{parseFloat(party.totalAmountOwed.toFixed(2))}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>)
    )));

    return (
        <div>
            <h3>Parties</h3>
            <TableContainer component={Paper}>
                {mappedParties}
            </TableContainer>
        </div>
        
    )
}

export default PartiesView;