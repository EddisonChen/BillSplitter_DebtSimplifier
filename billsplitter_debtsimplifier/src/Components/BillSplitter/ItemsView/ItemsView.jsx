import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import { useState } from 'react';
import AddItem from '../SpeedDialActions/AddItem';
import PersonAddIcon from '@mui/icons-material/PersonAdd';


const ItemsView = ({itemsWithCalculations, tempParties, items, setItems, parties, handleShowAddPartyModal}) => {

    const [editItemMode, setEditItemMode] = useState(false);
    const [editItemId, setEditItemId] = useState('');

    const toggleEditMode = () => {
        setEditItemMode(!editItemMode);
    }

    const handleItemId = (id) => {
        setEditItemId(id)
    }

    const mappedItems = itemsWithCalculations.map((item) => (
        <TableContainer component={Paper} key={item.itemId} >
            <Table sx={{
                    tableLayout: 'fixed',
                    width: '100%',
                }}>
                <TableBody onClick={(()=> {
                    toggleEditMode();
                    handleItemId(item.itemId);
                })}>
                    <TableRow >
                        <TableCell align="left" className="table-header">Name (Quantity):</TableCell>
                        <TableCell align="left" className="table-info">{item.itemName} ({item.quantity})</TableCell>
                    </TableRow>
                    <TableRow >
                        <TableCell align="left" className="table-header">Final Price:</TableCell>
                        <TableCell align="left" className="table-info">${parseFloat(item.totalCost.toFixed(2))} {item.quantity > 1 && item.totalCost > 0 ? `($${parseFloat((item.singleItemValues.totalCost).toFixed(2))} per)`: null}</TableCell>
                    </TableRow>
                    <TableRow className="bottom-table-row">
                        <TableCell align="left" className="table-header">Split Between: </TableCell>
                        <TableCell align="left">
                            <ul>
                                {item.involvedParties.map((party)=> (
                                    <li className="table-info" key={party}>{party}</li>
                                ))}
                            </ul>
                        </TableCell>
                    </TableRow>
                </TableBody>
                {editItemMode && editItemId === item.itemId && <AddItem
                    editItemMode={editItemMode}
                    parties={tempParties}
                    toggleModal={toggleEditMode}
                    showModal={editItemMode}
                    items={items}
                    setItems={setItems}
                    itemId={item.itemId}
                    />}
            </Table>
        </TableContainer>
        
    ));

    return (
        <div>
            <div className="tab-header">
                <h3 className="head">Item Details</h3>
                 {parties === undefined && 
                <Button aria-label="add party" className='add-temp-party-button' variant="contained" size="medium" onClick={handleShowAddPartyModal} endIcon={<PersonAddIcon/>}
                    sx={{margin: "12px 0px 12px 0px"}}
                >Add Party</Button>}
            </div>
            {mappedItems}
        </div>
    )
}

export default ItemsView;