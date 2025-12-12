import { useState } from "react"
import WarningAlert from "../../MiniComponents/Alert/Alert";

const AddItem = ({users, setShowPopup, items, setItems}) => {

    const [involvedUsers, setInvolvedUsers] = useState([]);
    const [itemCost, setItemCost] = useState();
    const [itemName, setItemName] = useState();
    const [warning, setWarning] = useState();
    
    const handleItemInput = (event) => {
        if (event.target.name == "itemName") {
            setItemName(event.target.value);
        } else if (event.target.name == "itemCost") {
            setItemCost(Number(event.target.value));
        }
    }

    const addUserToItem = (event) => {
        if (event.target.checked) {
            setInvolvedUsers(involvedUsers => [...involvedUsers, event.target.value]);
        } else {
            setInvolvedUsers(involvedUsers => involvedUsers.filter(user => user !== event.target.value));
        }
    }

    const involvedUserCheckboxes = users.map((user) => (
        <div>
            {user}<input type="checkbox" value={user} onChange={addUserToItem} key={user}/>
        </div>
    ));

    const handleSubmit = () => {

        const itemObject = {
            itemName: itemName,
            itemCost: itemCost,
            involvedUsers: involvedUsers,
            taxAmount: 0,
            tipAmount: 0,
            totalCost: 0,
        };

        setItems(items => [...items, itemObject]);

        setShowPopup();
    }

    const validateInputs = (event) => {
        event.preventDefault();
        if (itemCost == undefined || itemCost == "" || itemName == undefined || itemName == "") {
            setWarning("One or more fields empty!");
        } else if (involvedUsers.length < 1) {
            setWarning("Please select at least one user");
        } else {
            handleSubmit()
        }
        
    }

    return(
        <div>
            <form>
                <input type="text" placeholder="Item Name" name="itemName" onChange={handleItemInput}></input>
                <input type="number" placeholder="Item Cost" name="itemCost" onChange={handleItemInput}></input>
                {involvedUserCheckboxes}
                <button type="submit" onClick={validateInputs}>Submit Item</button>
            </form>
            {warning && (
                <WarningAlert message={warning} />
            )}
        </div>
    )
}

export default AddItem;