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
    const [warning, setWarning] = useState();
    
    const handleItemInput = (event) => {
        if (event.target.name === "itemName") {
            setItemName(event.target.value);
        } else if (event.target.name === "itemCost") {
            setItemCost(Number(event.target.value));
        }
    }

    const addPartyToItem = (event) => {
        if (event.target.checked) {
            setInvolvedParties(involvedParties => [...involvedParties, event.target.value]);
        } else {
            setInvolvedParties(involvedParties => involvedParties.filter(party => party !== event.target.value));
        }
    }

    const involvedPartiesCheckboxes = parties.map((party) => (
        <div key={party}>
            <input type="checkbox" value={party} onChange={addPartyToItem}/><label>{party}</label>
        </div>
    ));

    const handleModalClose = () => {
        setShowModal(false);
    }

    const handleSubmit = () => {

        const itemObject = {
            itemName: itemName,
            itemCost: itemCost,
            involvedParties: involvedParties,
            taxAmount: 0,
            tipAmount: 0,
            totalCost: 0,
        };

        setItems(items => [...items, itemObject]);

        handleModalClose();
    }

    const validateInputs = (event) => {
        event.preventDefault();
        if (itemCost === undefined || itemCost === "" || itemName === undefined || itemName === "") {
            setWarning("One or more fields empty!");
        } else if (involvedParties.length < 1) {
            setWarning("Please select at least one party");
        } else {
            handleSubmit();
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
                <input type="text" placeholder="Item Name" name="itemName" onChange={handleItemInput}></input>
                <input type="number" placeholder="Item Cost" name="itemCost" onChange={handleItemInput}></input>
                <p>Who was included in this item?</p>
                {involvedPartiesCheckboxes}
                <Button type="submit" onClick={validateInputs} variant="outlined">Submit Item</Button>
            </form>
            {warning && <Alert
            severity={"warning"}
            title={"Warning"}
            message={warning}></Alert>}
        </Box>
      </Modal>
    )
}

export default AddItem;