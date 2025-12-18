import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import { useState } from 'react';
import AddItem from '../SpeedDialActions/AddItem';

const ItemsView = ({itemsWithCalculations, tempParties, items, setItems}) => {

    const [editItemMode, setEditItemMode] = useState(false);
    const [editItemId, setEditItemId] = useState('');

    const toggleEditMode = () => {
        setEditItemMode(!editItemMode);
    }

    const handleItemId = (id) => {
        setEditItemId(id)
    }

    const handleRemoveItem = (event) => {
        const id = event.target.value;
        const updatedItems = items.filter(item => item.itemId !== id);
        setItems(updatedItems);
    }

    const mappedItems = itemsWithCalculations.map((item) => (
        <div key={item.itemId} >
            <Table >
                <TableBody onClick={(()=> {
                    toggleEditMode();
                    handleItemId(item.itemId);
                })}>
                    <TableRow >
                        <TableCell align="left">Name (Quantity):</TableCell>
                        <TableCell align="left">{item.itemName} ({item.quantity})</TableCell>
                    </TableRow>
                    <TableRow >
                        <TableCell align="left">Final Price:</TableCell>
                        <TableCell align="left">${parseFloat(item.totalCost.toFixed(2))} {item.quantity > 1 && item.totalCost > 0 ? `($${parseFloat((item.singleItemValues.totalCost).toFixed(2))} per)`: null}</TableCell>
                    </TableRow>
                    <TableRow >
                        <TableCell align="left">Split Between: </TableCell>
                        <TableCell align="left">
                            <ul>
                                {item.involvedParties.map((party)=> (
                                    <li key={party}>{party}</li>
                                ))}
                            </ul>
                        </TableCell>
                    </TableRow>
                </TableBody>
                {editItemMode && editItemId == item.itemId && <AddItem
                    editItemMode={editItemMode}
                    parties={tempParties}
                    toggleModal={toggleEditMode}
                    showModal={editItemMode}
                    items={items}
                    setItems={setItems}
                    itemId={item.itemId}
                    />}
            </Table>
            <Button variant="outlined" onClick={handleRemoveItem} value={item.itemId}>Delete Item</Button>
        </div>
        
    ));

    return (
        <div>
            <h3 className="head">Item Details</h3>
            <TableContainer component={Paper}>
                {mappedItems}
            </TableContainer>
        </div>
    )
}

export default ItemsView;