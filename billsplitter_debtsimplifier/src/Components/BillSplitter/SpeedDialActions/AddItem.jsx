import { useEffect, useState } from "react";
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from "@mui/material/Button";
import Alert from "../../../MiniComponents/MuiAlert/MuiAlert";
import { v4 as uuidv4 } from 'uuid';
import AddIcon from '@mui/icons-material/Add';
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import TextField from "@mui/material/TextField";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from '@mui/icons-material/Delete';

// fix success alert message
// fix uncontroll price input
// when trying to edit items, only able to edit most recently added

const AddItem = ({editItemMode, parties, toggleModal, showModal, items, setItems, itemId}) => {

    const [involvedParties, setInvolvedParties] = useState([]);
    const [itemCost, setItemCost] = useState(0);
    const [itemName, setItemName] = useState('');
    const [alertMsg, setAlertMsg] = useState();
    const [taxExempt, setTaxExempt] = useState(false);
    const [alertStatus, setAlertStatus] = useState();
    const [quantity, setQuantity] = useState(1);

    const handleRemoveItem = () => {
        const updatedItems = items.filter(item => item.itemId !== itemId);
        setItems(updatedItems);
        toggleModal();
    }

    useEffect(() => {
        if (editItemMode) {
            for (let i=0; i<items.length; i++) {
                if (items[i].itemId === itemId) {
                    setInvolvedParties(items[i].involvedParties);
                    setItemCost(items[i].singleItemValues.itemCost);
                    setItemName(items[i].itemName);
                    setTaxExempt(items[i].taxExempt);
                    setQuantity(items[i].quantity);
                }
            }
        }
    }, [editItemMode, itemId, items])

    const handleQuantityOnChange = (event) => {
        setQuantity(event.target.value);
    }

    const handleQuantityOnBlur = (event) => {
        const input = Number(event.target.value);
        if (input < 1 || input === "") {
            setQuantity(1);
        } else if (input > 100) {
            setQuantity(100);
        }
    }
    
    // Updates item name/cost according on input
    const handleItemInput = (event) => {
        if (event.target.name === "itemName") {
            setItemName(event.target.value);
        } else if (event.target.name === "itemCost") {
            setItemCost(event.target.value);
        }
    }

    // Allows users to mark items as tax exempt
    const handleTaxExempt = (event) => {
        if (event.target.checked) {
            setTaxExempt(true);
        } else {
            setTaxExempt(false);
        }
    }

    // Checked parties will be included in the split for the item
    const addPartyToItem = (event) => {
        if (event.target.checked) {
            setInvolvedParties(involvedParties => [...involvedParties, event.target.value]);
        } else {
            setInvolvedParties(involvedParties => involvedParties.filter(party => party !== event.target.value));
        }
    }

    // Generates checkboxes for the parties available
    const involvedPartiesCheckboxes = parties.map((party) => (
        <div key={party}>
            <FormControlLabel control={<Checkbox/>} value={party} onChange={addPartyToItem} checked={involvedParties.includes(party) ? true : false} label={party}/>
        </div>
    ));


    const handleSubmit = () => {

        const numItemCost = Number(itemCost);
        const numQuantity = Number(quantity);

        // Creates item object
        if (!editItemMode) {
            const itemObject = {
                itemId: uuidv4(),
                itemName: itemName,
                itemCost: numItemCost*numQuantity,
                involvedParties: involvedParties,
                taxAmount: 0,
                tipAmount: 0,
                totalCost: 0,
                taxExempt: taxExempt,
                quantity: numQuantity,
                singleItemValues: {
                    itemCost: numItemCost,
                    taxAmount: 0,
                    tipAmount: 0,
                    totalCost: 0,
            }
        };
            setItems(items => [...items, itemObject]);
        } else {
            const tempItems = structuredClone(items);
            for (let i=0; i<tempItems.length; i++) {
                if (tempItems[i].itemId === itemId) {
                    tempItems[i].itemName = itemName;
                    tempItems[i].itemCost = numItemCost*numQuantity;
                    tempItems[i].involvedParties = involvedParties;
                    tempItems[i].taxAmount = tempItems[i].tipAmount = tempItems[i].totalCost = 0;
                    tempItems[i].taxExempt = taxExempt;
                    tempItems[i].quantity = numQuantity;
                    tempItems[i].singleItemValues.itemCost = numItemCost;
                    tempItems[i].singleItemValues.taxAmount = tempItems[i].singleItemValues.tipAmount = tempItems[i].singleItemValues.totalCost = 0;
                }
            }
            setItems(tempItems);
            toggleModal();
        }

        // Resets all fields in form to blank --> preps for next item entry
        setItemCost("");
        setItemName("");
        setInvolvedParties([]);
        setTaxExempt(false);
        setQuantity(1);
    }

    // Ensures that all fields are populated and valid, sets alert message and status
    const validateInputs = (event) => {
        event.preventDefault();
        if (itemCost === undefined || itemCost === "" || itemCost === 0) {
            setAlertMsg("Please enter item cost!");
            setAlertStatus("warning");
        } else if (itemName === undefined || itemName === "") {
            setAlertMsg("Please enter item name!");
            setAlertStatus("warning");
        } else if (involvedParties.length < 1) {
            setAlertMsg("Please select at least one party");
            setAlertStatus("warning");
        } else if (quantity === "" || quantity === undefined || quantity === 0) {
            setAlertMsg("Please enter item quantity of at least 1");
            setAlertStatus("warning");
        } else {
            handleSubmit();
            setAlertMsg("Item submitted successfully!");
            setAlertStatus("success");
        }
        setTimeout(()=> {
            setAlertMsg();
            setAlertStatus();
        }, "5000")
    }

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '65%',
        bgcolor: 'background.paper',
        borderRadius: "15px",
        boxShadow: 24,
        p: 4,
        overflowY: 'auto',
        maxHeight: '85vh'
    };

    return(
        <Modal
            open={showModal}
            onClose={toggleModal}
            aria-labelledby="Add/edit item modal"
            aria-describedby="modal to add items or edit item on bill"
        >
            <Box sx={style}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                    {editItemMode ? 'Edit Item' : 'Add Item'}
                </Typography>
                <FormControl>
                    <FormLabel>Item Name</FormLabel>
                    <TextField type="text" variant="outlined" size="small" placeholder="Item Name" name="itemName" onChange={handleItemInput} value={itemName}></TextField>
                    <FormLabel>Item Cost</FormLabel>
                    <TextField type="number" variant="outlined" size="small" placeholder="Item Cost" name="itemCost" onChange={handleItemInput} value={itemCost}></TextField>                    <FormLabel>Quantity</FormLabel>
                    <TextField type="number" variant="outlined" size="small" onChange={handleQuantityOnChange} onBlur={handleQuantityOnBlur} name="quantity" value={quantity}></TextField>
                    <FormControlLabel control={<Checkbox/>} name="taxExemptCheckbox" onChange={handleTaxExempt} checked={taxExempt} label="Tax Exempt"/>
                    <FormLabel>Who was included in this item?</FormLabel>
                    {involvedPartiesCheckboxes}
                    <Button type="submit" onClick={validateInputs} variant="outlined" endIcon={<AddIcon/>}>Submit</Button>
                    {editItemMode && itemId && <IconButton aria-label="delete item button" onClick={handleRemoveItem}><DeleteIcon/></IconButton>}
                </FormControl>
                {alertMsg && <Alert
                severity={alertStatus}
                // title={alertStatus}
                message={alertMsg}></Alert>}
            </Box>
        </Modal>
    )
}

export default AddItem;