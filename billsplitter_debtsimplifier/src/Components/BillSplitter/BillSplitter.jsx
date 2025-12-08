import { useState, useEffect } from "react";
import AddItem from "../AddItem/AddItem";

const BillSplitter = ({parties}) => {

    const [tempParties, setTempParties] = useState([]);
    const [partyInput, setPartyInput] = useState("");
    const [showPopup, setShowPopup] = useState(false);

    if (parties !== undefined) {
        setTempParties(...parties);
    }

    const onPartyInputChange = (event) => {
        setPartyInput(event.target.value);
    }

    const addTempParty = (event) => {
        event.preventDefault();
        if (partyInput.length > 0) {
            setTempParties(tempParties => [...tempParties, partyInput]);
        }
        setPartyInput("");
    }

    const togglePopup = () => {
        setShowPopup(!showPopup)
    }

    return (
        <div>
            <div>
                {tempParties}
            </div>
            {parties == undefined ? <div>
                <form>
                    <input type="text" placeholder="Party Name" value={partyInput} onChange={onPartyInputChange}></input>
                    <button type="submit" onClick={addTempParty}>Submit</button>
                </form>
            </div> : null}
            <div>
                <button onClick={togglePopup}>Add Item</button>
                {showPopup && tempParties.length>0 ? <AddItem users={tempParties} showPopup={showPopup} setShowPopup={setShowPopup}/>: null}
            </div>
            
        </div>
    )
}

export default BillSplitter;