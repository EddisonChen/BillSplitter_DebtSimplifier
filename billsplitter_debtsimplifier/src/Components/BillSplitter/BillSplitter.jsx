import { useState, useEffect } from "react";
import AddItem from "./SpeedDialActions/AddItem";
import SetPayor from "./SpeedDialActions/SetPayor";
import SetTax from "./SpeedDialActions/SetTax";
import SetTip from "./SpeedDialActions/SetTip";
import AddTempParty from "./SpeedDialActions/AddTempParty";
import { v4 as uuidv4 } from 'uuid';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import PersonIcon from '@mui/icons-material/Person';
import AddBoxIcon from '@mui/icons-material/AddBox';
import TollIcon from '@mui/icons-material/Toll';
import PercentIcon from '@mui/icons-material/Percent';
import './BillSplitter.css';
import Button from "@mui/material/Button";
import SummaryView from "./SummaryView/SummaryView";
import PartiesView from "./PartiesView/PartiesView";
import ItemsView from "./ItemsView/ItemsView";
import json from '../../OCRsample.json'
import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";
import { z } from "zod";

//Mui Tabs, Mui Speed Dial
// receipt scanner - involves: sending picture to backend, 

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
    const [aiResponse, setAiResponse] = useState();
    

    // const [editItemMode, setEditItemMode] = useState(false);
    const [tabView, setTabView] = useState(0);
    const [speedDialModal, setSpeedDialModal] = useState();

    // const itemPricePairing = z.object({
    //     name: z.string(),
    //     price: z.float64(),
    //     quantity: z.int64(),
    // })

    // const client = new OpenAI({
    //     dangerouslyAllowBrowser: true
    // });

    //     const aishit = async () => {
    //         const response = await client.responses.create({
    //         model: "gpt-5-nano",
    //         input: [
    //             {
    //                 role: "user",
    //                 content: [
    //                     {
    //                         type: "input_text",
    //                         text: "Please output key value pairs of items to prices, as well as tax, tip, and total price if applicable"
    //                     },
    //                     {
    //                         type: "input_image",
    //                         image_url: "https://ocr.space/Content/Images/receipt-ocr-original.jpg"
    //                     }
    //                 ]
    //             }
    //         ],
    //         text: {
    //             format: zodTextFormat(itemPricePairing, "")
    //         }
    //         });
    //         setAiResponse(response.output_text);
    //     }

    // console.log(aiResponse)


    

    const speedDialActions = [
        {icon: <AddBoxIcon/>, name: "Add Item", operation: "addItem"},
        {icon: <PersonIcon/>, name: "Set Payor", operation: "setPayor"},
        {icon: <TollIcon/>, name: "Tax", operation: "setTax"},
        {icon: <PercentIcon/>, name: "Tip", operation: "setTip"}
    ];

    const handleShowAddPartyModal = (event) => {
        event.preventDefault();
        setSpeedDialModal("addTempParty");
        toggleModal();
    }

    const handleSpeedDialClick = (event, operationType) => {
        event.preventDefault();
        setSpeedDialModal(operationType);
        toggleModal();
    };

    useEffect(() => {
        if (parties !== undefined) {
            setTempParties(parties);
        }
    }, [parties]);

    const toggleModal = () => {
        setShowModal(!showModal);
    };

    const handleTabView = (event, newValue) => {
        setTabView(newValue);
    };

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
                    if (tempItems[i].taxExempt === false) {
                        singleItemTaxAmount = (taxInput/100)*tempItems[i].singleItemValues.itemCost;
                        totalTaxAmount = (taxInput/100)*tempItems[i].itemCost;
                        tempItems[i].singleItemValues.taxAmount = singleItemTaxAmount;
                        tempItems[i].taxAmount = totalTaxAmount;
                    }
                }
            } else if (taxInputType === "amount") {
                let sumCost = 0;
                for (let i=0; i<tempItems.length; i++) {
                    if (tempItems[i].taxExempt === false) {
                        sumCost += tempItems[i].itemCost;
                    }
                }
                const taxPercentage = taxInput/sumCost;
                for (let i=0; i<tempItems.length; i++) {
                    if (tempItems[i].taxExempt === false) {
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
                    totalAmountOwed: 0,
                    baseAmount: 0,
                    tipAmount: 0,
                    taxAmount: 0,
                    payor: payor || "Payor",
                    items: []
                });
            }
            for (let i=0; i<partyCentric.length; i++) {
                for (let j=0; j<itemsWithCalculations.length; j++) {
                    if (itemsWithCalculations[j].involvedParties.includes(partyCentric[i].debtor)) {
                        const splitItemCost = itemsWithCalculations[j].totalCost/itemsWithCalculations[j].involvedParties.length;
                        partyCentric[i].totalAmountOwed += splitItemCost;
                        partyCentric[i].baseAmount += itemsWithCalculations[j].itemCost/itemsWithCalculations[j].involvedParties.length;
                        partyCentric[i].tipAmount += itemsWithCalculations[j].tipAmount/itemsWithCalculations[j].involvedParties.length;
                        partyCentric[i].taxAmount += itemsWithCalculations[j].taxAmount/itemsWithCalculations[j].involvedParties.length;
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
            {speedDialModal === "addTempParty" && <AddTempParty
                showModal={showModal}
                toggleModal={toggleModal}
                tempParties={tempParties}
                partyInput={partyInput}
                setPartyInput={setPartyInput}
                setTempParties={setTempParties}/>}
            {tabView === 2 && <ItemsView
                itemsWithCalculations={itemsWithCalculations}
                tempParties={tempParties}
                items={items}
                setItems={setItems}
                parties={parties}
                handleShowAddPartyModal={handleShowAddPartyModal}/>}
            {tabView === 1 && <PartiesView
                partyInformation={partyInformation}
                parties={parties}
                handleShowAddPartyModal={handleShowAddPartyModal}/>}
            {tabView === 0 && <SummaryView
                itemsWithCalculations={itemsWithCalculations}
                taxInput={taxInput}
                taxInputType={taxInputType}
                tipInput={tipInput}
                tipAfterTax={tipAfterTax}
                payor={payor}
                partyInformation={partyInformation}
                parties={parties}
                handleShowAddPartyModal={handleShowAddPartyModal}/>}
            {speedDialModal === "setTip" && <SetTip
                showModal={showModal}
                toggleModal={toggleModal}
                setTipInput={setTipInput}
                tipAfterTax={tipAfterTax}
                setTipAfterTax={setTipAfterTax}
                tipInput={tipInput}/>}
            {speedDialModal === "setTax" && <SetTax
                showModal={showModal}
                toggleModal={toggleModal}
                setTaxInput={setTaxInput}
                setTaxInputType={setTaxInputType}
                taxInput={taxInput}
                taxInputType={taxInputType}/>}
            {speedDialModal === "setPayor" && <SetPayor
                parties={tempParties}
                showModal={showModal} 
                toggleModal={toggleModal}
                setPayor={setPayor}
                payor={payor} />}
            {speedDialModal === "addItem" && <AddItem
                parties={tempParties} 
                showModal={showModal} 
                toggleModal={toggleModal}
                items={items}
                setItems={setItems}/>}
            {tempParties.length > 0 && <Box className="box" sx={{ height: 320, transform: 'translateZ(0px)', flexGrow: 1 }}>
                <SpeedDial
                    sx={{ position: 'fixed', bottom: 16, right: 16 }}
                    className="speed-dial"
                    ariaLabel="speeddial options"
                    icon={<SpeedDialIcon/>}>
                    {speedDialActions.map((action) => (
                        <SpeedDialAction
                            className="speed-dial-action"
                            key={speedDialActions.name}
                            value={speedDialActions.value}
                            icon={action.icon}
                            onClick={(event) => {
                                handleSpeedDialClick(event, action.operation)}}
                            slotProps={{
                                tooltip: {
                                    open: true,
                                    title: action.name}}}/>
                    ))}
                </SpeedDial>
            </Box>}
            <Box className="add-item-tabs">
                <Tabs
                    value={tabView} // indicates which tab is selected
                    variant="fullWidth"
                    scrollButtons="auto"
                    aria-label="add items tabs"
                    textColor="secondary"
                    indicatorColor="secondary"
                    onChange={handleTabView}
                    centered>
                    <Tab label="summary" value={0}/>
                    <Tab label="parties" value={1}/>
                    <Tab label="items" value={2}/>
                </Tabs>
            </Box>
            
        </div>
    )
}

export default BillSplitter;