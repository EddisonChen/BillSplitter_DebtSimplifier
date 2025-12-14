import { useState } from "react"
import WarningAlert from "../../MiniComponents/Alert/Alert";

const AddItem = ({parties, setShowPopup, items, setItems}) => {

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
            <label>{party}</label><input type="checkbox" value={party} onChange={addPartyToItem}/>
        </div>
    ));

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

        setShowPopup();
    }

    const validateInputs = (event) => {
        event.preventDefault();
        if (itemCost === undefined || itemCost === "" || itemName === undefined || itemName === "") {
            setWarning("One or more fields empty!");
        } else if (involvedParties.length < 1) {
            setWarning("Please select at least one party");
        } else {
            handleSubmit()
        }
        
    }

    return(
        <div>
            <form>
                <input type="text" placeholder="Item Name" name="itemName" onChange={handleItemInput}></input>
                <input type="number" placeholder="Item Cost" name="itemCost" onChange={handleItemInput}></input>
                {involvedPartiesCheckboxes}
                <button type="submit" onClick={validateInputs}>Submit Item</button>
            </form>
            {warning && (
                <WarningAlert message={warning} />
            )}
        </div>
    )
}

export default AddItem;