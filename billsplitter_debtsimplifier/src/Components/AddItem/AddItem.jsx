import { useState } from "react";
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from "@mui/material/Button";
import Alert from "../../MiniComponents/MuiAlert/MuiAlert";

const AddItem = ({parties, setShowModal, showModal, items, setItems}) => {

    const [involvedParties, setInvolvedParties] = useState([]);
    const [itemCost, setItemCost] = useState();
    const [itemName, setItemName] = useState();
    const [alertMsg, setAlertMsg] = useState();
    const [taxExempt, setTaxExempt] = useState(false);
    const [alertStatus, setAlertStatus] = useState();
    const [quantity, setQuantity] = useState(1);

    const handleModalClose = () => {
        setShowModal(false);
    }

    const handleQuantityOnChange = (event) => {
        setQuantity(Number(event.target.value));
    }

    const handleQuantityOnBlur = (event) => {
        const input = Number(event.target.value);
        if (input < 1 || input === "") {
            setQuantity(1);
        } else if (input > 100) {
            setQuantity(100);
        }
    }

    console.log(quantity)
    
    // Updates item name/cost according on input
    const handleItemInput = (event) => {
        if (event.target.name === "itemName") {
            setItemName(event.target.value);
        } else if (event.target.name === "itemCost") {
            setItemCost(Number(event.target.value));
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
            <input type="checkbox" value={party} onChange={addPartyToItem} checked={involvedParties.includes(party) ? true : false}/><label>{party}</label>
        </div>
    ));


    const handleSubmit = () => {

        // Creates item object
        const itemObject = {
            itemName: itemName,
            itemCost: itemCost*quantity,
            involvedParties: involvedParties,
            taxAmount: 0,
            tipAmount: 0,
            totalCost: 0,
            taxExempt: taxExempt,
            quantity: quantity,
            singleItemValues: {
                itemCost: itemCost,
                taxAmount: 0,
                tipAmount: 0,
                totalCost: 0,
            }
        };

        // const itemObjects = [];

        // for (let i=0; i<quantity; i++) {
        //     itemObjects.push({
        //         itemName: itemName,
        //         itemCost: itemCost,
        //         involvedParties: involvedParties,
        //         taxAmount: 0,
        //         tipAmount: 0,
        //         totalCost: 0,
        //         taxExempt: taxExempt
        //     })
        // }

        setItems(items => [...items, itemObject]);

        // Resets all fields in form to blank --> preps for next item entry
        setItemCost("");
        setItemName("");
        setInvolvedParties([]);
        setTaxExempt(false);
        setQuantity(1);
    }

    console.log(items)

    // Ensures that all fields are populated and valid, sets alert message and status
    const validateInputs = (event) => {
        event.preventDefault();
        if (itemCost === undefined || itemCost === "" || itemCost === 0) {
            setAlertMsg("Please enter item cost!");
            setAlertStatus("warning")
        } else if (itemName === undefined || itemName === "") {
            setAlertMsg("Please enter item name!");
            setAlertStatus("warning")
        } else if (involvedParties.length < 1) {
            setAlertMsg("Please select at least one party");
            setAlertStatus("warning")
        } else if (quantity === "" || quantity === undefined || quantity === 0) {
            setAlertMsg("Please enter item quantity of at least 1");
            setAlertStatus("warning")
        } else {
            handleSubmit();
            setAlertMsg("Item submitted successfully!")
            setAlertStatus("success")
        }
    }

    const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '80%',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

    return(
        <Modal
        open={showModal}
        onClose={handleModalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Add Item
          </Typography>
            <form>
                <input type="text" placeholder="Item Name" name="itemName" onChange={handleItemInput} value={itemName}></input>
                <input type="number" placeholder="Item Cost" name="itemCost" onChange={handleItemInput} value={itemCost}></input>
                <input type="checkbox" name="taxExemptCheckbox" onChange={handleTaxExempt} checked={taxExempt}></input><label>Tax Exempt?</label>
                <input type="number" onChange={handleQuantityOnChange} onBlur={handleQuantityOnBlur} name="quantity" value={quantity}></input><label>Item Quantity</label>
                <p>Who was included in this item?</p>
                {involvedPartiesCheckboxes}
                <Button type="submit" onClick={validateInputs} variant="outlined">Submit Item</Button>
            </form>
            {alertMsg && <Alert
            severity={alertStatus}
            // title={alertStatus}
            message={alertMsg}></Alert>}
        </Box>
      </Modal>
    )
}

export default AddItem;