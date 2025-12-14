import { useState, useEffect } from "react";
import AddItem from "../AddItem/AddItem";
import MuiAlert from "../../MiniComponents/MuiAlert/MuiAlert";
import { v4 as uuidv4 } from 'uuid';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';

//Mui Tabs, Mui Speed Dial
// receipt scanner
// UI - Summary view: Total, tax, tip, amount owed to payor by parties
// - Person view - List items, costs per party
// - Item view - List people, costs per item

const BillSplitter = ({parties}) => {

    const [tempParties, setTempParties] = useState([]);
    const [partyInput, setPartyInput] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [items, setItems] = useState([]);
    const [itemsWithCalculations, setItemsWithCalculations] = useState([]);
    const [payor, setPayor] = useState();
    const [taxInputType, setTaxInputType] = useState("percentage");
    const [taxInput, setTaxInput] = useState(0);
    const [tipInput, setTipInput] = useState(0);
    const [tipAfterTax, setTipAfterTax] = useState(false);
    const [partyInformation, setPartyInformation] = useState([]);
    const [warning, setWarning] = useState();
    const [editItemMode, setEditItemMode] = useState(false);

    useEffect(() => {
        if (parties !== undefined) {
            setTempParties(parties);
        }
    }, [parties]);

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

    const handlePartyInputChange = (event) => {
        setPartyInput(event.target.value);
    };

    const handlePayor = (event) => {
        setPayor(event.target.value);
    };

    const toggleModal = () => {
        setShowModal(!showModal);
    };

    const toggleEditMode = () => {
        setEditItemMode(!editItemMode);
    }

    const handleRemoveItem = (event) => {
        const id = event.target.value;
        const updatedItems = items.filter(item => item.itemId !== id);
        setItems(updatedItems);
    }

    // Displays items on page with options to edit or remove
    const showItems = itemsWithCalculations.map((item) => (
        <tr key={item.itemId}>
            <td onClick={toggleEditMode}>{item.itemName}</td>
            <td>{item.itemCost}</td>
            <td>{item.involvedParties}</td>
            {editItemMode && <AddItem
                editItemMode={editItemMode}
                parties={tempParties}
                setShowModal={setEditItemMode}
                showModal={editItemMode}
                items={items}
                setItems={setItems}
                itemId={item.itemId}
                />
                }
            <button onClick={handleRemoveItem} value={item.itemId}>Remove Item</button>
        </tr>
    ));

    
    useEffect(() => {
        //add up total cost of non-tax exempt items
        // if percentage - calculate tax only on non-exempt items
        // if amount - calculate tax percentage via tax amount/total cost of non-exempt items
        const calculateTax = () => {
            let singleItemTaxAmount;
            let totalTaxAmount;
            const tempItems = structuredClone(items);
            if (taxInputType === "percentage") {
                for (let i=0; i<tempItems.length; i++) {
                    if (tempItems[i].taxExempt == false) {
                        singleItemTaxAmount = (taxInput/100)*tempItems[i].singleItemValues.itemCost;
                        totalTaxAmount = (taxInput/100)*tempItems[i].itemCost;
                        tempItems[i].singleItemValues.taxAmount = singleItemTaxAmount;
                        tempItems[i].taxAmount = totalTaxAmount;
                    }
                }
            } else if (taxInputType === "amount") {
                let sumCost = 0;
                for (let i=0; i<tempItems.length; i++) {
                    if (tempItems[i].taxExempt == false) {
                        sumCost += tempItems[i].itemCost;
                    }
                }
                const taxPercentage = taxInput/sumCost;
                for (let i=0; i<tempItems.length; i++) {
                    if (tempItems[i].taxExempt == false) {
                        singleItemTaxAmount = taxPercentage*tempItems[i].singleItemValues.itemCost;
                        totalTaxAmount = taxPercentage*tempItems[i].itemCost;
                        tempItems[i].taxAmount = totalTaxAmount;
                    }
                }
            }
            return tempItems;
        }

        // Calculates tip based on if applied before/after tax
        const calculateTip = (tempItems) => {
            for (let i=0; i<tempItems.length; i++) {
                if (tipAfterTax) {
                    const singleItemCostPlusTax = tempItems[i].singleItemValues.itemCost + tempItems[i].singleItemValues.taxAmount;
                    const costPlusTax = tempItems[i].itemCost + tempItems[i].taxAmount;
                    tempItems[i].singleItemValues.tipAmount = tipInput*singleItemCostPlusTax;
                    tempItems[i].tipAmount = tipInput*costPlusTax;
                } else {
                    tempItems[i].singleItemValues.tipAmount = tipInput*tempItems[i].singleItemValues.itemCost;
                    tempItems[i].tipAmount = tipInput*tempItems[i].itemCost;
                }
            }
            return tempItems;
        }
        
        // Updates itemsWithCalculations Object
        const calculateFinalItemCost = () => {
            const itemsv1 = calculateTax();
            const itemsv2 = calculateTip(itemsv1);

            for (let i=0; i<itemsv2.length; i++) {
                itemsv2[i].totalCost = itemsv2[i].itemCost + itemsv2[i].taxAmount + itemsv2[i].tipAmount;
                itemsv2[i].singleItemValues.totalCost = itemsv2[i].singleItemValues.itemCost + itemsv2[i].singleItemValues.taxAmount + itemsv2[i].singleItemValues.tipAmount;
            }
            setItemsWithCalculations(itemsv2);
        }

        calculateFinalItemCost();

    }, [taxInput, taxInputType, tipInput, items, tipAfterTax]);

    useEffect(() => {
        // Creates party-centered object
        const updatePaymentCalculation = () => {
            const partyCentric = [];
            for (let i=0; i<tempParties.length; i++) {
                partyCentric.push({
                    trxId: uuidv4(),
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
                            itemId:itemsWithCalculations[j].itemId,
                            itemName: itemsWithCalculations[j].itemName,
                            amountOwedOnItem: splitItemCost,
                            splitWith: itemsWithCalculations[j].involvedParties.filter((party)=> (party !== partyCentric[i].debtor)),
                            quantity: itemsWithCalculations[j].quantity,
                        });
                    }
                }
            }
            setPartyInformation(partyCentric);
        }
        updatePaymentCalculation();
    }, [itemsWithCalculations, payor, tempParties]);
    

    console.log(itemsWithCalculations)
    console.log(partyInformation)

    return (
        <div>
            <div>
                {tempParties}
            </div>
            {parties === undefined ? <div>
                <form>
                    <input type="text" placeholder="Party Name" value={partyInput} onChange={handlePartyInputChange}></input>
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
                {tempParties.length > 0 && <button onClick={toggleModal}>Add Item</button>}
                {showModal && <AddItem 
                    parties={tempParties} 
                    showModal={showModal} 
                    setShowModal={setShowModal}
                    items={items}
                    setItems={setItems}
                    />}
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
            <Box sx={{ maxWidth: { xs: 320, sm: 480 }, bgcolor: 'background.paper' }}>
                <Tabs
                    value={2} // indicates which tab is selected
                    variant="fullWidth"
                    scrollButtons="auto"
                    aria-label="scrollable auto tabs example"
                    textColor="secondary"
                    indicatorColor="secondary"
                    centered>
                    <Tab label="Summary"/>
                    <Tab label="Parties"/>
                    <Tab label="Items"/>
                </Tabs>
            </Box>
            
        </div>
    )
}

export default BillSplitter;