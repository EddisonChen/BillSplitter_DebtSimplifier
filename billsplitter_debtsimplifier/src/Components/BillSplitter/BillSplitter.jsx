import { useState, useEffect } from "react";
import AddItem from "../AddItem/AddItem";

const BillSplitter = ({parties}) => {

    const [tempParties, setTempParties] = useState([]);
    const [partyInput, setPartyInput] = useState("");
    const [showPopup, setShowPopup] = useState(false);
    const [items, setItems] = useState([]);
    const [payor, setPayor] = useState();
    const [taxInputType, setTaxInputType] = useState("percentage");
    const [taxInput, setTaxInput] = useState(0);
    const [tipInput, setTipInput] = useState(0);
    const [tipAfterTax, setTipAfterTax] = useState(false);

    const handleTipAfterTax = () => {
        setTipAfterTax(!tipAfterTax);
    }

    const handleTaxInputTypeSwitch = (event) => {
        setTaxInputType(event.target.value);
    }

    const handleTaxInput = (event) => {
        setTaxInput(Number(event.target.value));
    }

    const handleTipInput = (event) => {
        setTipInput(Number(event.target.value)/100);
    }

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

    const updatePaymentCalculation = () => {

    }

    useEffect(() => {
        updatePaymentCalculation();
    }, [items])

    const showItems = items.map((item) => (
        <tr>
            <td>{item.itemName}</td>
            <td>{item.itemCost}</td>
            <td>{item.involvedUsers}</td>
        </tr>

    ));

    const handlePayor = (event) => {
        setPayor(event.target.value);
    }

    const calculateTax = () => {
        let taxAmountperItem;
        const temp = [...items];
        if (taxInputType == "percentage") {
            for (let i=0; i<temp.length; i++) {
                taxAmountperItem = (taxInput/100)*temp[i].itemCost;
                temp[i].taxAmount = taxAmountperItem
            }
        } else if (taxInputType == "amount") {
            let sumCost = 0;
            for (let i=0; i<temp.length; i++) {
                sumCost += temp[i].itemCost
            }
            const tipPercentage = taxInput/sumCost;
            for (let i=0; i<temp.length; i++) {
                taxAmountperItem = tipPercentage*temp[i].itemCost;
                temp[i].taxAmount = taxAmountperItem
            }
        }
        setItems(temp);
    }

    const calculateTip = () => {
        const temp = [...items];
        for (let i=0; i<temp.length; i++) {
            if (tipAfterTax) {
                const costPlusTip = temp[i].itemCost + temp[i].taxAmount;
                temp[i].tipAmount = tipInput*costPlusTip;
            } else {
                temp[i].tipAmount = tipInput*temp[i].itemCost;
            }
        }
        setItems(temp);
    }

    useEffect(() => {
        calculateTax();
    }, [items.length, taxInput, taxInputType]);

    useEffect(() => {
        calculateTip();
    }, [items.length, taxInput, taxInputType, tipInput]);

    console.log(items)

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
            <select onChange={handlePayor} defaultValue="">
                <option disabled="disabled" value="">--Select Payor--</option>
                {tempParties.map((party) => (
                    <option value={party} key={party}>{party}</option>
                ))}
            </select>
            <div>
                <button onClick={togglePopup}>Add Item</button>
                {showPopup && tempParties.length>0 ? <AddItem 
                    users={tempParties} 
                    showPopup={showPopup} 
                    setShowPopup={setShowPopup}
                    items={items}
                    setItems={setItems}
                    />: null}
            </div>
            <div>
                <input type="number" placeholder="Tip %" onChange={handleTipInput}></input>
                <input type="number" placeholder="Tax" onChange={handleTaxInput}></input>
                <input type="checkbox" onChange={handleTipAfterTax}></input><label>Tip After Tax?</label>
                <div>
                    <p>Tax Input Type</p>
                    <input type="radio" name="Tax Input Type" value="percentage" defaultChecked onChange={handleTaxInputTypeSwitch}></input><label>Percentage</label>
                    <input type="radio" name="Tax Input Type" value="amount" onChange={handleTaxInputTypeSwitch}></input><label>Dollar Amount</label>
                </div>            
            </div>
            {items.length > 0 && (
                <div>
                    <table>
                        <thead>
                            <tr>
                                <th>Item Name:</th>
                                <th>Item Cost:</th>
                                <th>Split Between:</th>
                            </tr>
                        </thead>
                        <tbody>
                            {showItems}
                        </tbody>
                </table>
                <table>
                    <thead>
                        <tr>
                            <th>Cost of Items</th>
                            <th>Total Tip Amount:</th>
                            <th>Final Cost</th>
                        </tr>
                    </thead>
                    
                </table>
                </div>

                
            )}
            
        </div>
    )
}

export default BillSplitter;