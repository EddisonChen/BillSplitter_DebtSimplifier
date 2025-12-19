import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useState } from 'react';
import Button from '@mui/material/Button';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import IconButton from '@mui/material/IconButton';

const PartiesView = ({partyInformation, parties, handleShowAddPartyModal}) => {

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
            (<TableContainer component={Paper} key={party.trxId} onClick={(()=> {
                handleShrink(party.trxId);
            })}>
                <Table sx={{
                    tableLayout: 'fixed',
                    width: '100%',
                }}>
                    <TableBody>
                        <TableRow>
                            <TableCell align="left" className="table-header">Name:</TableCell>
                            <TableCell align="left" className="table-info">{party.debtor}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell align="left" className="table-header">Base:</TableCell>
                            <TableCell align="left" className="table-info">${parseFloat(party.baseAmount.toFixed(2))}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell align="left" className="table-header">Tax:</TableCell>
                            <TableCell align="left" className="table-info">${parseFloat(party.taxAmount.toFixed(2))}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell align="left" className="table-header">Tip:</TableCell>
                            <TableCell align="left" className="table-info">${parseFloat(party.tipAmount.toFixed(2))}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell align="left" className="table-header">Total:</TableCell>
                            <TableCell align="left" className="table-info">${parseFloat(party.totalAmountOwed.toFixed(2))}</TableCell>
                        </TableRow>
                        <TableRow className="bottom-table-row">
                            <TableCell align="left" className="table-header">Items:</TableCell>
                            <TableCell align="left">
                                <ul>
                                    {party.items.map((item)=> (
                                        <li className="table-info" key={item.itemId}>{item.itemName} ({item.quantity}) </li>
                                    ))}
                                </ul>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>)
            : 
            (<TableContainer component={Paper} key={party.trxId} onClick={(()=> {
                handleExpand(party.trxId);
            })}
            >
                <Table sx={{
                    tableLayout: 'fixed',
                    width: '100%',
                }}>
                    <TableBody>
                        <TableRow>
                            <TableCell align="left" className="table-header">Name:</TableCell>
                            <TableCell align="left" className="table-info">{party.debtor}</TableCell>
                        </TableRow>
                        <TableRow className="bottom-table-row">
                            <TableCell align="left" className="table-header">Final Amount Owed:</TableCell>
                            <TableCell align="left" className="table-info">${parseFloat(party.totalAmountOwed.toFixed(2))}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>)
    )));

    return (
        <div>
            <div className="tab-header">
                <h3 className="head">Party Details</h3>
                  {parties === undefined && 
                    <Button aria-label="add party" className='add-temp-party-button' variant="contained" size="medium" onClick={handleShowAddPartyModal} endIcon={<PersonAddIcon/>}
                        sx={{margin: "12px 0px 12px 0px"}}
                    >Add Party</Button>}
            </div>
            {mappedParties}
        </div>
        
    )
}

export default PartiesView;