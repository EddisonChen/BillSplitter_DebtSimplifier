import { useState, useEffect } from "react";
import AddItem from "../AddItem/AddItem";
import MuiAlert from "../../MiniComponents/MuiAlert/MuiAlert";

const BillSplitter = ({parties}) => {

    const [tempParties, setTempParties] = useState([]);
    const [partyInput, setPartyInput] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [items, setItems] = useState([]);
    const [itemsWithCalculations, setItemsWithCalculations] = useState();
    const [payor, setPayor] = useState();
    const [taxInputType, setTaxInputType] = useState("percentage");
    const [taxInput, setTaxInput] = useState(0);
    const [tipInput, setTipInput] = useState(0);
    const [tipAfterTax, setTipAfterTax] = useState(false);
    const [partyInformation, setPartyInformation] = useState([]);
    const [warning, setWarning] = useState();

    useEffect(() => {
        if (parties !== undefined) {
            setTempParties(parties);
        }
    }, [parties]);

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

    const onPartyInputChange = (event) => {
        setPartyInput(event.target.value);
    };

    const addTempParty = (event) => {
        event.preventDefault();
        if (partyInput.length > 0) {
            if (!tempParties.includes(partyInput)) {
                setTempParties(tempParties => [...tempParties, partyInput]);
                setWarning();
            } else {
                setWarning("Party cannot have the same name as an existing party");
            }
            
        }
        setPartyInput("");
    };

    const togglePopup = () => {
        setShowModal(!showModal);
    };

    const showItems = items.map((item) => (
        <tr key={item.itemName}>
            <td>{item.itemName}</td>
            <td>{item.itemCost}</td>
            <td>{item.involvedParties}</td>
        </tr>

    ));

    const handlePayor = (event) => {
        setPayor(event.target.value);
    };

    useEffect(() => {
        const calculateTax = () => {
            let taxAmountperItem;
            const tempItems = [...items];
            if (taxInputType === "percentage") {
                for (let i=0; i<tempItems.length; i++) {
                    taxAmountperItem = (taxInput/100)*tempItems[i].itemCost;
                    tempItems[i].taxAmount = taxAmountperItem;
                }
            } else if (taxInputType === "amount") {
                let sumCost = 0;
                for (let i=0; i<tempItems.length; i++) {
                    sumCost += tempItems[i].itemCost;
                }
                const tipPercentage = taxInput/sumCost;
                for (let i=0; i<tempItems.length; i++) {
                    taxAmountperItem = tipPercentage*tempItems[i].itemCost;
                    tempItems[i].taxAmount = taxAmountperItem
                }
            }
            return tempItems;
        }

    const calculateTip = (tempItems) => {
        for (let i=0; i<tempItems.length; i++) {
            if (tipAfterTax) {
                const costPlusTip = tempItems[i].itemCost + tempItems[i].taxAmount;
                tempItems[i].tipAmount = tipInput*costPlusTip;
            } else {
                tempItems[i].tipAmount = tipInput*tempItems[i].itemCost;
            }
        }
        return tempItems;
    }

    const calculateFinalItemCost = () => {
        const itemsv1 = calculateTax();
        const itemsv2 = calculateTip(itemsv1);

        for (let i=0; i<itemsv2.length; i++) {
            itemsv2[i].totalCost = itemsv2[i].itemCost + itemsv2[i].taxAmount + itemsv2[i].tipAmount;
        }
        setItemsWithCalculations(itemsv2);
    }
    calculateFinalItemCost();
    }, [items.length, taxInput, taxInputType, tipInput, items, tipAfterTax]);

    useEffect(() => {
        const updatePaymentCalculation = () => {
            const partyCentric = [];
            for (let i=0; i<tempParties.length; i++) {
                partyCentric.push({
                    debtor: tempParties[i],
                    amountOwed: 0,
                    payor: payor || "Payor",
                    items: []
                });
            }
            for (let i=0; i<partyCentric.length; i++) {
                for (let j=0; j<itemsWithCalculations.length; j++) {
                    if (itemsWithCalculations[j].involvedParties.includes(partyCentric[i].debtor)) {
                        const splitItemCost = itemsWithCalculations[j].totalCost/itemsWithCalculations[j].involvedParties.length;
                        partyCentric[i].amountOwed += splitItemCost;
                        partyCentric[i].items.push({
                            itemName: itemsWithCalculations[j].itemName,
                            amountOwedOnItem: splitItemCost,
                            splitWith: itemsWithCalculations[j].involvedParties.filter((party)=> (party !== partyCentric[i].debtor)),
                        });
                    }
                }
            }
            setPartyInformation(partyCentric);
        }
        updatePaymentCalculation();
    }, [itemsWithCalculations, payor, tempParties]);
    

    console.log(items)
    console.log(partyInformation)

    return (
        <div>
            <div>
                {tempParties}
            </div>
            {parties === undefined ? <div>
                <form>
                    <input type="text" placeholder="Party Name" value={partyInput} onChange={onPartyInputChange}></input>
                    <button type="submit" onClick={addTempParty}>Add Party</button>
                </form>
                {warning && <MuiAlert
                    severity={"warning"}
                    message={warning}></MuiAlert>}
            </div> : null}
            <select onChange={handlePayor} defaultValue="">
                <option disabled="disabled" value="">--Select Payor--</option>
                {tempParties.map((party) => (
                    <option value={party} key={party}>{party}</option>
                ))}
            </select>
            <div>
                <button onClick={togglePopup}>Add Item</button>
                {showModal && tempParties.length>0 ? <AddItem 
                    parties={tempParties} 
                    showModal={showModal} 
                    setShowModal={setShowModal}
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
            {parties && <button>Add to Debt Simplifier</button>}
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